import jwt from "jsonwebtoken"
import usermodel  from "../models/user.model.js"
import bcrypt from "bcrypt"
async function register(req,res){
  try {
    const {username,email,password} = req.body
    const user = await usermodel.findOne({email})
if(user){
    return res.status(400).json({message: "User already exists"})
}
const hash = await bcrypt.hash(password,10)
const newuser = await usermodel.create({username,email,password: hash})
const token = jwt.sign({id: newuser._id},process.env.JWT_SECRET,{expiresIn: "1d"})
res.cookie("token",token,{httpOnly: true})  

res.status(201).json({message: "User created successfully", user: newuser}) 


  }
  catch (error) {
    res.status(500).json({message: "Internal server error"})
  }

}
async function login(req,res){
  try {
    const {email,password} = req.body
    const user = await usermodel.findOne({email}).select("+password")
    if(!user){
        return res.status(400).json({message: "Invalid credentials"})
    }
    const ismatch = await bcrypt.compare(password,user.password)
    if(!ismatch){
        return res.status(400).json({message: "Invalid credentials"})
    }   
    const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "1d"})
    res.cookie("token",token,{httpOnly: true})  
    res.status(200).json({message: "Login successful", user , token})
  }         
    catch (error) {
        res.status(500).json({message: "Internal server error"})
    }           

}
async function getme(req,res){
  try {
    const user = await usermodel.findById(req.user.id)
    if(!user){
        return res.status(404).json({message: "User not found"})
    } 
    res.status(200).json({message: "User found", user})
  }
    catch (error) {     
res.status(500).json({message: "Internal server error"})
    }}

export {register,login,getme}



