import usermodel from "../models/user.model.js";
import jwt from "jsonwebtoken";
export default async function verifyme  (req, res, next){
  const token = req.cookies.token;
    console.log("Cookies:", req.cookies);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
       console.log("Decoded:", decoded);
    const user = await usermodel.findById(decoded.id);

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }
};