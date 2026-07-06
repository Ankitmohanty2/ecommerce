const https = require("https");

const HM_HOST = "apidojo-hm-hennes-mauritz-v1.p.rapidapi.com";

const hmRequest = (path, params = {}) =>
  new Promise((resolve, reject) => {
    const key = process.env.RAPIDAPI_KEY;
    if (!key) {
      reject(new Error("RAPIDAPI_KEY is not configured in .env"));
      return;
    }

    const url = new URL(`https://${HM_HOST}${path}`);
    Object.entries(params).forEach(([name, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(name, String(value));
      }
    });

    const req = https.get(
      url,
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": HM_HOST,
          "x-rapidapi-key": key,
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          if (res.statusCode === 204) {
            resolve({});
            return;
          }
          if (res.statusCode >= 400) {
            reject(
              new Error(`H&M API ${res.statusCode}: ${body.slice(0, 300)}`)
            );
            return;
          }
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", reject);
    req.setTimeout(25000, () => {
      req.destroy(new Error("H&M API request timed out"));
    });
  });

const DEFAULT_COUNTRY = process.env.HM_COUNTRY || "in";
const DEFAULT_LANG = process.env.HM_LANG || "en";

const listProducts = ({
  currentpage = 0,
  pagesize = 36,
  country = DEFAULT_COUNTRY,
  lang = DEFAULT_LANG,
  query,
  categories,
  concepts,
  sortBy,
} = {}) =>
  hmRequest("/products/v2/list", {
    currentpage,
    pagesize,
    country,
    lang,
    query,
    categories,
    concepts,
    sortBy,
  });

const getProductDetail = (
  productcode,
  country = DEFAULT_COUNTRY,
  lang = DEFAULT_LANG
) => hmRequest("/products/detail", { productcode, country, lang });

const searchByBarcodeV2 = (code, country = DEFAULT_COUNTRY, lang = DEFAULT_LANG) =>
  hmRequest("/products/v2/search-by-barcode", { code, country, lang });

module.exports = {
  listProducts,
  getProductDetail,
  searchByBarcodeV2,
};
