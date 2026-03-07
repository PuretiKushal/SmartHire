# SmartHire – AI Powered Recruitment Platform

SmartHire is an **AI-driven recruitment platform** that automates resume screening and candidate evaluation.  
It analyzes resumes, compares them with job requirements, and generates **AI-powered candidate rankings, skill gap analysis, and interview questions** to help recruiters make faster and better hiring decisions.

---

## 🚀 Features

### AI Resume Analysis
SmartHire extracts text from **PDF and DOCX resumes** and analyzes them using AI to evaluate candidate suitability.

### Intelligent Candidate Ranking
Candidates are automatically scored and ranked based on:

- Skills match
- Experience relevance
- Education
- Projects and certifications

### Skill Gap Detection
The platform identifies:

- Matched skills
- Missing required skills
- Areas candidates need improvement

### AI Generated Insights
For each candidate SmartHire generates:

- Candidate summary
- Gap analysis
- Red flags
- Tailored interview questions

### Recruiter Dashboard
Recruiters can:

- Create job roles
- Upload multiple resumes
- View candidate rankings
- Analyze detailed candidate profiles

### Resume Parsing
Supports:

- PDF resumes (via **pdf.js**)
- DOCX resumes (via **mammoth.js**)

### Export Candidate Data
Recruiters can export candidate rankings into:

- CSV
- Excel

---

## 🧠 Tech Stack

### Frontend
- React
- Vite
- JavaScript

### AI
- Claude / LLM based resume evaluation

### Libraries
- pdf.js (PDF parsing)
- mammoth.js (DOCX parsing)
- SheetJS (Excel export)

### Deployment
- Vercel

---

## ⚙️ How It Works

1. Recruiter creates a job role with required skills and experience.
2. Recruiter uploads resumes.
3. SmartHire extracts resume text.
4. AI analyzes each resume against the job description.
5. Candidates receive a **match score (0–100)**.
6. Candidates are ranked automatically.
7. Recruiters review detailed AI insights.

---

## 💻 Installation (Local Setup)

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smarthire.git
