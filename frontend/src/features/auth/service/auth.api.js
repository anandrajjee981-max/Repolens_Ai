import axios from 'axios'

const api = axios.create({
    withCredentials : true,
    baseURL : "https://repolens-ai-tsjn.onrender.com" 
})

export async function login(email, password) {
    try {
        const res = await api.post("/api/auth/login", { email, password });
        return res.data; // 👈 Hamesha data return karein taaki Thunk/Slice ko mile
    } catch (err) {
        console.error("Login Error:", err);
        throw err;
    }
}

export async function register(username, email, password) {
    try {
        const res = await api.post("/api/auth/register", { username, email, password });
        return res.data;
    } catch (err) {
        console.error("Register Error:", err);
        throw err;
    }
}

export async function getme() {
    try {
        const res = await api.get("/api/auth/getme");
        return res.data; // Yeh aapke auth.slice.js ke action.payload me jayega
    } catch (err) {
        console.error("GetMe Error:", err);
        throw err; 
    }
}