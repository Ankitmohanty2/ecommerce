import { PLACEHOLDER_IMAGE } from "./fashionImages";
import {
  listProducts,
  getProductDetail,
  searchByBarcode,
  searchProducts as hmSearch,
} from "./hmClient";

const toHexColor = (code) => {
  if (!code) return null;
  const value = String(code).trim();
  if (value.startsWith("#")) return value;
  if (/^[0-9a-fA-F]{6}$/.test(value)) return `#${value}`;
  return value;
};

const fixHmImage = (url) => {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `https://www2.hm.com${url}`;
  if (url.startsWith("http")) return url;
  return `https://image.hm.com/${url.replace(/^\//, "")}`;
};

const collectImages = (raw) => {
  const images = [];
  const push = (value) => {
    const fixed = fixHmImage(value);
    if (fixed && !images.includes(fixed)) images.push(fixed);
  };

  push(raw.productImage);
  push(raw.modelImage);
  push(raw.imageProductSrc);
  push(raw.imageModelSrc);

  if (Array.isArray(raw.images)) {
    raw.images.forEach((img) => {
      if (typeof img === "string") push(img);
      else push(img.url || img.baseUrl);
    });
  }

  if (Array.isArray(raw.swatches)) {
    raw.swatches.forEach((swatch) => push(swatch.productImage));
  }

  if (Array.isArray(raw.articlesList)) {
    raw.articlesList.forEach((article) => {
      if (Array.isArray(article.galleryDetails)) {
        article.galleryDetails.forEach((img) => push(img.url || img.baseUrl));
      }
    });
  }

  return images.length ? images.slice(0, 8) : [PLACEHOLDER_IMAGE];
};

const extractPrice = (raw) => {
  if (Array.isArray(raw.prices) && raw.prices.length) {
    const white = raw.prices.find((p) => p.priceType === "whitePrice");
    const red = raw.prices.find((p) => p.priceType === "redPrice");
    const mrp = Math.round(white?.price || red?.price || 0);
    const cost = Math.round(red?.price || white?.price || 0);
    const safeMrp = Math.max(mrp, cost);
    const safeCost = cost || safeMrp;
    const discountPct =
      safeMrp > safeCost
        ? Math.round(((safeMrp - safeCost) / safeMrp) * 100)
        : 0;
    return { mrp: safeMrp, cost: safeCost, discountPct };
  }

  const whiteValue =
    raw.whitePrice?.price ?? raw.whitePrice?.value ?? raw.priceMin ?? raw.price;
  const redValue = raw.redPrice?.price ?? raw.redPrice?.value;
  const currency = raw.whitePrice?.currency || raw.redPrice?.currency || "INR";

  let mrp = Math.round(Number(whiteValue || redValue || 0));
  let cost = Math.round(Number(redValue || whiteValue || 0));

  if (currency === "USD") {
    mrp = Math.round(mrp * 84);
    cost = Math.round(cost * 84);
  }

  const safeMrp = Math.max(mrp, cost);
  const safeCost = cost || safeMrp;
  const discountPct =
    safeMrp > safeCost ? Math.round(((safeMrp - safeCost) / safeMrp) * 100) : 0;

  return { mrp: safeMrp, cost: safeCost, discountPct };
};

const extractColorSwatches = (raw) => {
  const swatches = [];

  if (Array.isArray(raw.swatches)) {
    raw.swatches.forEach((swatch) => {
      const hex = toHexColor(swatch.colorCode || swatch.hex);
      if (hex) swatches.push(hex);
    });
  }

  if (raw.color?.rgbColor) swatches.push(raw.color.rgbColor);
  if (raw.colors) swatches.push(toHexColor(raw.colors));
  if (raw.colorName) swatches.push(raw.colorName);

  return [...new Set(swatches)].slice(0, 6);
};

export const normalizeHmProduct = (raw, fallbackCategory = "fashion") => {
  const code = raw.code || raw.id || raw.articleId || raw.productCode;
  const title =
    raw.name ||
    raw.productName ||
    raw.title ||
    raw.sapProductName ||
    "H&M Product";

  const images = collectImages(raw);
  const { mrp, cost, discountPct } = extractPrice(raw);
  const brand = raw.brandName || raw.brand || "H&M";
  const category =
    raw.mainCatCode ||
    raw.mainCategory?.code ||
    raw.category ||
    fallbackCategory;

  const tags = [];
  if (raw.newArrival || raw.newProduct) tags.push({ title: "NEW" });
  if (raw.percentageDiscount) tags.push({ title: "SALE" });
  if (discountPct >= 25) tags.push({ title: "BESTSELLER" });

  const article = raw.articlesList?.[0];

  return {
    _id: `hm-${code}`,
    id: `hm-${code}`,
    hmCode: String(code),
    title: { shortTitle: title, longTitle: title },
    subTitle: title,
    description: raw.description || article?.description || title,
    brand,
    category,
    rating: 4.3,
    stock:
      raw.availability?.stockState === "Available" || raw.inStock !== false
        ? 25
        : 0,
    url: images[0],
    detailUrl: images[0],
    images,
    price: {
      mrp,
      cost,
      discount: discountPct ? `${discountPct}%` : "0%",
    },
    discountPercentage: discountPct,
    discount: discountPct >= 15 ? "Sale" : "",
    tagline: brand,
    qty: 25,
    materialLabel:
      raw.fits?.[0] ||
      raw.mainCategory?.name ||
      article?.productTypeName ||
      "H&M",
    tags: tags.slice(0, 2),
    colorSwatches: extractColorSwatches(raw),
    offerMessage:
      discountPct >= 10 ? `Extra ${Math.min(20, discountPct)}% Off` : "",
    onSale: discountPct > 0,
  };
};

const extractProductList = (payload) => {
  if (!payload) return [];

  if (Array.isArray(payload.searchHits?.productList)) {
    return payload.searchHits.productList;
  }

  if (payload.product) return [payload.product];

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.products)) return payload.products;

  if (payload.code || payload.id || payload.productName || payload.name) {
    return [payload];
  }

  return [];
};

const fetchHmList = async (category = "all") => {
  const data = await listProducts(category);
  const seenImages = new Set();

  return extractProductList(data)
    .map((item) => normalizeHmProduct(item, category))
    .filter((p) => {
      if (!p.url || !p.url.startsWith("http")) return false;
      if (seenImages.has(p.url)) return false;
      seenImages.add(p.url);
      return true;
    });
};

export const fetchAllProducts = () => fetchHmList("all");

export const fetchByCategory = (category) => fetchHmList(category);

export const fetchSaleProducts = async () => {
  const products = await fetchHmList("sale");
  return products
    .filter((p) => p.discountPercentage >= 10)
    .sort((a, b) => b.discountPercentage - a.discountPercentage);
};

export const fetchProductById = async (id) => {
  const rawId = String(id).replace(/^hm-/, "");

  try {
    const data = await getProductDetail(rawId);
    if (data?.product) return normalizeHmProduct(data.product);
    const list = extractProductList(data);
    if (list.length) return normalizeHmProduct(list[0]);
  } catch (detailError) {
    try {
      const data = await searchByBarcode(rawId);
      if (data?.product) return normalizeHmProduct(data.product);
      const list = extractProductList(data);
      if (list.length) return normalizeHmProduct(list[0]);
    } catch (barcodeError) {
      console.error("H&M product fetch failed:", detailError, barcodeError);
    }
  }

  return null;
};

export const fetchSimilarProducts = async (category, excludeId, limit = 8) => {
  const products = await fetchHmList(category || "all");
  return products
    .filter((p) => String(p._id) !== String(excludeId))
    .slice(0, limit);
};

export const searchProducts = async (query) => {
  const data = await hmSearch(query);
  return extractProductList(data).map((item) => normalizeHmProduct(item));
};

export { PLACEHOLDER_IMAGE };
