import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FlipToFrontIcon from "@material-ui/icons/FlipToFront";
import { PLACEHOLDER_IMAGE } from "../../adapters/fashionImages";

function ProductCard({ product, priority = false }) {
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.url || PLACEHOLDER_IMAGE);
  const [imageAttempt, setImageAttempt] = useState(0);
  const onSale = product.onSale || product.discountPercentage > 0;
  const tags = product.tags || [];
  const swatches = product.colorSwatches || [];
  const imageOptions = product.images?.length
    ? product.images
    : [product.url].filter(Boolean);

  useEffect(() => {
    setLoaded(false);
    setImageAttempt(0);
    setImageSrc(product.url || PLACEHOLDER_IMAGE);
  }, [product.url, product._id]);

  const handleImageError = () => {
    const nextAttempt = imageAttempt + 1;
    if (nextAttempt < imageOptions.length) {
      setImageAttempt(nextAttempt);
      setImageSrc(imageOptions[nextAttempt]);
      return;
    }
    setImageSrc(PLACEHOLDER_IMAGE);
    setLoaded(true);
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-card__link">
        <div className="product-card__image-wrap">
          {!loaded && <div className="product-card__skeleton skeleton skeleton--image" aria-hidden="true" />}

          <img
            className={`product-card__image ${loaded ? "product-card__image--visible" : ""}`}
            src={imageSrc}
            alt={product.subTitle || product.title.shortTitle}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={priority ? "high" : "auto"}
            onLoad={() => setLoaded(true)}
            onError={handleImageError}
          />

          {product.materialLabel && (
            <span className="product-card__material">{product.materialLabel}</span>
          )}

          <div className="product-card__actions">
            <button
              type="button"
              className="product-card__action-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-label="Add to favourites"
            >
              <FavoriteBorderIcon style={{ fontSize: 15 }} />
            </button>
            <button
              type="button"
              className="product-card__action-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-label="View similar"
            >
              <FlipToFrontIcon style={{ fontSize: 15 }} />
            </button>
          </div>
        </div>

        <div className="product-card__body">
          {tags.length > 0 && (
            <div className="product-card__tags">
              {tags.map((tag) => (
                <span key={tag.title} className="product-card__tag">
                  {tag.title}
                </span>
              ))}
            </div>
          )}

          <p className="product-card__brand">{product.brand}</p>
          <h3 className="product-card__subtitle">
            {product.subTitle || product.title.shortTitle}
          </h3>

          {swatches.length > 0 && (
            <div className="product-card__swatches" aria-label="Available colours">
              {swatches.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="product-card__swatch"
                  style={{ backgroundColor: color }}
                />
              ))}
              {swatches.length > 4 && (
                <span className="product-card__swatch-more">
                  +{swatches.length - 4} more
                </span>
              )}
            </div>
          )}

          <div className="product-card__prices">
            <span className="product-card__price">
              ₹ {product.price.cost.toLocaleString("en-IN")}
            </span>
            {onSale && product.price.mrp > product.price.cost && (
              <>
                <span className="product-card__price--old">
                  ₹ {product.price.mrp.toLocaleString("en-IN")}
                </span>
                <span className="product-card__discount">
                  {Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          {product.offerMessage && (
            <p className="product-card__offer">{product.offerMessage}</p>
          )}
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
