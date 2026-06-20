import express  from 'express'
const app = express()
app.use(express.json())
import cookieParser from "cookie-parser"
app.use(cookieParser())
import authRouter from "./routes/auth.route.js"
app.use("/api/auth",authRouter)











export default app