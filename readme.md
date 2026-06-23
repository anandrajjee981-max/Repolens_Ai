# RepoLens AI 🚀

RepoLens AI is an AI-powered GitHub repository analyzer that helps developers, students, recruiters, and hiring managers quickly understand the quality, structure, and potential of a software project.

Simply paste a GitHub repository URL and RepoLens AI automatically analyzes the project using GitHub APIs and Large Language Models (Gemini + Mistral) to generate technical insights, interview questions, recruiter reviews, AI-generated documentation, and even a fun roast mode.

---

## ✨ Features

### 🔍 Repository Analysis

* Extracts repository metadata using GitHub API
* Detects programming language and project information
* Retrieves repository structure and file tree
* Extracts README and package.json automatically

### 🎯 AI Interview Preparation

* Generates Beginner Level Questions
* Generates Intermediate Level Questions
* Generates Advanced Level Questions
* Includes expected answer topics and difficulty levels

### 👨‍💼 Recruiter Review

* Technical complexity evaluation
* Code organization assessment
* Scalability review
* Documentation quality analysis
* Hiring recommendation and project score

### 📝 AI README Generator

* Generates professional README.md files
* Creates installation and usage guides
* Improves project presentation for recruiters

### 😂 Roast Mode

* Fun AI-generated repository roasting
* Constructive and developer-friendly feedback
* Highlights project weaknesses humorously

### 🔐 Authentication

* JWT-based authentication
* Secure user sessions
* Protected routes

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI Models

* Gemini 2.5 Flash Lite
* Mistral Medium

### APIs

* GitHub REST API

---

## ⚙️ How It Works

1. User pastes a GitHub repository URL.
2. Backend extracts repository information using GitHub API.
3. README, package.json, and file structure are collected.
4. Gemini generates:

   * Interview Questions
   * Recruiter Review
5. Mistral generates:

   * Professional README
   * Roast Mode Feedback
6. Results are stored in MongoDB.
7. Frontend displays the complete repository analysis dashboard.

---

## 📂 Project Structure

```bash
src/
├── controller/
├── middleware/
├── models/
├── routes/
├── service/
├── utils/
├── config/
└── server.js
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone <repository-url>
cd repolens
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
PORT=3000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

GITHUB_TOKEN=your_github_token

GEMINI_API_KEY=your_gemini_api_key

MISTRAL_API_KEY=your_mistral_api_key
```

### Start Server

```bash
npm run dev
```

---

## 📸 Use Cases

### Developers

* Improve project quality
* Generate README files
* Prepare for interviews

### Students

* Understand project strengths and weaknesses
* Practice repository-based interview questions

### Recruiters

* Quickly evaluate GitHub projects
* Assess technical depth of candidates

### Open Source Contributors

* Improve documentation
* Discover project gaps

---

## 🌟 Future Improvements

### Phase 2

* Resume Bullet Point Generator
* ATS-Friendly Project Description Generator
* LinkedIn Project Description Generator
* Portfolio Content Generator

### Phase 3

* Multi-Repository Comparison
* GitHub Profile Analysis
* Developer Skill Assessment
* Repository Ranking System

### Phase 4

* AI Architecture Diagram Generation
* Code Quality Score Dashboard
* Team Collaboration Analysis
* Contribution Heatmap Insights

### Phase 5

* PDF Report Export
* One-Click Recruiter Report
* Public Shareable Analysis Links
* AI Career Recommendations

---

## 🎯 Vision

RepoLens AI aims to become the "NotebookLM for GitHub Repositories" — helping developers instantly understand, improve, and showcase software projects through AI-powered analysis.

---

## 👨‍💻 Author

Anand Raj

Built with ❤️ using GitHub API, Gemini AI, Mistral AI, Node.js, Express.js, MongoDB, and React.
