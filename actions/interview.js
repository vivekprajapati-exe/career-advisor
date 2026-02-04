"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIJSON } from "@/lib/gemini";

/**
 * Generate interview questions using AI
 */
export async function generateQuestions(category, role, difficulty, count = 10) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const prompt = `
Generate ${count} multiple-choice interview questions for:
- Role: ${role || "Software Engineer"}
- Category: ${category || "mixed"} (technical, behavioral, or mixed)
- Difficulty: ${difficulty || "medium"} (easy, medium, hard)

For each question provide:
1. Question text
2. 4 options (A, B, C, D)
3. Correct answer (just the letter)
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

Make questions realistic and relevant to ${role || "the role"}.
`;

    try {
        const questions = await generateAIJSON(prompt);
        return questions;
    } catch (error) {
        console.error("Error generating questions:", error);
        throw new Error("Failed to generate questions");
    }
}

/**
 * Start a new interview session
 */
export async function startSession(category, role, difficulty) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Generate questions
        const questions = await generateQuestions(category, role, difficulty);

        // Create session
        const session = await db.interviewSession.create({
            data: {
                userId: user.id,
                category: category || "mixed",
                targetRole: role || user.currentRole || "Professional",
                difficulty: difficulty || "medium",
                totalQuestions: questions.length,
                questions: questions.map((q) => ({
                    ...q,
                    userAnswer: null,
                    isCorrect: null,
                })),
                status: "in_progress",
            },
        });

        revalidatePath("/interview");
        return session;
    } catch (error) {
        console.error("Error starting session:", error);
        throw new Error("Failed to start interview session");
    }
}

/**
 * Submit an answer for a question
 */
export async function submitAnswer(sessionId, questionIndex, answer) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const session = await db.interviewSession.findFirst({
            where: {
                id: sessionId,
                userId: user.id,
            },
        });

        if (!session) {
            throw new Error("Session not found");
        }

        const questions = session.questions;
        const question = questions[questionIndex];

        if (!question) {
            throw new Error("Question not found");
        }

        // Update the question with user's answer
        const isCorrect = answer === question.correctAnswer;
        questions[questionIndex] = {
            ...question,
            userAnswer: answer,
            isCorrect,
        };

        // Calculate correct answers
        const correctAnswers = questions.filter((q) => q.isCorrect === true).length;

        // Update session
        const updatedSession = await db.interviewSession.update({
            where: { id: sessionId },
            data: {
                questions,
                correctAnswers,
            },
        });

        return {
            isCorrect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            session: updatedSession,
        };
    } catch (error) {
        console.error("Error submitting answer:", error);
        throw new Error("Failed to submit answer");
    }
}

/**
 * Complete an interview session
 */
export async function completeSession(sessionId) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const session = await db.interviewSession.findFirst({
            where: {
                id: sessionId,
                userId: user.id,
            },
        });

        if (!session) {
            throw new Error("Session not found");
        }

        // Calculate final score
        const score = (session.correctAnswers / session.totalQuestions) * 100;

        // Get incorrect questions for feedback
        const incorrectQuestions = session.questions
            .filter((q) => q.isCorrect === false)
            .map((q) => q.question);

        // Generate improvement tips
        const feedback = await getImprovementTips(
            session.category,
            session.targetRole,
            score,
            incorrectQuestions
        );

        // Update session
        const completedSession = await db.interviewSession.update({
            where: { id: sessionId },
            data: {
                status: "completed",
                score,
                completedAt: new Date(),
                improvementTips: feedback.assessment,
                strengths: feedback.strengths || [],
                weaknesses: feedback.areasToImprove || [],
            },
        });

        revalidatePath("/interview");
        return { session: completedSession, feedback };
    } catch (error) {
        console.error("Error completing session:", error);
        throw new Error("Failed to complete session");
    }
}

/**
 * Get improvement tips based on session results
 */
async function getImprovementTips(category, role, score, incorrectQuestions) {
    const prompt = `
Based on these interview practice results, provide improvement tips:

Category: ${category}
Role: ${role}
Score: ${score.toFixed(1)}%
Number of Incorrect Questions: ${incorrectQuestions.length}
Sample Incorrect Questions: ${incorrectQuestions.slice(0, 3).join("; ")}

Provide:
1. Overall assessment (2 sentences)
2. Top 3 areas to improve
3. Top 3 strengths (based on what they likely got right)
4. Specific study recommendations
5. Encouragement message

Return JSON:
{
  "assessment": "string",
  "areasToImprove": ["area1", "area2", "area3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "encouragement": "string"
}
`;

    try {
        const result = await generateAIJSON(prompt);
        return result;
    } catch (error) {
        console.error("Error getting improvement tips:", error);
        return {
            assessment: "Keep practicing to improve your interview skills!",
            areasToImprove: ["Review fundamentals", "Practice more questions", "Study the explanations"],
            strengths: ["Willingness to learn", "Taking initiative", "Practice mindset"],
            recommendations: ["Review incorrect answers", "Study related topics", "Try again with focus"],
            encouragement: "Every practice session makes you better. Keep going!",
        };
    }
}

/**
 * Get a specific session
 */
export async function getSession(sessionId) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const session = await db.interviewSession.findFirst({
            where: {
                id: sessionId,
                userId: user.id,
            },
        });

        return session;
    } catch (error) {
        console.error("Error getting session:", error);
        throw new Error("Failed to get session");
    }
}

/**
 * Get session history for current user
 */
export async function getSessionHistory() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const sessions = await db.interviewSession.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                category: true,
                targetRole: true,
                difficulty: true,
                totalQuestions: true,
                correctAnswers: true,
                score: true,
                status: true,
                createdAt: true,
                completedAt: true,
            },
        });

        return sessions;
    } catch (error) {
        console.error("Error getting session history:", error);
        throw new Error("Failed to get session history");
    }
}
