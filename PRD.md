# 📋 Product Requirements Document (PRD)

## One Stop Personalized Career & Education Advisor

**Version:** 1.0  
**Date:** January 22, 2026  
**Project Type:** College Project  

---

## 📌 Executive Summary

A full-stack AI-powered career guidance platform that helps users build resumes, generate cover letters, prepare for interviews, and receive personalized industry insights. Built following the RoadsideCoder tutorial architecture with Supabase instead of Neon.

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js (JavaScript)** | Frontend & Backend (App Router, Server Actions) |
| **Prisma ORM** | Database schema & queries |
| **Supabase** | PostgreSQL database & file storage |
| **Clerk** | Authentication & user management |
| **Inngest** | Background jobs & cron scheduling |
| **Google Gemini AI** | AI features (free tier) |
| **Shadcn UI** | Component library |
| **Tailwind CSS** | Styling |

---

## 🎯 Project Goals

1. **Help job seekers** create professional resumes and cover letters with AI assistance
2. **Provide personalized insights** about target industries (salary, trends, skills)
3. **Prepare users for interviews** with AI-powered practice sessions
4. **Deliver weekly updates** on industry trends via background jobs
5. **Stay within free tier limits** of all services (budget: $0)

---

## 👥 Target Users

- **Students** looking for internships or first jobs
- **Job seekers** wanting to improve their application materials
- **Career changers** exploring new industries
- **Professionals** preparing for interviews

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  Next.js Pages + Shadcn UI Components + Tailwind CSS            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP ROUTER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Server      │  │ API Routes  │  │ Middleware (Clerk Auth) │  │
│  │ Actions     │  │ /api/*      │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
┌───────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PRISMA ORM      │ │  CLERK AUTH     │ │  INNGEST        │
│   Database Client │ │  User Sessions  │ │  Background Jobs│
└───────────────────┘ └─────────────────┘ └─────────────────┘
                │                                   │
                ▼                                   ▼
┌───────────────────┐                   ┌─────────────────┐
│   SUPABASE        │                   │  GEMINI AI API  │
│   PostgreSQL +    │                   │  (Free Tier)    │
│   File Storage    │                   └─────────────────┘
└───────────────────┘
```

---

## 📁 Project Structure

```
career-advisor/my-app/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.js
│   │   └── sign-up/[[...sign-up]]/page.js
│   ├── (main)/
│   │   ├── dashboard/page.js
│   │   ├── onboarding/page.js
│   │   ├── resume/page.js
│   │   ├── cover-letter/page.js
│   │   └── interview/page.js
│   ├── api/
│   │   └── inngest/route.js
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── actions/
│   ├── user.js
│   ├── resume.js
│   ├── cover-letter.js
│   ├── interview.js
│   └── industry.js
├── components/
│   ├── ui/                    # Shadcn components
│   ├── forms/
│   ├── dashboard/
│   └── shared/
├── data/
│   └── industries.js          # Static industry data
├── hooks/
│   └── use-fetch.js
├── lib/
│   ├── prisma.js              # Prisma client
│   ├── gemini.js              # Gemini AI client
│   └── utils.js
├── inngest/
│   ├── client.js              # Inngest client
│   └── functions.js           # Background job functions
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── middleware.js              # Clerk middleware
├── next.config.js
├── tailwind.config.js
├── package.json
└── PRD.md
```

---

## 🗃️ Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ==================== USER MODELS ====================

model User {
  id                  String    @id @default(cuid())
  clerkUserId         String    @unique
  email               String    @unique
  name                String?
  imageUrl            String?
  
  // Profile Info
  industry            String?
  subIndustry         String?
  experience          Int?      // Years of experience
  currentRole         String?
  bio                 String?   @db.Text
  skills              String[]
  
  // Preferences
  targetRoles         String[]
  targetIndustries    String[]
  salaryExpectation   Int?
  remotePreference    String?   // "remote", "hybrid", "onsite", "flexible"
  
  // Status
  onboardingCompleted Boolean   @default(false)
  
  // Relations
  resumes             Resume[]
  coverLetters        CoverLetter[]
  interviewSessions   InterviewSession[]
  industryInsight     IndustryInsight?   @relation(fields: [industry], references: [industry])
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

// ==================== RESUME MODELS ====================

model Resume {
  id          String   @id @default(cuid())
  userId      String
  title       String   // "Software Engineer Resume"
  content     String   @db.Text  // Markdown content
  
  // Sections (JSON for flexibility)
  contactInfo Json?    // { name, email, phone, linkedin, portfolio }
  summary     String?  @db.Text
  experience  Json?    // Array of work experiences
  education   Json?    // Array of education entries
  skills      Json?    // Categorized skills
  projects    Json?    // Array of projects
  
  // Metadata
  templateId  String   @default("modern")
  atsScore    Int?     // 0-100 ATS compatibility score
  pdfUrl      String?  // Supabase storage URL
  isPrimary   Boolean  @default(false)
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ==================== COVER LETTER MODELS ====================

model CoverLetter {
  id              String   @id @default(cuid())
  userId          String
  
  // Job Details
  jobTitle        String
  companyName     String
  jobDescription  String   @db.Text
  jobUrl          String?
  
  // Content
  content         String   @db.Text  // Full letter content
  tone            String   @default("professional") // professional, enthusiastic, formal
  
  // Status
  status          String   @default("draft") // draft, completed
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ==================== INTERVIEW MODELS ====================

model InterviewSession {
  id              String   @id @default(cuid())
  userId          String
  
  // Session Details
  category        String   // "technical", "behavioral", "mixed"
  targetRole      String?
  targetCompany   String?
  difficulty      String   @default("medium") // easy, medium, hard
  
  // Results
  totalQuestions  Int
  correctAnswers  Int      @default(0)
  score           Float?   // Percentage score
  questions       Json     // Array of { question, userAnswer, correctAnswer, isCorrect, explanation }
  
  // AI Feedback
  improvementTips String?  @db.Text
  strengths       String[]
  weaknesses      String[]
  
  // Status
  status          String   @default("in_progress") // in_progress, completed
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime @default(now())
  completedAt     DateTime?
}

// ==================== INDUSTRY INSIGHTS MODELS ====================

model IndustryInsight {
  id                String   @id @default(cuid())
  industry          String   @unique
  
  // Market Data
  salaryRanges      Json     // { entry: { min, max }, mid: { min, max }, senior: { min, max } }
  growthRate        Float    // Percentage
  demandLevel       String   // "High", "Medium", "Low"
  
  // Skills & Trends
  topSkills         String[]
  emergingSkills    String[]
  keyTrends         String[]
  
  // Outlook
  marketOutlook     String   // "Positive", "Neutral", "Negative"
  outlookSummary    String?  @db.Text
  
  // Top Companies
  topCompanies      String[]
  
  // Relations
  users             User[]
  
  // Update Tracking
  lastUpdated       DateTime @default(now())
  nextUpdate        DateTime
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

---

## ✨ Core Features Specification

### Feature 1: User Onboarding

**Description:** Multi-step guided onboarding to collect user profile data for AI personalization.

#### User Stories
- As a new user, I want to complete a guided onboarding so the AI understands my career goals
- As a user, I want to specify my current skills, experience, and education
- As a user, I want to select my target industries and roles
- As a user, I want to be able to edit my profile later

#### Onboarding Steps
1. **Welcome** - Introduction to the platform
2. **Industry Selection** - Choose primary industry and sub-industry
3. **Experience** - Years of experience, current role
4. **Skills** - Add skills with autocomplete
5. **Goals** - Target roles, salary expectations, work preferences
6. **Bio** - Professional summary (AI can help generate)
7. **Complete** - Review and confirm

#### Server Actions
```javascript
// actions/user.js
"use server";

export async function updateUserProfile(data) { }
export async function completeOnboarding() { }
export async function getUserProfile() { }
export async function updateUserSkills(skills) { }
```

#### AI Prompt (Bio Generation)
```javascript
const bioGenerationPrompt = `
Generate a professional bio (2-3 sentences) for:
- Name: {name}
- Current Role: {currentRole}
- Industry: {industry}
- Experience: {years} years
- Key Skills: {skills}

Make it professional, concise, and suitable for LinkedIn/resume.
`;
```

#### UI Components
- `Progress` - Step indicator
- `Form` + `Input` + `Textarea` - Data collection
- `Select` + `Combobox` - Industry/role selection
- `Badge` - Skill tags
- `Button` - Navigation

---

### Feature 2: Industry Insights Dashboard

**Description:** AI-generated personalized dashboard showing industry trends, salary data, and career recommendations.

#### User Stories
- As a user, I want to see salary ranges for my target roles
- As a user, I want to know trending skills in my industry
- As a user, I want personalized career recommendations
- As a user, I want weekly updates on industry changes

#### Dashboard Sections
1. **Industry Overview Card** - Growth rate, demand level, market outlook
2. **Salary Insights** - Entry/Mid/Senior salary ranges with visualization
3. **Top Skills** - In-demand skills with your skill match percentage
4. **Key Trends** - Current industry trends and news
5. **Recommended Skills** - Skills to learn based on gaps
6. **Top Companies** - Companies hiring in your industry

#### Server Actions
```javascript
// actions/industry.js
"use server";

export async function getIndustryInsights(industry) { }
export async function refreshIndustryInsights(industry) { }
export async function getPersonalizedRecommendations(userId) { }
```

#### AI Prompt (Industry Insights)
```javascript
const industryInsightsPrompt = `
Generate comprehensive industry insights for: {industry}

Provide data in this JSON format:
{
  "salaryRanges": {
    "entry": { "min": number, "max": number },
    "mid": { "min": number, "max": number },
    "senior": { "min": number, "max": number }
  },
  "growthRate": number (percentage, e.g., 15.5),
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "emergingSkills": ["skill1", "skill2", "skill3"],
  "keyTrends": ["trend1", "trend2", "trend3"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "outlookSummary": "2-3 sentence market outlook",
  "topCompanies": ["company1", "company2", "company3", "company4", "company5"]
}

Use realistic 2025-2026 data for the {industry} industry.
Salary should be in USD annual.
`;
```

#### Inngest Cron Job
```javascript
// inngest/functions.js
export const weeklyIndustryUpdate = inngest.createFunction(
  { id: "weekly-industry-update" },
  { cron: "TZ=Asia/Kolkata 0 9 * * 1" }, // Every Monday 9 AM IST
  async ({ step }) => {
    // 1. Get all unique industries from users
    // 2. For each industry, call Gemini AI
    // 3. Update IndustryInsight table
    // 4. Set nextUpdate to 1 week from now
  }
);
```

#### UI Components
- `Card` - Section containers
- `Badge` - Demand level, outlook indicators
- `Progress` - Skill match percentage
- `Tabs` - Switch between insights views
- Charts (via Recharts) - Salary visualization

---

### Feature 3: AI Resume Builder

**Description:** Create and edit professional resumes with AI-powered content improvement and ATS optimization.

#### User Stories
- As a user, I want to create a resume from my profile data
- As a user, I want AI to improve my bullet points
- As a user, I want to see my ATS compatibility score
- As a user, I want to download my resume as PDF
- As a user, I want to choose from different templates

#### Resume Sections
1. **Contact Information** - Name, email, phone, LinkedIn, portfolio
2. **Professional Summary** - AI-generated or custom
3. **Work Experience** - Companies, roles, achievements (AI-enhanced bullets)
4. **Education** - Degrees, institutions, achievements
5. **Skills** - Categorized technical and soft skills
6. **Projects** - Personal/professional projects

#### Server Actions
```javascript
// actions/resume.js
"use server";

export async function createResume(data) { }
export async function updateResume(id, data) { }
export async function deleteResume(id) { }
export async function getResume(id) { }
export async function listResumes(userId) { }
export async function improveContent(content, context) { }
export async function generateSummary(profile) { }
export async function checkATS(resumeContent) { }
export async function saveResumeToStorage(resumeId, pdfBlob) { }
```

#### AI Prompts

**Bullet Point Improvement:**
```javascript
const bulletImprovementPrompt = `
Improve this resume bullet point to be more impactful:

Original: "{originalBullet}"
Context: {jobTitle} role

Requirements:
1. Start with strong action verb
2. Include quantifiable metrics if possible
3. Show impact and results
4. Keep under 15 words
5. Use industry keywords

Return JSON:
{
  "improved": "improved bullet point",
  "explanation": "why this is better"
}
`;
```

**ATS Check:**
```javascript
const atsCheckPrompt = `
Analyze this resume for ATS compatibility:

{resumeContent}

Check for:
1. Standard section headers
2. Keyword optimization
3. Proper formatting
4. Contact info completeness
5. Action verbs usage

Return JSON:
{
  "score": number (0-100),
  "issues": [
    { "severity": "high|medium|low", "issue": "description", "fix": "suggestion" }
  ],
  "keywords": {
    "present": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"]
  }
}
`;
```

#### UI Components
- `Tabs` - Section navigation
- `Form` + `Input` + `Textarea` - Content editing
- `Button` - Add/remove entries
- `Card` - Preview panel
- `Dialog` - AI suggestions
- `Progress` - ATS score
- `Badge` - Keywords

#### PDF Generation
Using `@react-pdf/renderer` for client-side PDF generation:
```javascript
// components/resume/ResumePDF.js
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
```

---

### Feature 4: AI Cover Letter Generator

**Description:** Generate personalized cover letters tailored to specific job descriptions.

#### User Stories
- As a user, I want to paste a job description and get a tailored cover letter
- As a user, I want to customize the generated content
- As a user, I want to choose the tone (professional, enthusiastic, formal)
- As a user, I want to save and manage multiple cover letters

#### Generation Flow
1. **Input Job Details** - Title, company, job description (paste or URL)
2. **Select Tone** - Professional, enthusiastic, or formal
3. **Generate** - AI creates personalized cover letter
4. **Edit** - Customize paragraph by paragraph
5. **Save/Export** - Save to account or copy/download

#### Server Actions
```javascript
// actions/cover-letter.js
"use server";

export async function generateCoverLetter(jobDetails, userProfile, tone) { }
export async function saveCoverLetter(data) { }
export async function updateCoverLetter(id, data) { }
export async function deleteCoverLetter(id) { }
export async function listCoverLetters(userId) { }
export async function improveParagraph(paragraph, context) { }
```

#### AI Prompt
```javascript
const coverLetterPrompt = `
Write a compelling cover letter for this job application:

JOB DETAILS:
- Title: {jobTitle}
- Company: {companyName}
- Description: {jobDescription}

CANDIDATE PROFILE:
- Name: {name}
- Current Role: {currentRole}
- Experience: {years} years
- Skills: {skills}
- Key Achievements: {achievements}

TONE: {tone}

Requirements:
1. Opening paragraph: Express enthusiasm and specific interest
2. Body (2 paragraphs): Connect experience to job requirements with examples
3. Closing: Clear call to action
4. Length: 250-350 words
5. Personalize for {companyName}

Return JSON:
{
  "greeting": "Dear Hiring Manager,",
  "content": "Full cover letter content...",
  "keyMatchedSkills": ["skill1", "skill2"],
  "wordCount": number
}
`;
```

#### UI Components
- `Textarea` - Job description input
- `Select` - Tone selection
- `Card` - Letter preview
- `Button` - Generate, copy, download
- `Dialog` - Edit paragraph
- `Skeleton` - Loading state

---

### Feature 5: AI Interview Preparation

**Description:** Practice interview questions with AI feedback and track improvement over time.

#### User Stories
- As a user, I want to practice common interview questions for my target role
- As a user, I want AI feedback on my answers
- As a user, I want to track my practice progress
- As a user, I want role-specific technical questions

#### Interview Flow
1. **Setup** - Select category (behavioral, technical, mixed), role, difficulty
2. **Quiz** - 10 multiple-choice questions
3. **Results** - Score, correct answers, explanations
4. **Feedback** - AI-generated improvement tips
5. **History** - View past sessions and progress

#### Question Categories
- **Behavioral** - STAR method questions (Tell me about a time...)
- **Technical** - Role-specific knowledge questions
- **Situational** - Hypothetical scenarios
- **Company-specific** - Culture fit, values

#### Server Actions
```javascript
// actions/interview.js
"use server";

export async function generateQuestions(category, role, difficulty, count = 10) { }
export async function startSession(userId, category, role) { }
export async function submitAnswer(sessionId, questionIndex, answer) { }
export async function completeSession(sessionId) { }
export async function getSessionHistory(userId) { }
export async function getImprovementTips(sessionResults) { }
```

#### AI Prompts

**Question Generation:**
```javascript
const questionGenerationPrompt = `
Generate {count} multiple-choice interview questions for:
- Role: {role}
- Category: {category}
- Difficulty: {difficulty}

For each question provide:
1. Question text
2. 4 options (A, B, C, D)
3. Correct answer
4. Explanation why it's correct

Return JSON array:
[
  {
    "question": "question text",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "correctAnswer": "A",
    "explanation": "why A is correct"
  }
]
`;
```

**Improvement Tips:**
```javascript
const improvementTipsPrompt = `
Based on these interview practice results, provide improvement tips:

Category: {category}
Role: {role}
Score: {score}%
Incorrect Questions: {incorrectQuestions}

Provide:
1. Overall assessment (2 sentences)
2. Top 3 areas to improve
3. Specific study recommendations
4. Encouragement message

Return JSON:
{
  "assessment": "string",
  "areasToImprove": ["area1", "area2", "area3"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "encouragement": "string"
}
`;
```

#### UI Components
- `RadioGroup` - Answer selection
- `Card` - Question display
- `Progress` - Quiz progress
- `Button` - Navigation
- `Alert` - Correct/incorrect feedback
- `Badge` - Score, difficulty
- `Table` - Session history

---

## 💰 Free Tier Limits & Optimization

### Service Limits

| Service | Free Tier Limit | Our Usage Strategy |
|---------|-----------------|-------------------|
| **Gemini API** | 15-60 RPM, rate-limited | Use `gemini-2.5-flash-lite` for simple tasks; cache responses |
| **Supabase** | 500MB DB, 1GB storage, 50K MAU | Efficient queries, compress PDFs |
| **Clerk** | 10,000 MAUs | More than sufficient for college project |
| **Inngest** | 50,000 executions/month | Weekly cron + limited background jobs |
| **Vercel** | 100GB bandwidth, serverless | Standard deployment |

### Optimization Strategies

#### 1. AI Response Caching
```javascript
// Cache industry insights in database
// Only regenerate weekly via Inngest cron
// Reduces Gemini API calls by ~90%
```

#### 2. Client-Side Debouncing
```javascript
// Debounce AI improvement requests
// Wait 500ms after user stops typing
// Prevents rapid API calls
```

#### 3. Request Batching
```javascript
// Batch multiple questions in one API call
// Generate 10 interview questions at once
// Instead of 10 separate calls
```

#### 4. Supabase Keep-Alive
```javascript
// Inngest daily ping to prevent Supabase pause
export const keepSupabaseAlive = inngest.createFunction(
  { id: "keep-supabase-alive" },
  { cron: "0 12 * * *" }, // Daily at noon
  async () => {
    await db.user.count(); // Simple query to keep DB active
  }
);
```

---

## 🔧 Environment Variables

```env
# .env.local

# Supabase
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Gemini AI
GEMINI_API_KEY=xxx

# Inngest
INNGEST_SIGNING_KEY=xxx
INNGEST_EVENT_KEY=xxx
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@clerk/nextjs": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "@google/generative-ai": "^0.21.0",
    "inngest": "^3.0.0",
    "@react-pdf/renderer": "^3.0.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.0.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.0.0",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Initialize Next.js project with App Router
- [ ] Set up Supabase database connection
- [ ] Configure Prisma with schema
- [ ] Implement Clerk authentication
- [ ] Create basic layout and navigation
- [ ] Set up Shadcn UI components

### Phase 2: User System (Week 2)
- [ ] Build onboarding flow (multi-step form)
- [ ] Create user profile management
- [ ] Implement skills input with autocomplete
- [ ] Set up user dashboard layout

### Phase 3: Industry Insights (Week 3)
- [ ] Create industry insights dashboard
- [ ] Integrate Gemini AI for data generation
- [ ] Set up Inngest for weekly updates
- [ ] Build insight cards and visualizations

### Phase 4: Resume Builder (Week 4)
- [ ] Build resume editor interface
- [ ] Implement AI content improvement
- [ ] Add ATS scoring feature
- [ ] Create PDF export functionality

### Phase 5: Cover Letter & Interview (Week 5)
- [ ] Build cover letter generator
- [ ] Implement tone selection
- [ ] Create interview quiz system
- [ ] Add progress tracking

### Phase 6: Polish & Deploy (Week 6)
- [ ] UI/UX improvements
- [ ] Error handling
- [ ] Testing
- [ ] Deploy to Vercel
- [ ] Documentation

---

## 📱 Responsive Design

All pages must be responsive across:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

Use Tailwind CSS responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`

---

## 🔐 Security Considerations

1. **Authentication** - All routes except landing page protected by Clerk
2. **Authorization** - Users can only access their own data
3. **API Keys** - Stored in environment variables, never exposed to client
4. **Input Validation** - Zod schemas for all form inputs
5. **Rate Limiting** - Implemented on AI endpoints

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| User onboarding completion rate | > 80% |
| Resume creation rate | > 50% of users |
| Interview practice sessions per user | > 3 |
| Page load time | < 2 seconds |
| Mobile usability score | > 90 |

---

## 📚 References

- [RoadsideCoder Tutorial](https://youtu.be/UbXpRv5ApKA) - Base architecture
- [Gemini AI Docs](https://ai.google.dev/docs) - AI integration
- [Supabase Docs](https://supabase.com/docs) - Database & storage
- [Clerk Docs](https://clerk.com/docs) - Authentication
- [Inngest Docs](https://www.inngest.com/docs) - Background jobs
- [Shadcn UI](https://ui.shadcn.com) - Component library
- [Prisma Docs](https://www.prisma.io/docs) - ORM

---

## ✅ Checklist Before Development

- [ ] Create Supabase project and get connection strings
- [ ] Create Clerk application and get API keys
- [ ] Get Gemini API key from Google AI Studio
- [ ] Create Inngest account
- [ ] Set up Vercel project for deployment
- [ ] Initialize Git repository

---

**Document Version:** 1.0  
**Last Updated:** January 22, 2026  
**Authors:** Team Career Advisor
