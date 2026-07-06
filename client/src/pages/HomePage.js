import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { getProductsByCategory } from "../actions/productActions";
import { CATEGORY_DISPLAY, HERO_IMAGE } from "../adapters/catalog";
import ProductCard from "../components/home/ProductCard";
import ProductCardSkeleton from "../components/skeleton/ProductCardSkeleton";
import HeroBanner from "../components/home/HeroBanner";
import BrandOffersRow from "../components/home/BrandOffersRow";
import FilterSidebar from "../components/home/FilterSidebar";
import Footer from "../components/footer/Footer";

import "../styles/HomePage.css";
import "react-toastify/dist/ReactToastify.min.css";

const SORT_OPTIONS = [
  { value: "featured", label: "Popularity" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
];

function HomePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("cat") || "all";
  const isCategoryPage = category !== "all";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(50000);
  const [minDiscount, setMinDiscount] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    if (!isCategoryPage) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");
    getProductsByCategory(category)
      .then((data) => {
        setProducts(data || []);
      })
      .catch((error) => {
        setProducts([]);
        setLoadError(
          error?.message ||
            "Could not load H&M products. Check your RapidAPI key in client/.env and restart npm start."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, isCategoryPage]);

  useEffect(() => {
    setSelectedBrands([]);
    setMinDiscount(0);
  }, [category]);

  const maxPrice = useMemo(() => {
    if (!products.length) return 50000;
    return Math.max(...products.map((p) => p.price.cost), 50000);
  }, [products]);

  useEffect(() => {
    setPriceRange(maxPrice);
  }, [maxPrice]);

  const availableBrands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return [...set].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.price.cost > priceRange) return false;
      if (minDiscount > 0 && (p.discountPercentage || 0) < minDiscount) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      return true;
    });
  }, [products, priceRange, minDiscount, selectedBrands]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case "price-low":
        return list.sort((a, b) => a.price.cost - b.price.cost);
      case "price-high":
        return list.sort((a, b) => b.price.cost - a.price.cost);
      case "rating":
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "discount":
        return list.sort(
          (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)
        );
      default:
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }, [filteredProducts, sortBy]);

  const categoryMeta = CATEGORY_DISPLAY[category] || CATEGORY_DISPLAY.all;

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setPriceRange(maxPrice);
    setMinDiscount(0);
    setSelectedBrands([]);
  };

  return (
    <main className="home">
      {!isCategoryPage && (
        <>
          <HeroBanner
            image={HERO_IMAGE}
            title="New Season"
            subtitle="Spring / Summer 2026"
          />
          <BrandOffersRow />
        </>
      )}

      {isCategoryPage && (
        <div className="home__content">
          <div className="home__category-header">
            <nav className="home__breadcrumb" aria-label="Breadcrumb">
              <span>Home</span>
              <span aria-hidden="true">›</span>
              <span>{categoryMeta.label}</span>
            </nav>
            <div className="home__category-row">
              <h1 className="home__category-title">{categoryMeta.title}</h1>
              <button
                type="button"
                className="home__reset-btn"
                onClick={handleResetFilters}
              >
                Reset All
              </button>
            </div>
            <p className="home__category-count">
              {loading ? (
                <span className="home__count-skeleton skeleton skeleton--line skeleton--line-xs" aria-hidden="true" />
              ) : (
                `${sortedProducts.length.toLocaleString("en-IN")} products`
              )}
            </p>
          </div>

          <div className="home__layout">
            <FilterSidebar
              maxPrice={maxPrice}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              minDiscount={minDiscount}
              onDiscountChange={setMinDiscount}
              brands={availableBrands}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              onReset={handleResetFilters}
            />

            <div className="home__main">
              <div className="home__toolbar">
                <span className="home__toolbar-count" />
                <label className="home__sort-label">
                  Sort by
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="home__sort-select"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="home__grid" aria-busy={loading}>
                {loading ? (
                  Array.from({ length: 8 }, (_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                ) : loadError ? (
                  <p className="home__empty">{loadError}</p>
                ) : sortedProducts.length === 0 ? (
                  <p className="home__empty">No products found in this category.</p>
                ) : (
                  sortedProducts.map((product, index) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      priority={index < 8}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

export default HomePage;
