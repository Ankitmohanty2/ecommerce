import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProducts } from "../../adapters/hmClient";
import { PLACEHOLDER_IMAGE } from "../../adapters/fashionImages";
import { BRAND_OFFERS } from "../../data/brandOffers";
import BrandOfferSkeleton from "../skeleton/BrandOfferSkeleton";

const pickProductImage = (product) => {
  if (!product) return null;
  return (
    product.productImage ||
    product.modelImage ||
    product.images?.[0]?.url ||
    product.swatches?.[0]?.productImage ||
    null
  );
};

function BrandOfferCard({ brand, imageSrc, loading }) {
  const [src, setSrc] = useState(imageSrc || PLACEHOLDER_IMAGE);

  useEffect(() => {
    setSrc(imageSrc || PLACEHOLDER_IMAGE);
  }, [imageSrc]);

  if (loading || !imageSrc) {
    return <BrandOfferSkeleton />;
  }

  return (
    <Link to={`/?cat=${brand.cat}`} className="brand-offer-card">
      <div className="brand-offer-card__image-wrap">
        <img
          src={src}
          alt={brand.name}
          className="brand-offer-card__image"
          loading="lazy"
          onError={() => setSrc(PLACEHOLDER_IMAGE)}
        />
        <div className="brand-offer-card__overlay" />
        <span className="brand-offer-card__name">{brand.name}</span>
      </div>
      <p className="brand-offer-card__offer">{brand.offer}</p>
      <p className="brand-offer-card__desc">{brand.description}</p>
    </Link>
  );
}

function BrandOffersRow() {
  const [imagesByBrand, setImagesByBrand] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const categories = [...new Set(BRAND_OFFERS.map((b) => b.cat))];

    Promise.all(
      categories.map((cat) =>
        listProducts(cat).then((data) => ({
          cat,
          products: data?.searchHits?.productList || [],
        }))
      )
    )
      .then((results) => {
        if (cancelled) return;

        const productsByCat = Object.fromEntries(
          results.map(({ cat, products }) => [cat, products])
        );

        const usedImages = new Set();
        const nextImages = {};

        BRAND_OFFERS.forEach((brand) => {
          const products = productsByCat[brand.cat] || [];
          let image = null;

          for (let offset = 0; offset < products.length; offset += 1) {
            const index = (brand.imageIndex + offset) % products.length;
            const candidate = pickProductImage(products[index]);
            if (candidate && !usedImages.has(candidate)) {
              image = candidate;
              usedImages.add(candidate);
              break;
            }
          }

          nextImages[brand.id] = image;
        });

        setImagesByBrand(nextImages);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="brand-offers">
      <h2 className="brand-offers__title">Hottest brands on offer</h2>
      <div className="brand-offers__grid" aria-busy={loading}>
        {BRAND_OFFERS.map((brand) => (
          <BrandOfferCard
            key={brand.id}
            brand={brand}
            imageSrc={imagesByBrand[brand.id]}
            loading={loading}
          />
        ))}
      </div>
    </section>
  );
}

export default BrandOffersRow;
