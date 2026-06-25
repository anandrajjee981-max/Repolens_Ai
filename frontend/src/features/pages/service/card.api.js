import axios from 'axios'

const api = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3000"
})

export async function createcontent(repoUrl) {
    try {
        const res = await api.post("/api/card/content", { repoUrl })
        return res.data
    }
    catch (err) {
        console.log("Error in createcontent API:", err) // Logger humesha throw se pehle!
        throw err
    }
}

export async function getrepocard() {
    try {
        // FIX: Added 'await' here
        const res = await api.get("/api/card/repocard") 
        return res.data
    }
    catch (err) {
        console.log("Error in getrepocard API:", err)
        throw err
    }
}

export async function getrepocontent(repourl) {
    try {
        // FIX: Added 'await' here
        const res = await api.get(`/api/card/repocontent?repourl=${encodeURIComponent(repourl)}`)
        return res.data
    }
    catch (err) {
        console.log("Error in getrepocontent API:", err)
        throw err
    }
}