import jwt from "jsonwebtoken"
export const verifyme = (req,res,next)=>{
    const token = req.cookies.token 
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
let decoded 
try{
decoded = jwt.verify(token,process.env.JWT_SECRET)
req.user = decoded
next()

}
catch(err){
return res.status(401).json({message: "Unauthorized"})
}
}












