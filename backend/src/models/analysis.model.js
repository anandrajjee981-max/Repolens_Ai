import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  repoUrl: {
    type: String,
    required: true,
    unique: true
  },

  repoName: String,
readme: String,
  language: String,




}, {
  timestamps: true
});

export default mongoose.model("Analysis", analysisSchema);