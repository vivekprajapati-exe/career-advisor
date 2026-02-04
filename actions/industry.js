"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIJSON } from "@/lib/gemini";

/**
 * Get industry insights for a specific industry
 */
export async function getIndustryInsights(industry) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        let insights = await db.industryInsight.findUnique({
            where: { industry },
        });

        // If no insights exist, generate them
        if (!insights) {
            insights = await refreshIndustryInsights(industry);
        }

        // Check if insights need updating (older than 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (insights.lastUpdated < sevenDaysAgo) {
            // Refresh in background, return current data
            refreshIndustryInsights(industry).catch(console.error);
        }

        return insights;
    } catch (error) {
        console.error("Error getting industry insights:", error);
        throw new Error("Failed to get industry insights");
    }
}

/**
 * Refresh industry insights using AI
 */
export async function refreshIndustryInsights(industry) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const prompt = `
Generate comprehensive industry insights for: ${industry}

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

Use realistic 2025-2026 data for the ${industry} industry.
Salary should be in USD annual.
`;

    try {
        const data = await generateAIJSON(prompt);

        const nextUpdate = new Date();
        nextUpdate.setDate(nextUpdate.getDate() + 7);

        const insights = await db.industryInsight.upsert({
            where: { industry },
            update: {
                ...data,
                lastUpdated: new Date(),
                nextUpdate,
            },
            create: {
                industry,
                ...data,
                nextUpdate,
            },
        });

        return insights;
    } catch (error) {
        console.error("Error refreshing industry insights:", error);
        throw new Error("Failed to refresh industry insights");
    }
}

/**
 * Get personalized recommendations for user
 */
export async function getPersonalizedRecommendations() {
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

        // Get industry insights
        let industryInsights = null;
        if (user.industry) {
            industryInsights = await db.industryInsight.findUnique({
                where: { industry: user.industry },
            });
        }

        // Calculate skill match if we have insights
        let skillMatch = 0;
        let missingSkills = [];
        let matchedSkills = [];

        if (industryInsights && user.skills?.length > 0) {
            const topSkills = industryInsights.topSkills || [];
            const emergingSkills = industryInsights.emergingSkills || [];
            const allDesiredSkills = [...new Set([...topSkills, ...emergingSkills])];

            matchedSkills = user.skills.filter((skill) =>
                allDesiredSkills.some(
                    (desired) => desired.toLowerCase() === skill.toLowerCase()
                )
            );

            missingSkills = allDesiredSkills.filter(
                (desired) =>
                    !user.skills.some(
                        (skill) => skill.toLowerCase() === desired.toLowerCase()
                    )
            );

            skillMatch = allDesiredSkills.length > 0
                ? Math.round((matchedSkills.length / allDesiredSkills.length) * 100)
                : 0;
        }

        return {
            user: {
                name: user.name,
                industry: user.industry,
                experience: user.experience,
                skills: user.skills,
                targetRoles: user.targetRoles,
            },
            industryInsights,
            skillAnalysis: {
                skillMatch,
                matchedSkills,
                missingSkills: missingSkills.slice(0, 5), // Top 5 missing skills
            },
        };
    } catch (error) {
        console.error("Error getting personalized recommendations:", error);
        throw new Error("Failed to get recommendations");
    }
}
