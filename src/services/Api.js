import axios from "axios";

const api = axios.create({
    baseURL: "http://student-attendance.myuniv.cloud", // Sesuaikan dengan backend-mu
    headers: { "Content-Type": "application/json" },
    withCredentials: true // Penting untuk mengirim cookie!
});

// Interceptor untuk menyisipkan token pada setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


export default api;
