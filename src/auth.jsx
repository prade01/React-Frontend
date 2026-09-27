import axios, {
    setJwtToken,
    setCsrfToken
} from "./axios";

export async function initializeAuthentication() {

    const jwtResponse =
        await axios.get("/api/auth/token");

    const jwt = jwtResponse.data?.token;
    //const jwt = jwtResponse.data;

    if (!jwt) {
        throw new Error(
            "JWT token was not returned by server"
        );
    }

    setJwtToken(jwt);

    const csrfResponse =
        await axios.get("/api/auth/csrf");

    const csrf =
        csrfResponse.data?.token;

    if (!csrf) {
        throw new Error(
            "CSRF token was not returned by server"
        );
    }

    setCsrfToken(csrf);

    console.log("JWT initialized");
    console.log("CSRF initialized");

    return true;
}
