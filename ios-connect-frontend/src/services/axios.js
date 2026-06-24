import axios from "axios";


const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})


export default API;