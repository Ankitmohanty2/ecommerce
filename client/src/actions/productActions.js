import * as actionType from "../action-type/productActionType";
import {
  fetchAllProducts,
  fetchProductById,
  fetchByCategory,
  fetchSaleProducts,
} from "../adapters/catalog";

export const getProducts = () => async (dispatch) => {
  try {
    const products = await fetchAllProducts();
    dispatch({
      type: actionType.GET_PRODUCTS,
      payload: { products },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = (id) => async (dispatch) => {
  try {
    const product = await fetchProductById(id);
    dispatch({
      type: actionType.GET_PRODUCT_BY_ID,
      payload: { product: product || {} },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProductsByCategory = async (name) => {
  if (name === "sale") return fetchSaleProducts();
  if (name === "all") return fetchAllProducts();
  return fetchByCategory(name);
};
