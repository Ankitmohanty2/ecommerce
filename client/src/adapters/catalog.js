import * as hmApi from "./hmApi";

export {
  FASHION_CATEGORIES,
  NAV_CATEGORY_MAP,
  CATEGORY_DISPLAY,
  HERO_IMAGE,
  PLACEHOLDER_IMAGE,
} from "./dummyJson";

export const fetchAllProducts = () => hmApi.fetchAllProducts();

export const fetchByCategory = (category) => hmApi.fetchByCategory(category);

export const fetchSaleProducts = () => hmApi.fetchSaleProducts();

export const fetchProductById = (id) => hmApi.fetchProductById(id);

export const fetchSimilarProducts = (category, excludeId, limit) =>
  hmApi.fetchSimilarProducts(category, excludeId, limit);

export const searchProducts = (query) => hmApi.searchProducts(query);

export const fetchCategories = async () => [];
