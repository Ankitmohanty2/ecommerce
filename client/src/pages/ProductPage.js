import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";

import { getProductById } from "../actions/productActions";
import { addToCart } from "../actions/cartActions";
import { fetchSimilarProducts } from "../adapters/catalog";
import ProductCard from "../components/home/ProductCard";
import ProductPageSkeleton from "../components/skeleton/ProductPageSkeleton";
import ProductCardSkeleton from "../components/skeleton/ProductCardSkeleton";
import ToastMessageContainer from "../components/ToastMessageContainer";

import "../styles/ProductPage.css";

function ProductPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { product } = useSelector((state) => state.productReducer);
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const onSale = product?.discountPercentage >= 15;
  const gallery = (
    product?.images?.length
      ? product.images
      : [product?.detailUrl || product?.url].filter(Boolean)
  ).slice(0, 8);
  const hasMultipleViews = gallery.length > 1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    setActiveImage(0);
    setSimilarProducts([]);
    setSimilarLoading(false);
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (String(product?._id) === String(id)) {
      setIsLoading(false);
      return;
    }
    if (product && Object.keys(product).length === 0) {
      setIsLoading(false);
    }
  }, [product, id]);

  useEffect(() => {
    if (!product?.category || String(product?._id) !== String(id)) {
      setSimilarProducts([]);
      setSimilarLoading(false);
      return;
    }

    setSimilarLoading(true);
    fetchSimilarProducts(product.category, product._id, 4)
      .then(setSimilarProducts)
      .finally(() => setSimilarLoading(false));
  }, [product, id]);

  const addItemToCart = () => {
    dispatch(addToCart(product));
    history.push("/cart");
  };

  const mainImage = gallery[activeImage] || product?.detailUrl || product?.url;

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="product-page">
        <p className="product-page__empty">Product not found.</p>
        <ToastMessageContainer />
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-page__wrapper">
        <nav className="product-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link to={`/?cat=${product.category || "all"}`}>{product.brand}</Link>
          <span aria-hidden="true">›</span>
          <span>{product.title.shortTitle}</span>
        </nav>

        <div className="product-page__container">
          <div className="product-page__gallery">
            <div className="product-page__image-wrap">
              <img
                className="product-page__main-image"
                src={mainImage}
                alt={product.title.longTitle}
                loading="eager"
                decoding="async"
              />
            </div>

            {hasMultipleViews && (
              <div className="product-page__thumbs">
                {gallery.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    className={`product-page__thumb ${activeImage === i ? "product-page__thumb--active" : ""}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-page__info">
            {product.brand && (
              <p className="product-page__brand">{product.brand}</p>
            )}
            <h1 className="product-page__title">{product.title.longTitle}</h1>

            {product.rating && (
              <p className="product-page__rating">
                ★ {product.rating.toFixed(1)} · {product.stock} in stock
              </p>
            )}

            <div className="product-page__price-row">
              <span
                className={`product-page__price ${onSale ? "product-page__price--sale" : ""}`}
              >
                ₹ {product.price.cost.toLocaleString("en-IN")}
              </span>
              {onSale && (
                <>
                  <span className="product-page__mrp">
                    ₹ {product.price.mrp.toLocaleString("en-IN")}
                  </span>
                  <span className="product-page__discount">
                    {Math.round(product.discountPercentage)}% OFF
                  </span>
                </>
              )}
            </div>

            {product.colorSwatches?.length > 0 && (
              <div className="product-page__swatches">
                <span className="product-page__swatches-label">Colours</span>
                <div className="product-page__swatches-row">
                  {product.colorSwatches.map((color) => (
                    <span
                      key={color}
                      className="product-page__swatch"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.description && (
              <p className="product-page__description">{product.description}</p>
            )}

            <div className="product-page__actions">
              <button
                type="button"
                className="product-page__btn product-page__btn--primary"
                onClick={addItemToCart}
              >
                Add to Bag
              </button>
            </div>

            <div className="product-page__meta">
              <p>Free delivery on orders over ₹999</p>
              <p>Free returns within 30 days</p>
            </div>
          </div>
        </div>

        {(similarLoading || similarProducts.length > 0) && (
          <section className="product-page__similar" aria-busy={similarLoading}>
            <h2 className="product-page__similar-title">You may also like</h2>
            <div className="product-page__similar-grid">
              {similarLoading
                ? Array.from({ length: 4 }, (_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : similarProducts.map((item) => (
                    <ProductCard key={item._id} product={item} />
                  ))}
            </div>
          </section>
        )}
      </div>

      <ToastMessageContainer />
    </div>
  );
}

export default ProductPage;
