const HM_HOST = "apidojo-hm-hennes-mauritz-v1.p.rapidapi.com";
const HM_COUNTRY = process.env.REACT_APP_HM_COUNTRY || "in";
const HM_LANG = process.env.REACT_APP_HM_LANG || "en";
const TIMEOUT_MS = 25000;

export const CATEGORY_PARAMS = {
  all: { query: "fashion", pagesize: 48 },
  ladies: { query: "women", pagesize: 36 },
  men: { query: "men", pagesize: 36 },
  kids: { query: "kids", pagesize: 36 },
  home: { query: "home decor", pagesize: 36 },
  dresses: { query: "dress", pagesize: 36 },
  tops: { query: "top", pagesize: 36 },
  shirts: { query: "shirt", pagesize: 36 },
  shoes: { query: "shoes", pagesize: 36 },
  bags: { query: "bag", pagesize: 36 },
  jewellery: { query: "jewellery", pagesize: 36 },
  watches: { query: "accessories", pagesize: 36 },
  beauty: { query: "beauty", pagesize: 36 },
  fragrances: { query: "fragrance", pagesize: 36 },
  skincare: { query: "skincare", pagesize: 36 },
  accessories: { query: "accessories", pagesize: 36 },
  furniture: { query: "furniture", pagesize: 36 },
  decor: { query: "decor", pagesize: 36 },
  sale: { query: "sale", pagesize: 48 },
};

const getCategoryParams = (category = "all") =>
  CATEGORY_PARAMS[category] || {
    query: category.replace(/-/g, " "),
    pagesize: 36,
  };

const getApiKey = () => process.env.REACT_APP_RAPIDAPI_KEY;

const withTimeout = (ms) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { controller, timer };
};

const proxyFetch = async (path, query = {}) => {
  const url = new URL(path, window.location.origin);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const { controller, timer } = withTimeout(TIMEOUT_MS);
  try {
    const response = await fetch(url.toString(), { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Backend proxy error ${response.status}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } finally {
    clearTimeout(timer);
  }
};

const directHmFetch = async (path, params = {}) => {
  const key = getApiKey();
  if (!key) {
    throw new Error(
      "Start the backend with npm run dev (uses RAPIDAPI_KEY from .env), or add REACT_APP_RAPIDAPI_KEY to client/.env and restart npm start."
    );
  }

  const url = new URL(`https://${HM_HOST}${path}`);
  url.searchParams.set("country", HM_COUNTRY);
  url.searchParams.set("lang", HM_LANG);

  Object.entries(params).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(name, String(value));
    }
  });

  const { controller, timer } = withTimeout(TIMEOUT_MS);
  try {
    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": HM_HOST,
        "x-rapidapi-key": key,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`H&M API returned ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("H&M request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

const hmFetch = async (path, params = {}, proxyPath, proxyQuery = {}) => {
  try {
    return await proxyFetch(proxyPath, proxyQuery);
  } catch (proxyError) {
    return directHmFetch(path, params);
  }
};

export const listProducts = (category = "all", currentpage = 0) => {
  const params = getCategoryParams(category);
  return hmFetch(
    "/products/v2/list",
    { ...params, currentpage },
    "/api/hm/products",
    { category, page: currentpage }
  );
};

export const getProductDetail = (productcode) =>
  hmFetch(
    "/products/detail",
    { productcode },
    `/api/hm/products/${productcode}`
  );

export const searchByBarcode = (code) =>
  hmFetch(
    "/products/v2/search-by-barcode",
    { code },
    `/api/hm/barcode/${code}`
  );

export const searchProducts = (query) =>
  hmFetch(
    "/products/v2/list",
    { query, pagesize: 36, currentpage: 0 },
    "/api/hm/search",
    { q: query }
  );
