/* */
import React, { useEffect, useState } from "react";
import { initializeAuthentication } from "./auth";

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import UpdateProduct from "./components/UpdateProduct";
import AskAi from "./components/AskAI";
import SearchResults from "./components/SearchResults";
import Order from "./components/Order";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./Context/Context";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { ToastContainer } from "react-toastify";

import "./App.css";


function App() {

    const [selectedCategory, setSelectedCategory] =
        useState("");

    const [authReady, setAuthReady] =
        useState(false);

    const [authError, setAuthError] =
        useState(null);


    // ========================================================
    // CATEGORY
    // ========================================================

    const handleCategorySelect = (category) => {

        setSelectedCategory(
            category || ""
        );
    };


    // ========================================================
    // INITIALIZE JWT + CSRF
    // ========================================================

    useEffect(() => {

        let mounted = true;


        async function initialize() {

            try {

                await initializeAuthentication();


                if (mounted) {

                    setAuthReady(true);
                }

            } catch (error) {

                console.error(
                    "Authentication initialization failed:",
                    error
                );


                if (mounted) {

                    setAuthError(error);
                }
            }
        }


        initialize();


        return () => {

            mounted = false;
        };

    }, []);


    // ========================================================
    // LOADING
    // ========================================================

    if (!authReady && !authError) {

        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >

                <div className="text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <div className="mt-3">
                        Loading application...
                    </div>

                </div>

            </div>
        );
    }


    // ========================================================
    // AUTHENTICATION ERROR
    // ========================================================

    if (authError) {

        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >

                <div className="text-center">

                    <h4>
                        Authentication required
                    </h4>

                    <p className="text-muted">
                        Please login before accessing the
                        ecommerce application.
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            window.location.href = "http://localhost:8080/?redirect=react";
                        }}
                    >
                        Login
                    </button>

                </div>

            </div>
        );
    }


    // ========================================================
    // APPLICATION
    // ========================================================

    return (

        <AppProvider>

            <BrowserRouter>

                <ToastContainer
                    autoClose={2000}
                    hideProgressBar={true}
                />


                <Navbar
                    onSelectCategory={
                        handleCategorySelect
                    }
                />


                <main className="app-main">

                    <Routes>

                        <Route
                            path="/"
                            element={
                                <Home
                                    selectedCategory={
                                        selectedCategory
                                    }
                                />
                            }
                        />


                        <Route
                            path="/add_product"
                            element={
                                <AddProduct />
                            }
                        />


                        <Route
                            path="/product"
                            element={
                                <Product />
                            }
                        />


                        <Route
                            path="/product/:id"
                            element={
                                <Product />
                            }
                        />


                        <Route
                            path="/cart"
                            element={
                                <Cart />
                            }
                        />


                        <Route
                            path="/product/update/:id"
                            element={
                                <UpdateProduct />
                            }
                        />


                        <Route
                            path="/askai"
                            element={
                                <AskAi />
                            }
                        />


                        <Route
                            path="/search-results"
                            element={
                                <SearchResults />
                            }
                        />


                        <Route
                            path="/orders"
                            element={
                                <Order />
                            }
                        />

                    </Routes>

                </main>

            </BrowserRouter>

        </AppProvider>
    );
}

export default App;
/* */
