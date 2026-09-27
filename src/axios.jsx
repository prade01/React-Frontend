import axios from "axios";

const API = axios.create({
    baseURL:
        import.meta.env.VITE_BASE_URL ||
        "http://localhost:8080",

    withCredentials: true,

    headers: {
        Accept: "application/json"
    }
});


// ========================================================
// TOKEN STORAGE
// ========================================================

let jwtToken = null;
let csrfToken = null;


// ========================================================
// JWT FUNCTIONS
// ========================================================

export function setJwtToken(token) {
    jwtToken = token;
}

export function getJwtToken() {
    return jwtToken;
}

export function clearJwtToken() {
    jwtToken = null;
}


// ========================================================
// CSRF FUNCTIONS
// ========================================================

export function setCsrfToken(token) {
    csrfToken = token;
}

export function getCsrfToken() {
    return csrfToken;
}

export function clearCsrfToken() {
    csrfToken = null;
}


// ========================================================
// REQUEST INTERCEPTOR
// ========================================================

API.interceptors.request.use(
    (config) => {

        // Add JWT to every request when available
        if (jwtToken) {
            config.headers.Authorization =
                `Bearer ${jwtToken}`;
        }


        // Add CSRF token to state-changing requests
        const method =
            (config.method || "get").toUpperCase();

        const csrfMethods = [
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        ];

        if (
            csrfMethods.includes(method) &&
            csrfToken
        ) {
            config.headers["X-CSRF-TOKEN"] =
                csrfToken;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ========================================================
// RESPONSE INTERCEPTOR
// ========================================================

API.interceptors.response.use(
    (response) => response,

    (error) => {

        if (error.response?.status === 401) {
            console.warn(
                "JWT authentication required"
            );
        }

        if (error.response?.status === 403) {
            console.warn(
                "CSRF validation failed or access forbidden"
            );
        }

        return Promise.reject(error);
    }
);


// ========================================================
// DEFAULT AXIOS EXPORT
// ========================================================

export default API;
