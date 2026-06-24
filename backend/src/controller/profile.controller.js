import profilemodel from "../models/analysis.model.js";
import contentmodel from "../models/content.model.js";
import { extractRepoInfo } from "../utils/info.js";
import {
  generatecontent,
  othergeneratecontent,
} from "../service/ai.service.js";

export async function createcard(req, res) {
  try {
    const { repoUrl } = req.body;

    const {
      repoInfo,
      readme,
      packageJson,
      fileTree,
    } = await extractRepoInfo(repoUrl);

    const analysisData = await profilemodel.create({
      user: req.user._id,
      repoUrl,
      repoName: repoInfo.repoName,
      language: repoInfo.language,
    });

    const response = await generatecontent(
      repoInfo,
      readme,
      packageJson,
      fileTree
    );

    const response2 = await othergeneratecontent(
      repoInfo,
      readme,
      packageJson,
      fileTree
    );

    const contentData = await contentmodel.create({
      user: req.user._id,
      repoUrl,
      questions: response.questions,
      review: response.review,
      readme: response2.readme,
      roast: response2.roast,
    });

    return res.status(201).json({
      message: "Analysis created successfully",
      analysis: analysisData,
      content: contentData,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
}
export async function getcard(req, res) {
  try {
    // 1. Grab the URL from query parameters: /api/card/repocontent?repourl=https://...
    const repourl = req.query.repourl; 

    if (!repourl) {
      return res.status(400).json({ message: "repourl query parameter is required" });
    }

    const contents = await contentmodel.find({
      $or: [
        { user: req.user.id },
        { repoUrl: repourl }
      ]
    });

    if (!contents || contents.length === 0) {
      return res.status(404).json({ message: "no contents found" });
    }

    return res.status(200).json({ message: "your contents", contents });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
}
export  async function  getrepocard (req,res){
try{
const repocard = await profilemodel.find({user : req.user.id})
if(!repocard){
  return res.status(404).json({
    message : "not found"
  })
}

res.status(200).json({
  message : "all saved contents",
  repocard
})


}
catch(err){
return res.status(500).json({
  message : "internal server error"
})

}



}













