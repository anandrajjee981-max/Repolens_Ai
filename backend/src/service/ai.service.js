import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";

const geminimodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralmodel = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generatecontent(
  repoInfo,
  readme,
  packageJson,
  fileTree
) {
  const context = `
Repository Info:
${JSON.stringify(repoInfo, null, 2)}

README:
${readme || "Not Found"}

Package.json:
${
  typeof packageJson === "object"
    ? JSON.stringify(packageJson, null, 2)
    : packageJson || "Not Found"
}

File Tree:
${JSON.stringify(fileTree, null, 2)}
`;

  const prompt = `
You are a Senior Software Engineering Interviewer.

Based on this repository:

${context}

Generate:

5 Beginner Questions
5 Intermediate Questions
5 Advanced Questions

For every question include:

- Question
- Expected Answer Topics
- Difficulty

Return JSON only.

{
  "beginner":[
    {
      "question":"",
      "answerTopics":[],
      "difficulty":""
    }
  ],
  "intermediate":[],
  "advanced":[]
}
`;

  const response = await geminimodel.invoke(prompt);

  const prompt3 = `
You are a Senior Technical Recruiter at a top software company.

Review this GitHub repository as if a candidate submitted it during an internship or software engineering application.

Repository Context:

${context}

Evaluate:

1. Technical Complexity
2. Code Organization
3. Scalability
4. Documentation
5. Industry Readiness

Provide:

- Overall Score (0-100)
- Hiring Recommendation
- Strengths
- Weaknesses
- Missing Improvements
- Final Recruiter Feedback

Be strict and realistic.

Return valid JSON only.

{
  "overallScore":0,
  "hiringRecommendation":"",
  "strengths":[],
  "weaknesses":[],
  "improvements":[],
  "feedback":""
}
`;

  const response3 = await geminimodel.invoke(prompt3);

 return {
  questions: response.content,
  review: response3.content,
};
}

export async function othergeneratecontent(
  repoInfo,
  readme,
  packageJson,
  fileTree
) {
  const context = `
Repository Info:
${JSON.stringify(repoInfo, null, 2)}

README:
${readme || "Not Found"}

Package.json:
${
  typeof packageJson === "object"
    ? JSON.stringify(packageJson, null, 2)
    : packageJson || "Not Found"
}

File Tree:
${JSON.stringify(fileTree, null, 2)}
`;

  const prompt = `
You are a Senior Open Source Maintainer.

Generate a professional README.md for the repository below.

Repository Context:

${context}

Sections Required:

# Project Name

## Overview

## Features

## Tech Stack

## Installation

## Usage

## Folder Structure

## Future Improvements

Rules:

- Use markdown.
- Professional GitHub style.
- No placeholder text.

Return markdown only.
`;

  const response = await mistralmodel.invoke(prompt);

  const prompt2 = `
You are RepoLens Roast Mode.

Your job is to roast software projects in a funny, sarcastic, but non-offensive way.

Analyze the repository information provided below:

${context}

Rules:

- Be funny but constructive.
- Do not use abusive language.
- Point out real issues when possible.
- Maximum 8 roast lines.
- Sound like a senior developer roasting a junior developer's project.
- Mix humor with useful feedback.
- If the project is good, roast less and praise more.

Return JSON only.

{
  "roasts":[]
}
`;

  const response2 = await mistralmodel.invoke(prompt2);

  return {
    readme: response.content,
    roast: response2.content,
  };
}