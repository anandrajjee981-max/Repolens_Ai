import express from "express";
const cardroute = express.Router()
import { createcard } from "../controller/profile.controller.js";
import verifyme  from "../middleware/verfiyme.js";
cardroute.post("/content",verifyme,createcard)


export default cardroute





