const hashKey = (key) => {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
};

/** Fixed picsum IDs — each URL is unique and always loads */
const picsum = (id, w, h) => `https://picsum.photos/id/${id}/${w}/${h}`;

const BRAND_PICSUM_IDS = {
  "forever-new": 334,
  "twenty-dresses": 338,
  libas: 399,
  puma: 367,
  cider: 348,
  "vero-moda": 305,
  "calvin-klein": 377,
  gucci: 387,
  chanel: 292,
  "souled-store": 356,
};

export const getBrandOfferImage = (brandId) => {
  const id = BRAND_PICSUM_IDS[brandId] || 330;
  return picsum(id, 600, 800);
};

export const getPicsumImage = (productId, category, variantIndex = 0) =>
  getFashionImage(productId, category, variantIndex);

export const getFashionImage = (productId, category, variantIndex = 0) => {
  const key = `${category}:${productId}:v${variantIndex}`;
  const id = 101 + (hashKey(key) % 899);
  return picsum(id, 800, 1067);
};

export const getFashionImageSet = (productId, category, count = 4) => {
  const images = [];
  const seen = new Set();

  for (let i = 0; i < count; i += 1) {
    let attempt = 0;
    let url = getFashionImage(productId, category, i + attempt);

    while (seen.has(url) && attempt < 30) {
      attempt += 1;
      url = getFashionImage(productId, category, i + attempt * 7);
    }

    seen.add(url);
    images.push(url);
  }

  return images;
};

export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1067' viewBox='0 0 800 1067'%3E%3Crect fill='%23ececec' width='800' height='1067'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='24'%3EVixen%3C/text%3E%3C/svg%3E";
