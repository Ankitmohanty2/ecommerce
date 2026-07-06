const {
  listProducts,
  getProductDetail,
  searchByBarcodeV2,
} = require("../services/hmService");

const CATEGORY_PARAMS = {
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
  CATEGORY_PARAMS[category] || { query: category.replace(/-/g, " "), pagesize: 36 };

const listByCategory = async (req, res) => {
  try {
    const category = req.query.category || "all";
    const page = Number(req.query.page || 0);
    const params = getCategoryParams(category);
    const data = await listProducts({ ...params, currentpage: page });
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const query = req.query.q || "";
    if (!query.trim()) {
      res.json({ searchHits: { productList: [] } });
      return;
    }
    const data = await listProducts({ query, currentpage: 0, pagesize: 36 });
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { code } = req.params;
    const data = await getProductDetail(code);
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
};

const getByBarcode = async (req, res) => {
  try {
    const { code } = req.params;
    const data = await searchByBarcodeV2(code);
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
};

module.exports = {
  listByCategory,
  searchProducts,
  getProduct,
  getByBarcode,
};
