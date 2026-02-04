"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIContent, generateAIJSON } from "@/lib/gemini";

/**
 * Create a new resume
 */
export async function createResume(data) {
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

        const resume = await db.resume.create({
            data: {
                ...data,
                userId: user.id,
                content: data.content || "",
            },
        });

        revalidatePath("/resume");
        return resume;
    } catch (error) {
        console.error("Error creating resume:", error);
        throw new Error("Failed to create resume");
    }
}

/**
 * Get a specific resume
 */
export async function getResume(id) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const resume = await db.resume.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        return resume;
    } catch (error) {
        console.error("Error getting resume:", error);
        throw new Error("Failed to get resume");
    }
}

/**
 * List all resumes for current user
 */
export async function listResumes() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const resumes = await db.resume.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: "desc" },
        });

        return resumes;
    } catch (error) {
        console.error("Error listing resumes:", error);
        throw new Error("Failed to list resumes");
    }
}

/**
 * Update a resume
 */
export async function updateResume(id, data) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        const resume = await db.resume.update({
            where: {
                id,
                userId: user.id,
            },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/resume");
        return resume;
    } catch (error) {
        console.error("Error updating resume:", error);
        throw new Error("Failed to update resume");
    }
}

/**
 * Delete a resume
 */
export async function deleteResume(id) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        await db.resume.delete({
            where: {
                id,
                userId: user.id,
            },
        });

        revalidatePath("/resume");
        return { success: true };
    } catch (error) {
        console.error("Error deleting resume:", error);
        throw new Error("Failed to delete resume");
    }
}

/**
 * Improve resume bullet point using AI
 */
export async function improveBulletPoint(originalBullet, jobTitle) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const prompt = `
Improve this resume bullet point to be more impactful:

Original: "${originalBullet}"
Context: ${jobTitle || "Professional"} role

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

    try {
        const result = await generateAIJSON(prompt);
        return result;
    } catch (error) {
        console.error("Error improving bullet point:", error);
        throw new Error("Failed to improve content");
    }
}

/**
 * Generate professional summary using AI
 */
export async function generateSummary(profile) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const { name, currentRole, industry, experience, skills, targetRoles } = profile;

    const prompt = `
Write a professional summary for a resume:
- Name: ${name || "the candidate"}
- Current Role: ${currentRole || "Professional"}
- Industry: ${industry || "Technology"}
- Experience: ${experience || 0} years
- Key Skills: ${skills?.join(", ") || "Various skills"}
- Target Roles: ${targetRoles?.join(", ") || "Professional positions"}

Requirements:
1. 3-4 sentences maximum
2. Highlight key achievements
3. Focus on value proposition
4. Include relevant keywords
5. Professional tone

Return ONLY the summary text, no quotes or extra formatting.
`;

    try {
        const summary = await generateAIContent(prompt);
        return summary.trim();
    } catch (error) {
        console.error("Error generating summary:", error);
        throw new Error("Failed to generate summary");
    }
}

/**
 * Check ATS compatibility of resume
 */
export async function checkATS(resumeContent) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const prompt = `
Analyze this resume for ATS (Applicant Tracking System) compatibility:

${resumeContent}

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
    { "severity": "high" | "medium" | "low", "issue": "description", "fix": "suggestion" }
  ],
  "keywords": {
    "present": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"]
  },
  "summary": "Brief overall assessment"
}
`;

    try {
        const result = await generateAIJSON(prompt);
        return result;
    } catch (error) {
        console.error("Error checking ATS:", error);
        throw new Error("Failed to check ATS compatibility");
    }
}
