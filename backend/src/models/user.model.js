import mongoose from "mongoose";

//we have to make usermodel 
const userschema = new mongoose.Schema({
username:{
    type: String,
    required: true
}
,
email:{
    type: String,
    required: true,
    unique: true
},
password:{
    type: String,
    required: true,
    select : false
}



})


 const usermodel = mongoose.model("users",userschema)
export default usermodel
