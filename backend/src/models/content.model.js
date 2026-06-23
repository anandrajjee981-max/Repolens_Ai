import mongoose from "mongoose";
const contentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  repoUrl: {
    type:mongoose.Schema.Types.String,
    ref: "Analysis",
    required: true
  },  
  questions: [String],
  readme: String,
  review: String,
  roast : String, 

})
const contentmodel = mongoose.model("Content",contentSchema)
export default contentmodel;

















