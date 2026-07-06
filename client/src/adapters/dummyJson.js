import {
  getFashionImage,
  getFashionImageSet,
  getPicsumImage,
  PLACEHOLDER_IMAGE,
} from "./fashionImages";

export { PLACEHOLDER_IMAGE, getPicsumImage };

const BASE_URL = "https://dummyjson.com";
const INR_RATE = 84;

/* Only show fashion / lifestyle items — exclude groceries, kitchen, electronics, etc. */
export const FASHION_CATEGORIES = new Set([
  "womens-dresses",
  "womens-bags",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "tops",
  "sunglasses",
  "beauty",
  "fragrances",
  "skin-care",
  "home-decoration",
  "furniture",
]);

export const NAV_CATEGORY_MAP = {
  ladies: [
    "womens-dresses",
    "womens-bags",
    "womens-jewellery",
    "womens-shoes",
    "womens-watches",
    "tops",
    "sunglasses",
  ],
  men: ["mens-shirts", "mens-shoes", "mens-watches", "sunglasses"],
  kids: ["tops", "womens-dresses"],
  home: ["home-decoration", "furniture"],
  beauty: ["beauty", "fragrances", "skin-care"],
  dresses: ["womens-dresses"],
  tops: ["tops"],
  shoes: ["womens-shoes", "mens-shoes"],
  bags: ["womens-bags"],
  jewellery: ["womens-jewellery"],
  watches: ["womens-watches", "mens-watches"],
  shirts: ["mens-shirts"],
  fragrances: ["fragrances"],
  skincare: ["skin-care"],
  accessories: ["sunglasses"],
  furniture: ["furniture"],
  decor: ["home-decoration"],
};

export const CATEGORY_DISPLAY = {
  all: { label: "Shop All", title: "Shop All Collection Online" },
  ladies: { label: "Women", title: "Buy Women's Collection Online" },
  men: { label: "Men", title: "Buy Men's Collection Online" },
  kids: { label: "Kids", title: "Buy Kids' Collection Online" },
  home: { label: "Home", title: "Buy Home Collection Online" },
  beauty: { label: "Beauty", title: "Buy Beauty Collection Online" },
  dresses: { label: "Dresses", title: "Buy Dresses Online" },
  tops: { label: "Tops", title: "Buy Tops & Tees Online" },
  shoes: { label: "Shoes", title: "Buy Shoes Online" },
  bags: { label: "Bags", title: "Buy Bags Online" },
  jewellery: { label: "Jewellery", title: "Buy Jewellery Online" },
  watches: { label: "Watches", title: "Buy Watches Online" },
  shirts: { label: "Shirts", title: "Buy Shirts Online" },
  fragrances: { label: "Fragrances", title: "Buy Fragrances Online" },
  skincare: { label: "Skincare", title: "Buy Skincare Online" },
  accessories: { label: "Accessories", title: "Buy Accessories Online" },
  furniture: { label: "Furniture", title: "Buy Furniture Online" },
  decor: { label: "Decor", title: "Buy Home Decor Online" },
  sale: { label: "Sale", title: "Sale — Best Deals Online" },
};

const isFashionCategory = (category) => FASHION_CATEGORIES.has(category);

const filterFashionProducts = (products) =>
  products.filter((p) => isFashionCategory(p.category));

const resolveNavCategories = (navKey) => NAV_CATEGORY_MAP[navKey] || null;

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=95&auto=format&fit=crop";

export const toINR = (usd) => Math.round(usd * INR_RATE);

const MATERIAL_LABELS = {
  "mens-shirts": "LINEN BLEND",
  "mens-shoes": "LEATHER",
  "mens-watches": "STAINLESS STEEL",
  tops: "COTTON",
  "womens-dresses": "PREMIUM FABRIC",
  "womens-shoes": "LEATHER",
  "womens-bags": "VEGAN LEATHER",
  "womens-jewellery": "925 SILVER",
  "womens-watches": "STAINLESS STEEL",
  sunglasses: "POLARIZED",
  beauty: "BEAUTY ESSENTIAL",
  fragrances: "LUXE SCENT",
  "skin-care": "SKIN CARE",
  furniture: "SOLID WOOD",
  "home-decoration": "HOME DECOR",
};

const COLOR_SWATCHES = [
  "#f991b0",
  "#4876FF",
  "#00CD66",
  "#f4ead0",
  "#000000",
  "#ffffff",
  "#808080",
  "#663300",
  "#800000",
  "#f2e7bf",
  "#008080",
  "#ff7b00",
];

const VARIANT_COLORS = [
  { name: "Pink", code: "#f991b0" },
  { name: "Blue", code: "#4876FF" },
  { name: "Green", code: "#00CD66" },
  { name: "Cream", code: "#f4ead0" },
  { name: "Black", code: "#000000" },
  { name: "White", code: "#ffffff" },
  { name: "Grey", code: "#808080" },
  { name: "Brown", code: "#663300" },
  { name: "Maroon", code: "#800000" },
  { name: "Beige", code: "#f2e7bf" },
  { name: "Olive", code: "#808000" },
  { name: "Yellow", code: "#ffff00" },
];

const CATALOG_VARIANTS_PER_PRODUCT = 5;

const getMaterialLabel = (category) =>
  MATERIAL_LABELS[category] || "PREMIUM QUALITY";

const getColorSwatches = (productId, count = 4) => {
  const start = productId % COLOR_SWATCHES.length;
  const swatches = [];
  for (let i = 0; i < count; i += 1) {
    swatches.push(COLOR_SWATCHES[(start + i) % COLOR_SWATCHES.length]);
  }
  return [...new Set(swatches)].slice(0, 5);
};

const numericId = (id) => {
  const parsed = parseInt(String(id).replace(/-v\d+$/, ""), 10);
  return Number.isFinite(parsed) ? parsed : hashKey(String(id));
};

const hashKey = (key) => {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
};

const getProductTags = (product, discountPct) => {
  const idNum = numericId(product.id);
  const tags = [];
  if (product.rating >= 4.5 || idNum % 5 === 0) {
    tags.push({ title: "BESTSELLER" });
  }
  if (idNum % 7 === 0) {
    tags.push({ title: "LATEST STYLE" });
  }
  if (discountPct >= 25 && idNum % 3 === 0) {
    tags.push({ title: "AD" });
  }
  return tags.slice(0, 2);
};

const getOfferMessage = (brand, discountPct) => {
  if (["H&M", "Chanel", "Calvin Klein", "Gucci"].includes(brand)) {
    return "Extra 10% Off";
  }
  if (discountPct >= 15) {
    return `Extra ${Math.min(20, Math.round(discountPct / 2))}% Off`;
  }
  return "";
};

const getProductImages = (product, variantIndex = 0) => {
  const primary = getFashionImage(product.id, product.category, variantIndex);
  const extras = getFashionImageSet(product.id, product.category, 4).filter(
    (img) => img !== primary
  );
  return [primary, ...extras];
};

export const normalizeProduct = (product) => {
  const mrp = toINR(product.price);
  const discountPct = product.discountPercentage || 0;
  const cost = toINR(product.price * (1 - discountPct / 100));
  const images = getProductImages(product, 0);
  const primaryImage = images[0] || PLACEHOLDER_IMAGE;
  const brand = product.brand || "Vixen";
  const onSale = discountPct > 0;

  return {
    _id: String(product.id),
    id: product.id,
    title: {
      shortTitle: product.title,
      longTitle: product.title,
    },
    subTitle: product.title,
    description: product.description,
    brand,
    category: product.category,
    rating: product.rating,
    stock: product.stock,
    url: primaryImage,
    detailUrl: primaryImage,
    images,
    price: {
      mrp,
      cost,
      discount: `${Math.round(discountPct)}%`,
    },
    discountPercentage: discountPct,
    discount: discountPct >= 15 ? "Sale" : "",
    tagline: brand,
    qty: product.stock,
    materialLabel: getMaterialLabel(product.category),
    tags: getProductTags(product, discountPct),
    colorSwatches: getColorSwatches(numericId(product.id)),
    offerMessage: getOfferMessage(brand, discountPct),
    onSale,
  };
};

const createProductVariant = (base, variantIndex) => {
  const color = VARIANT_COLORS[variantIndex % VARIANT_COLORS.length];
  const variantId = `${base.id}-v${variantIndex}`;
  const priceShift = ((variantIndex % 5) - 2) * 75;
  const discountShift = ((variantIndex % 4) - 1) * 4;
  const discountPct = Math.min(
    65,
    Math.max(0, Math.round(base.discountPercentage + discountShift))
  );
  const mrp = Math.max(499, base.price.mrp + priceShift);
  const cost = Math.round(mrp * (1 - discountPct / 100));
  const image = getFashionImage(base.id, base.category, variantIndex);
  const variantImages = getFashionImageSet(base.id, base.category, 4);
  const swatchStart = (base.id + variantIndex) % COLOR_SWATCHES.length;
  const colorSwatches = [];
  for (let i = 0; i < 5; i += 1) {
    colorSwatches.push(COLOR_SWATCHES[(swatchStart + i) % COLOR_SWATCHES.length]);
  }

  const variantTitle = `${base.title.shortTitle} — ${color.name}`;

  return {
    ...base,
    _id: variantId,
    id: variantId,
    baseProductId: String(base.id),
    title: {
      shortTitle: variantTitle,
      longTitle: variantTitle,
    },
    subTitle: variantTitle,
    url: image,
    detailUrl: image,
    images: [image, ...variantImages.filter((img) => img !== image)],
    price: {
      mrp,
      cost,
      discount: `${discountPct}%`,
    },
    discountPercentage: discountPct,
    discount: discountPct >= 15 ? "Sale" : "",
    onSale: discountPct > 0,
    colorSwatches: [...new Set([color.code, ...colorSwatches])].slice(0, 6),
    tags: getProductTags({ id: base.id + variantIndex, rating: base.rating }, discountPct),
    offerMessage: getOfferMessage(base.brand, discountPct),
  };
};

const expandCatalog = (products, variantsPerProduct = CATALOG_VARIANTS_PER_PRODUCT) => {
  const expanded = [];
  products.forEach((product) => {
    expanded.push(product);
    for (let i = 1; i <= variantsPerProduct; i += 1) {
      expanded.push(createProductVariant(product, i));
    }
  });
  return expanded;
};

const parseVariantId = (id) => {
  const match = String(id).match(/^(\d+)-v(\d+)$/);
  if (!match) return null;
  return { baseId: match[1], variantIndex: Number(match[2]) };
};

const fetchCategoriesMerged = async (categories) => {
  const results = await Promise.all(
    categories.map(async (slug) => {
      const res = await fetch(`${BASE_URL}/products/category/${slug}`);
      const data = await res.json();
      return data.products || [];
    })
  );
  const seen = new Set();
  return results.flat().filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
};

const fetchAllFashionRaw = async () => {
  const res = await fetch(`${BASE_URL}/products?limit=200`);
  const data = await res.json();
  const fromList = filterFashionProducts(data.products || []);

  const categoryProducts = await fetchCategoriesMerged([...FASHION_CATEGORIES]);
  const seen = new Set();
  const merged = [];

  [...fromList, ...categoryProducts].forEach((product) => {
    if (seen.has(product.id)) return;
    seen.add(product.id);
    merged.push(product);
  });

  return merged;
};

export const fetchAllProducts = async () => {
  const raw = await fetchAllFashionRaw();
  return expandCatalog(raw.map(normalizeProduct));
};

export const fetchProductById = async (id) => {
  const variant = parseVariantId(id);
  if (variant) {
    const res = await fetch(`${BASE_URL}/products/${variant.baseId}`);
    const product = await res.json();
    if (product.message || !isFashionCategory(product.category)) return null;
    return createProductVariant(normalizeProduct(product), variant.variantIndex);
  }

  const res = await fetch(`${BASE_URL}/products/${id}`);
  const product = await res.json();
  if (product.message) return null;
  if (!isFashionCategory(product.category)) return null;
  return normalizeProduct(product);
};

export const fetchByCategory = async (category) => {
  const navCategories = resolveNavCategories(category);
  const raw = navCategories
    ? await fetchCategoriesMerged(navCategories)
    : (await fetch(`${BASE_URL}/products/category/${category}`)).json().then(
        (data) => data.products || []
      );

  return expandCatalog(
    filterFashionProducts(raw.map(normalizeProduct))
  );
};

export const fetchSimilarProducts = async (category, excludeId, limit = 8) => {
  const baseExcludeId = parseVariantId(excludeId)?.baseId || excludeId;
  const res = await fetch(`${BASE_URL}/products/category/${category}`);
  const data = await res.json();
  const similar = expandCatalog(
    filterFashionProducts(
      (data.products || [])
        .filter((p) => String(p.id) !== String(baseExcludeId))
        .map(normalizeProduct)
    )
  );
  return similar
    .filter((p) => String(p._id) !== String(excludeId))
    .slice(0, limit);
};

export const searchProducts = async (query) => {
  const res = await fetch(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return expandCatalog(
    filterFashionProducts((data.products || []).map(normalizeProduct))
  );
};

export const fetchSaleProducts = async () => {
  const products = await fetchAllProducts();
  return products
    .filter((p) => p.discountPercentage >= 10)
    .sort((a, b) => b.discountPercentage - a.discountPercentage);
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/products/categories`);
  return res.json();
};
