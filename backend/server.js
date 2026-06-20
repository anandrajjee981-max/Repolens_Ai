import 'dotenv/config';
import app from "./src/app.js";
import { connectdb } from "./src/config/database.js";

connectdb()








app.listen(3000)