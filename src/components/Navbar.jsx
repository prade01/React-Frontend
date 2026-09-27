import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = ({ onSelectCategory }) => {
  const navigate = useNavigate();

  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  // ================================
  // THEME
  // ================================
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light-theme"
  );

  // ================================
  // SEARCH
  // ================================
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ================================
  // NAVBAR
  // ================================
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  // ================================
  // CATEGORIES
  // ================================
  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Television",
    "Camera",
    "Wearable",
    "Toys",
    "Fashion",
  ];

  // ================================
  // APPLY THEME
  // ================================
  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  // ================================
  // CLEANUP SEARCH TIMEOUT
  // ================================
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // ================================
  // CLOSE SEARCH ON OUTSIDE CLICK
  // ================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchResults([]);
        setNoResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ================================
  // THEME TOGGLE
  // ================================
  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark-theme"
        ? "light-theme"
        : "dark-theme"
    );
  };

  // ================================
  // CLEAR SEARCH
  // ================================
  const clearSearch = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setInput("");
    setSearchResults([]);
    setNoResults(false);
    setIsLoading(false);
  };

  // ================================
  // LIVE SEARCH
  // ================================
  const handleSearch = (value) => {
    setInput(value);

    const keyword = value.trim();

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!keyword) {
      setSearchResults([]);
      setNoResults(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setNoResults(false);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/products/search",
          {
            params: {
              keyword,
            },
          }
        );

        const results = Array.isArray(response.data)
          ? response.data
          : [];

        setSearchResults(results);
        setNoResults(results.length === 0);
      } catch (error) {
        console.error("Error searching products:", error);

        setSearchResults([]);
        setNoResults(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  // ================================
  // PRODUCT CLICK
  // ================================
  const handleProductClick = (product) => {
    const productId =
      product.id ||
      product._id ||
      product.productId;

    if (!productId) {
      console.error("Product ID not found:", product);
      return;
    }

    clearSearch();

    setIsNavCollapsed(true);
    setIsCategoryOpen(false);

    navigate(`/product/${productId}`);
  };

  // ================================
  // NAVIGATION
  // ================================
  const handleNavigate = (path) => {
    // Clear search
    clearSearch();

    // Close mobile navbar
    setIsNavCollapsed(true);

    // Close category dropdown
    setIsCategoryOpen(false);

    // ==========================================
    // IMPORTANT:
    // If navigating to Home, clear the category
    // ==========================================
    if (path === "/") {
      setSelectedCategory("");

      // Tell parent component that no category
      // is currently selected.
      if (onSelectCategory) {
        onSelectCategory(null);
      }
    }

    // Navigate to requested page
    navigate(path);
  };

  // ================================
  // MOBILE NAVBAR TOGGLE
  // ================================
  const handleNavbarToggle = () => {
    setIsNavCollapsed((previous) => !previous);

    // Close category dropdown when navbar changes
    setIsCategoryOpen(false);
  };

  // ================================
  // CATEGORY TOGGLE
  // ================================
  const handleCategoryToggle = () => {
    setIsCategoryOpen((previous) => !previous);
  };

  // ================================
  // CATEGORY SELECT
  // ================================
  const handleCategorySelect = (category) => {
    // Store selected category
    setSelectedCategory(category);

    // Close dropdown
    setIsCategoryOpen(false);

    // Close mobile navbar
    setIsNavCollapsed(true);

    // Clear search
    clearSearch();

    // Send selected category to parent
    if (onSelectCategory) {
      onSelectCategory(category);
    }

    // Stay on Home route and display
    // products based on selected category
    navigate("/");
  };

  // ================================
  // RENDER
  // ================================
  return (
    <nav className="navbar navbar-expand-lg fixed-top custom-navbar shadow-sm">
      <div className="container-fluid navbar-inner">

        {/* ============================
            BRAND
        ============================ */}
        {/* <button
          type="button"
          className="navbar-brand brand-button nav-link nav-button"
          onClick={() => handleNavigate("https://shrutideep.xyz")}
        >
          Prashru
        </button> */}
          <a className="navbar-brand brand-button nav-link nav-button" href="https://shrutideep.xyz/">
              Prashru
            </a>

        {/* ============================
            MOBILE TOGGLE
        ============================ */}
        <button
          type="button"
          className="navbar-toggler"
          onClick={handleNavbarToggle}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ============================
            NAVBAR CONTENT
        ============================ */}
        <div
          id="navbarSupportedContent"
          className={`collapse navbar-collapse ${
            isNavCollapsed ? "" : "show"
          }`}
        >

          {/* ============================
              LEFT NAVIGATION
          ============================ */}
          <ul className="navbar-nav navbar-links">

            {/* HOME */}
            <li className="nav-item">
              <button
                type="button"
                className="nav-link nav-button"
                onClick={() => handleNavigate("/")}
              >
                Home
              </button>
            </li>

            {/* ADD PRODUCT */}
            <li className="nav-item">
              <button
                type="button"
                className="nav-link nav-button"
                onClick={() => handleNavigate("/add_product")}
              >
                Add Product
              </button>
            </li>

            {/* CATEGORIES */}
            <li
              className={`nav-item dropdown ${
                isCategoryOpen ? "show" : ""
              }`}
            >
              <button
                type="button"
                className="nav-link nav-button dropdown-toggle"
                onClick={handleCategoryToggle}
                aria-expanded={isCategoryOpen}
              >
                Categories
              </button>

              <ul
                className={`dropdown-menu ${
                  isCategoryOpen ? "show" : ""
                }`}
              >
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      className={`dropdown-item ${
                        selectedCategory === category
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleCategorySelect(category)
                      }
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            {/* AI AGENT */}
            <li className="nav-item">
              <button
                type="button"
                className="nav-link nav-button"
                onClick={() => handleNavigate("/askai")}
              >
                AI-Agent
              </button>
            </li>

            {/* ORDERS */}
            <li className="nav-item">
              <button
                type="button"
                className="nav-link nav-button"
                onClick={() => handleNavigate("/orders")}
              >
                Orders
              </button>
            </li>
          </ul>

          {/* ============================
              RIGHT SIDE
          ============================ */}
          <div className="navbar-actions">

            {/* CART */}
            <button
              type="button"
              className="nav-link nav-button cart-button"
              onClick={() => handleNavigate("/cart")}
            >
              <i className="bi bi-cart3"></i>
              <span>Cart</span>
            </button>

            {/* THEME */}
            <button
              type="button"
              className="theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={
                theme === "dark-theme"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              <i
                className={
                  theme === "dark-theme"
                    ? "bi bi-sun-fill"
                    : "bi bi-moon-fill"
                }
              ></i>
            </button>

            {/* SEARCH */}
            <div
              className="search-container"
              ref={searchContainerRef}
            >
              <div className="search-box">

                <i className="bi bi-search search-icon"></i>

                <input
                  type="search"
                  className="search-input"
                  placeholder="Type to search..."
                  value={input}
                  onChange={(e) =>
                    handleSearch(e.target.value)
                  }
                  autoComplete="off"
                />

                {/* CLEAR SEARCH */}
                {input && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}

                {/* SEARCH LOADING */}
                {isLoading && (
                  <span className="search-spinner">
                    <span className="spinner-border spinner-border-sm"></span>
                  </span>
                )}
              </div>

              {/* ============================
                  SEARCH RESULTS
              ============================ */}
              {input.trim() && !isLoading && (
                <div className="search-results">

                  {/* NO RESULTS */}
                  {noResults ? (
                    <div className="no-results">
                      <i className="bi bi-search"></i>
                      <span>No products found</span>
                    </div>
                  ) : (
                    searchResults
                      .slice(0, 8)
                      .map((product, index) => {
                        const productId =
                          product.id ||
                          product._id ||
                          product.productId ||
                          `product-${index}`;

                        return (
                          <button
                            type="button"
                            key={productId}
                            className="search-result-item"
                            onClick={() =>
                              handleProductClick(product)
                            }
                          >
                            <div className="search-result-content">

                              <strong>
                                {product.name ||
                                  product.productName ||
                                  "Product"}
                              </strong>

                              {product.category && (
                                <small>
                                  {product.category}
                                </small>
                              )}

                            </div>

                            <i className="bi bi-arrow-right"></i>
                          </button>
                        );
                      })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
