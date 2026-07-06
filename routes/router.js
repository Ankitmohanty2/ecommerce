const express = require("express");
const {
  getProducts,
  getProductById,
  addProduct,
  getProductsByCategory,
} = require("../controllers/product-controller");
const {
  addItem,
  removeItem,
  removeAllItem,
  getCartItems,
} = require("../controllers/cart-controller");

const {
  addItem: addItemWishlist,
  removeItem: removeItemWishlist,
  getWishlistItems,
} = require("../controllers/wishlist-controller");

const {
  signup,
  login,
  logout,
  loginWithEmail,
  loginWithMobileNumber,
  isExistEmail,
  isExistPhone,
  authentication,
  updateUserInfo,
  updateEmail,
  // sendOtpToEmail,
  // verifyOtpForEmail,
} = require("../controllers/user-controller");

const {
  addNewAddress,
  getAddress,
  deleteAddress,
} = require("../controllers/address-controller");

const {
  completeOrder,
  getOrderDetails,
} = require("../controllers/order-controller");

const {
  paytmGatway,
  paytmDataResponse,
} = require("../controllers/payment-controller");

const {
  listByCategory,
  searchProducts,
  getProduct,
  getByBarcode,
} = require("../controllers/hm-controller");

const router = express.Router();

//User Account related routes

router.post("/accounts/signup", signup);
router.post("/accounts/login", login);
router.post("/accounts/login-with-email", loginWithEmail);
router.post("/accounts/login-with-phone", loginWithMobileNumber);
router.post("/accounts/check-email", isExistEmail);
router.post("/accounts/check-phone", isExistPhone);
// Email OTP routes disabled — uncomment when re-enabling verification
// router.post("/accounts/send-email-otp", sendOtpToEmail);
// router.post("/accounts/verify-email-otp", verifyOtpForEmail);
router.get("/accounts/authentication", authentication);
router.get("/accounts/logout", logout);
router.patch("/accounts/update-user-info", updateUserInfo);
router.patch("/accounts/update-email", updateEmail);

//Product related routes

router.get("/products/get-products", getProducts);
router.get("/products/get-products/:categoryName", getProductsByCategory);
router.get("/products/get-product/:id", getProductById);
router.get("/products/add-product", addProduct);

// H&M product proxy (RapidAPI)
router.get("/hm/products", listByCategory);
router.get("/hm/search", searchProducts);
router.get("/hm/barcode/:code", getByBarcode);
router.get("/hm/products/:code", getProduct);

//Cart related routes
router.post("/cart/add-item", addItem);
router.delete("/cart/remove-item", removeItem);
router.delete("/cart/clear-cart", removeAllItem);
router.get("/cart/get-items/:id", getCartItems);

//Wishlist related routes
router.post("/wishlist/add-item", addItemWishlist);
router.delete("/wishlist/remove-item", removeItemWishlist);
router.get("/wishlist/get-items/:id", getWishlistItems);

//Address related routes
router.post("/address/add-address", addNewAddress);
router.get("/address/get-addresses/:id", getAddress);
router.delete("/address/delete-address", deleteAddress);

//orders related routes

router.post("/orders/complete-order", completeOrder);
router.post("/orders/get-order-details", getOrderDetails);

//Payment related routes
router.post("/payment/paytm", paytmGatway);
router.post("/payment/paytmresponse", paytmDataResponse);

module.exports = router;
