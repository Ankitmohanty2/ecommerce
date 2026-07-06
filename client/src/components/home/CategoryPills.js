import React from "react";

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "deals", label: "Deals" },
  { id: "mobile", label: "Mobiles" },
  { id: "electronic", label: "Electronics" },
  { id: "appliances", label: "Appliances" },
  { id: "furniture", label: "Home & Furniture" },
  { id: "fashion", label: "Fashion" },
  { id: "beauty", label: "Beauty" },
  { id: "grocery", label: "Grocery" },
];

function CategoryPills({ active, onChange }) {
  return (
    <div className="home__categories">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`home__pill ${active === cat.id ? "home__pill--active" : ""}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryPills;
