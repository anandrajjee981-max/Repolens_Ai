import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const geminimodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

export async function generatecontent(repoinfo, readme,packageJson,FileTree) {
const prompt = `You are a Senior Software Engineering Interviewer.

Based on this repository:

{repoinfo, readme,packageJson,FileTree }

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
      "answerTopics":[]
    }
  ],
  "intermediate":[],
  "advanced":[]
}`
const response = await geminimodel.call(prompt);
const prompt2 = `You are a Senior Open Source Maintainer.

Generate a professional README.md for the repository below.

Repository Context:

{context}

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

Return markdown only.`

const response2 = await geminimodel.call(prompt2);
 return {
    questions: response.text,
    readme: response2.text
  };



}








