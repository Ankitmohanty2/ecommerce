import React from "react";
import Skeleton from "./Skeleton";

function ProductCardSkeleton() {
  return (
    <article className="product-card product-card--skeleton">
      <Skeleton className="skeleton--image product-card__image-wrap" />
      <div className="product-card__body-skeleton">
        <Skeleton className="skeleton--line skeleton--line-xs" />
        <Skeleton className="skeleton--line skeleton--line-md" />
        <Skeleton className="skeleton--line skeleton--line-sm" />
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Skeleton className="skeleton--circle" />
          <Skeleton className="skeleton--circle" />
          <Skeleton className="skeleton--circle" />
        </div>
        <Skeleton className="skeleton--line skeleton--line-sm" />
      </div>
    </article>
  );
}

export default ProductCardSkeleton;
