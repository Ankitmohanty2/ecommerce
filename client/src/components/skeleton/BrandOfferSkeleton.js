import React from "react";
import Skeleton from "./Skeleton";

function BrandOfferSkeleton() {
  return (
    <div className="brand-offer-card brand-offer-card--skeleton">
      <Skeleton className="skeleton--image brand-offer-card__image-wrap" />
      <Skeleton className="skeleton--line skeleton--line-sm" />
      <Skeleton className="skeleton--line skeleton--line-md" />
    </div>
  );
}

export default BrandOfferSkeleton;
