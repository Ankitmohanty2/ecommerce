import React, { useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const FILTER_SECTIONS = [
  {
    id: "gender",
    label: "Gender",
    options: ["Women", "Men", "Kids", "Unisex"],
  },
  {
    id: "brand",
    label: "Brand",
    type: "brand",
  },
  {
    id: "category",
    label: "Category",
    options: [
      "Dresses",
      "Tops & Tees",
      "Shirts",
      "Shoes",
      "Bags",
      "Jewellery",
      "Watches",
      "Beauty",
      "Fragrances",
      "Accessories",
    ],
  },
  {
    id: "size",
    label: "Size",
    options: ["XS", "S", "M", "L", "XL", "XXL", "Free Size"],
  },
  {
    id: "price",
    label: "Price",
    type: "price",
  },
  {
    id: "discount",
    label: "Discount",
    options: ["10% and above", "20% and above", "30% and above", "40% and above"],
  },
  {
    id: "color",
    label: "Color",
    options: ["Black", "White", "Blue", "Pink", "Red", "Green", "Beige", "Grey"],
  },
  {
    id: "material",
    label: "Material",
    options: ["Cotton", "Linen", "Silk", "Leather", "Denim", "Polyester"],
  },
  {
    id: "fit",
    label: "Fit",
    options: ["Regular", "Slim", "Oversized", "Relaxed"],
  },
];

function FilterSection({
  section,
  expanded,
  onToggle,
  maxPrice,
  priceRange,
  onPriceChange,
  minDiscount,
  onDiscountChange,
  brands,
  selectedBrands,
  onBrandToggle,
}) {
  return (
    <div className="filter-section">
      <button
        type="button"
        className="filter-section__head"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span>{section.label}</span>
        <ExpandMoreIcon
          className={`filter-section__chevron ${expanded ? "filter-section__chevron--open" : ""}`}
        />
      </button>

      {expanded && (
        <div className="filter-section__body">
          {section.type === "price" ? (
            <>
              <input
                type="range"
                className="filter-section__slider"
                min={499}
                max={maxPrice}
                step={500}
                value={priceRange}
                onChange={(e) => onPriceChange(Number(e.target.value))}
              />
              <div className="filter-section__price-labels">
                <span>₹499</span>
                <span>₹{priceRange.toLocaleString("en-IN")}</span>
              </div>
            </>
          ) : section.id === "discount" ? (
            <div className="filter-section__options">
              {[0, 10, 20, 30, 40].map((pct) => (
                <label key={pct} className="filter-section__radio">
                  <input
                    type="radio"
                    name="discount"
                    checked={minDiscount === pct}
                    onChange={() => onDiscountChange(pct)}
                  />
                  {pct === 0 ? "All" : `${pct}% and above`}
                </label>
              ))}
            </div>
          ) : section.type === "brand" && brands?.length ? (
            <div className="filter-section__options filter-section__options--scroll">
              {brands.map((brand) => (
                <label key={brand} className="filter-section__check">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => onBrandToggle(brand)}
                  />
                  {brand}
                </label>
              ))}
            </div>
          ) : section.id === "category" ? (
            <div className="filter-section__options">
              {section.options.map((opt) => (
                <label key={opt} className="filter-section__check">
                  <input type="checkbox" readOnly />
                  {opt}
                </label>
              ))}
            </div>
          ) : (
            <div className="filter-section__options">
              {section.options?.map((opt) => (
                <label key={opt} className="filter-section__check">
                  <input type="checkbox" readOnly />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterSidebar({
  maxPrice,
  priceRange,
  onPriceChange,
  minDiscount,
  onDiscountChange,
  brands,
  selectedBrands,
  onBrandToggle,
  onReset,
}) {
  const [expanded, setExpanded] = useState({ gender: true, price: true });

  const toggle = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__head">
        <h2 className="filter-sidebar__title">Filters</h2>
        <button type="button" className="filter-sidebar__reset" onClick={onReset}>
          Reset All
        </button>
      </div>

      {FILTER_SECTIONS.map((section) => (
        <FilterSection
          key={section.id}
          section={section}
          expanded={expanded[section.id] ?? false}
          onToggle={() => toggle(section.id)}
          maxPrice={maxPrice}
          priceRange={priceRange}
          onPriceChange={onPriceChange}
          minDiscount={minDiscount}
          onDiscountChange={onDiscountChange}
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandToggle={onBrandToggle}
        />
      ))}
    </aside>
  );
}

export default FilterSidebar;
