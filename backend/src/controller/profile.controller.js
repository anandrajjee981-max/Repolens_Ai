import profilemodel from "../models/analysis.model";
import{repoinfo, readme,packageJson,FileTree} from "../utils/repoInfoExtractor.js"

export async function createcard(req,res){
try{
    const {repoUrl} = req.body;

    const repoInfo = await repoinfo(repoUrl);
    const readmeContent = await readme(repoUrl);
    const packageJsonContent = await packageJson(repoUrl);
    const fileTree = await FileTree(repoUrl, repoInfo.default_branch);  
    


}
catch(err){
    return res.status(500).json({
        message : "internal server error"
    })
}

}











