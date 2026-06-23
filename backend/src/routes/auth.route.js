import express from "express";
const authRouter = express.Router();
import { register, login,getme } from "../controller/auth.controller.js";
import verifyme from "../middleware/verfiyme.js";

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/getme",verifyme, getme);

export default authRouter;
