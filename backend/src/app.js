import express  from 'express'
const app = express()
app.use(express.json())
import cookieParser from "cookie-parser"
import morgan from 'morgan'
import cors from 'cors'
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors({
    credentials: true,
    origin: [
        "http://localhost:5173",
        
    ]
}));


import authRouter from "./routes/auth.route.js"
import cardroute from './routes/card.route.js'
app.use("/api/auth",authRouter)
app.use("/api/card",cardroute)










export default app