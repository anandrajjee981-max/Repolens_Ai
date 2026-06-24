import express from "express";
const cardroute = express.Router()
import { createcard ,getrepocard,getcard} from "../controller/profile.controller.js";
import verifyme  from "../middleware/verfiyme.js";
cardroute.post("/content",verifyme,createcard)
cardroute.get("/repocard",verifyme,getrepocard)
// Remove all route parameters from the path string entirely
cardroute.get('/repocontent', verifyme, getcard);
export default cardroute





