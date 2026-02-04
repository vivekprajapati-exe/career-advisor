"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIContent } from "@/lib/gemini";
import { inngest } from "@/inngest/client";

/**
 * Check if user exists in database, create if not
 */
export async function checkUser() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    try {
        const existingUser = await db.user.findUnique({
            where: { clerkUserId: user.id },
        });

        if (existingUser) {
            return existingUser;
        }

        // Create new user
        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                email: user.emailAddresses[0]?.emailAddress || "",
                name: user.fullName || user.firstName || "",
                imageUrl: user.imageUrl,
            },
        });

        return newUser;
    } catch (error) {
        console.error("Error checking/creating user:", error);
        throw new Error("Failed to check user");
    }
}

/**
 * Get current user profile
 */
export async function getUserProfile() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        return user;
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw new Error("Failed to get user profile");
    }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.update({
            where: { clerkUserId: userId },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/dashboard");
        revalidatePath("/onboarding");
        return user;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update user profile");
    }
}

/**
 * Complete onboarding
 */
export async function completeOnboarding(data) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.update({
            where: { clerkUserId: userId },
            data: {
                ...data,
                onboardingCompleted: true,
                updatedAt: new Date(),
            },
        });

        // Trigger background job to generate industry insights
        if (data.industry) {
            await inngest.send({
                name: "user/onboarding.completed",
                data: {
                    userId: user.id,
                    industry: data.industry,
                },
            });
        }

        revalidatePath("/dashboard");
        return user;
    } catch (error) {
        console.error("Error completing onboarding:", error);
        throw new Error("Failed to complete onboarding");
    }
}

/**
 * Update user skills
 */
export async function updateUserSkills(skills) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await db.user.update({
            where: { clerkUserId: userId },
            data: {
                skills,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/dashboard");
        return user;
    } catch (error) {
        console.error("Error updating skills:", error);
        throw new Error("Failed to update skills");
    }
}

/**
 * Generate professional bio using AI
 */
export async function generateBio(profileData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const { name, currentRole, industry, experience, skills } = profileData;

    const prompt = `
Generate a professional bio (2-3 sentences) for:
- Name: ${name || "the user"}
- Current Role: ${currentRole || "Professional"}
- Industry: ${industry || "Technology"}
- Experience: ${experience || 0} years
- Key Skills: ${skills?.join(", ") || "Various skills"}

Make it professional, concise, and suitable for LinkedIn/resume.
Return ONLY the bio text, no quotes or extra formatting.
`;

    try {
        const bio = await generateAIContent(prompt);
        return bio.trim();
    } catch (error) {
        console.error("Error generating bio:", error);
        throw new Error("Failed to generate bio");
    }
}
