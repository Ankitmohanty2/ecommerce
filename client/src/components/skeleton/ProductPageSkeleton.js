import React from "react";
import Skeleton from "./Skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";

import "../../styles/ProductPage.css";

function ProductPageSkeleton() {
  return (
    <div className="product-page" aria-busy="true" aria-label="Loading product">
      <div className="product-page__wrapper">
        <div className="product-page__breadcrumb">
          <Skeleton className="skeleton--line skeleton--line-xs" style={{ marginBottom: 0 }} />
        </div>

        <div className="product-page__container">
          <div className="product-page__gallery">
            <Skeleton className="skeleton--image product-page__image-wrap" />
            <div className="product-page__thumbs">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="skeleton--image product-page-skeleton__thumb" />
              ))}
            </div>
          </div>

          <div className="product-page__info">
            <Skeleton className="skeleton--line skeleton--line-xs" />
            <Skeleton className="skeleton--line skeleton--line-lg" />
            <Skeleton className="skeleton--line skeleton--line-lg" style={{ width: "70%" }} />
            <Skeleton className="skeleton--line skeleton--line-sm" style={{ marginBottom: 20 }} />

            <div className="product-page__price-row">
              <Skeleton className="skeleton--line" style={{ width: 100, height: 22, marginBottom: 0 }} />
              <Skeleton className="skeleton--line" style={{ width: 72, height: 16, marginBottom: 0 }} />
            </div>

            <div className="product-page-skeleton__swatches">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="skeleton--circle" />
              ))}
            </div>

            <Skeleton className="skeleton--line skeleton--line-lg" />
            <Skeleton className="skeleton--line skeleton--line-md" />
            <Skeleton className="skeleton--line skeleton--line-md" style={{ marginBottom: 28 }} />

            <Skeleton className="skeleton--btn" />
            <Skeleton className="skeleton--line skeleton--line-md" style={{ marginTop: 24 }} />
          </div>
        </div>

        <section className="product-page__similar">
          <Skeleton
            className="skeleton--line"
            style={{ width: 180, height: 18, marginBottom: 24 }}
          />
          <div className="product-page__similar-grid">
            {Array.from({ length: 4 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductPageSkeleton;
