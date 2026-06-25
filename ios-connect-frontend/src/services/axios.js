import axios from "axios";


const API = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://ios-connect.vercel.app/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"

    }
});

// Request interceptor to add token from localStorage to Authorization header
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default API;