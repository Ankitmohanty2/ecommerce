import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import SearchBar from "./SearchBar";
import HeaderMenu from "./HeaderMenu";
import VixenLogo from "../common/VixenLogo";

import "../../styles/Header.css";

const PRIMARY_NAV = [
  { id: "ladies", label: "Women" },
  { id: "men", label: "Men" },
  { id: "kids", label: "Kids" },
  { id: "home", label: "Home" },
  { id: "all", label: "All Brands" },
];

const MORE_NAV = [
  { id: "dresses", label: "Dresses" },
  { id: "tops", label: "Tops" },
  { id: "shirts", label: "Shirts" },
  { id: "shoes", label: "Shoes" },
  { id: "bags", label: "Bags" },
  { id: "jewellery", label: "Jewellery" },
  { id: "watches", label: "Watches" },
  { id: "beauty", label: "Beauty" },
  { id: "fragrances", label: "Fragrances" },
  { id: "skincare", label: "Skincare" },
  { id: "accessories", label: "Accessories" },
  { id: "sale", label: "Sale", isSale: true },
];

function Header({ activeCategory = "all", onCategoryChange }) {
  const history = useHistory();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleNav = (id) => {
    if (onCategoryChange) {
      onCategoryChange(id);
      if (history.location.pathname !== "/") {
        history.push("/");
      }
    }
    setMoreOpen(false);
  };

  const isMoreActive = MORE_NAV.some((item) => item.id === activeCategory);

  return (
    <header className="header">
      <div className="header__top">
        <Link to="/" className="header__logo" aria-label="Vixen Fashion home">
          <VixenLogo />
        </Link>

        <nav className="header__nav-main">
          {PRIMARY_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`header__nav-link-main ${activeCategory === item.id ? "header__nav-link-main--active" : ""}`}
              onClick={() => handleNav(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div
            className="header__more"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              className={`header__nav-link-main ${isMoreActive ? "header__nav-link-main--active" : ""}`}
            >
              More
            </button>
            {moreOpen && (
              <div className="header__more-menu">
                {MORE_NAV.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`header__more-item ${item.isSale ? "header__more-item--sale" : ""}`}
                    onClick={() => handleNav(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <SearchBar />

        <HeaderMenu />
      </div>
    </header>
  );
}

export default Header;
