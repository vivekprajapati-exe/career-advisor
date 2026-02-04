"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIContent, generateAIJSON } from "@/lib/gemini";

/**
 * Generate a cover letter using AI
 */
export async function generateCoverLetter(jobDetails, tone = "professional") {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            include: { resumes: { where: { isPrimary: true }, take: 1 } },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const { jobTitle, companyName, jobDescription } = jobDetails;

        const prompt = `
Write a compelling cover letter for this job application:

JOB DETAILS:
- Title: ${jobTitle}
- Company: ${companyName}
- Description: ${jobDescription}

CANDIDATE PROFILE:
- Name: ${user.name || "Candidate"}
- Current Role: ${user.currentRole || "Professional"}
- Experience: ${user.experience || 0} years
- Skills: ${user.skills?.join(", ") || "Various skills"}
- Industry: ${user.industry || "Technology"}

TONE: ${tone}

Requirements:
1. Opening paragraph: Express enthusiasm and specific interest
2. Body (2 paragraphs): Connect experience to job requirements with examples
3. Closing: Clear call to action
4. Length: 250-350 words
5. Personalize for ${companyName}

Return JSON:
{
  "greeting": "Dear Hiring Manager,",
  "content": "Full cover letter content...",
  "keyMatchedSkills": ["skill1", "skill2"],
  "wordCount": number
}
`;

        const result = await generateAIJSON(prompt);
        return result;
    } catch (error) {
        console.error("Error generating cover letter:", error);
        throw new Error("Failed to generate cover letter");
    }
}

/**
 * Save a cover letter
 */
export async function saveCoverLetter(data) {
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

        const coverLetter = await db.coverLetter.create({
            data: {
                ...data,
                userId: user.id,
            },
        });

        revalidatePath("/cover-letter");
        return coverLetter;
    } catch (error) {
        console.error("Error saving cover letter:", error);
        throw new Error("Failed to save cover letter");
    }
}

/**
 * Get a specific cover letter
 */
export async function getCoverLetter(id) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const coverLetter = await db.coverLetter.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        return coverLetter;
    } catch (error) {
        console.error("Error getting cover letter:", error);
        throw new Error("Failed to get cover letter");
    }
}

/**
 * List all cover letters for current user
 */
export async function listCoverLetters() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const coverLetters = await db.coverLetter.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: "desc" },
        });

        return coverLetters;
    } catch (error) {
        console.error("Error listing cover letters:", error);
        throw new Error("Failed to list cover letters");
    }
}

/**
 * Update a cover letter
 */
export async function updateCoverLetter(id, data) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const coverLetter = await db.coverLetter.update({
            where: {
                id,
                userId: user.id,
            },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/cover-letter");
        return coverLetter;
    } catch (error) {
        console.error("Error updating cover letter:", error);
        throw new Error("Failed to update cover letter");
    }
}

/**
 * Delete a cover letter
 */
export async function deleteCoverLetter(id) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        await db.coverLetter.delete({
            where: {
                id,
                userId: user.id,
            },
        });

        revalidatePath("/cover-letter");
        return { success: true };
    } catch (error) {
        console.error("Error deleting cover letter:", error);
        throw new Error("Failed to delete cover letter");
    }
}

/**
 * Improve a paragraph using AI
 */
export async function improveParagraph(paragraph, context) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const prompt = `
Improve this cover letter paragraph:

Original: "${paragraph}"
Context: ${context || "Cover letter paragraph"}

Requirements:
1. More impactful and engaging
2. Better flow and readability
3. Professional tone
4. Keep similar length

Return ONLY the improved paragraph, no quotes or extra formatting.
`;

    try {
        const improved = await generateAIContent(prompt);
        return improved.trim();
    } catch (error) {
        console.error("Error improving paragraph:", error);
        throw new Error("Failed to improve paragraph");
    }
}
