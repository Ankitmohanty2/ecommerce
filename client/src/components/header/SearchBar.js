import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@material-ui/icons/Search";
import { Link } from "react-router-dom";

import { getProducts } from "../../actions/productActions";
import { makeShortText } from "../../utils/makeShortText";

function SearchBar() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.productReducer);
  const [searchText, setSearchText] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const filtered = products?.filter((product) =>
    product.title.longTitle.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={`search search--inline ${focused ? "search--focused" : ""}`}>
      <SearchIcon className="search__icon" />
      <input
        className="search__input-inline"
        placeholder="Search for products, styles, brands..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
      />
      {searchText && focused && filtered?.length > 0 && (
        <div className="search__dropdown search__dropdown--inline">
          {filtered.slice(0, 6).map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="search__result"
              onClick={() => setSearchText("")}
            >
              <img src={product.url} alt="" />
              <span>{makeShortText(product.title.longTitle)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
