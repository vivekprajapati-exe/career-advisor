import { inngest } from "./client";
import { db } from "@/lib/prisma";
import { generateAIJSON } from "@/lib/gemini";

// Weekly Industry Update - Runs every Monday at 9 AM IST
export const weeklyIndustryUpdate = inngest.createFunction(
    { id: "weekly-industry-update", name: "Weekly Industry Update" },
    { cron: "TZ=Asia/Kolkata 0 9 * * 1" },
    async ({ step }) => {
        // Step 1: Get all unique industries from users
        const industries = await step.run("get-industries", async () => {
            const users = await db.user.findMany({
                where: { industry: { not: null } },
                select: { industry: true },
                distinct: ["industry"],
            });
            return users.map((u) => u.industry).filter(Boolean);
        });

        // Step 2: Update each industry's insights
        for (const industry of industries) {
            await step.run(`update-${industry}`, async () => {
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
                    const insights = await generateAIJSON(prompt);

                    const nextUpdate = new Date();
                    nextUpdate.setDate(nextUpdate.getDate() + 7);

                    await db.industryInsight.upsert({
                        where: { industry },
                        update: {
                            ...insights,
                            lastUpdated: new Date(),
                            nextUpdate,
                        },
                        create: {
                            industry,
                            ...insights,
                            nextUpdate,
                        },
                    });
                } catch (error) {
                    console.error(`Failed to update insights for ${industry}:`, error);
                }
            });
        }

        return { updated: industries.length };
    }
);

// Keep Supabase Alive - Daily ping to prevent database pause
export const keepDatabaseAlive = inngest.createFunction(
    { id: "keep-database-alive", name: "Keep Database Alive" },
    { cron: "0 12 * * *" }, // Daily at noon UTC
    async ({ step }) => {
        await step.run("ping-database", async () => {
            const count = await db.user.count();
            return { userCount: count, timestamp: new Date().toISOString() };
        });
    }
);

// Generate Industry Insights on User Onboarding
export const generateUserIndustryInsights = inngest.createFunction(
    { id: "generate-user-industry-insights", name: "Generate User Industry Insights" },
    { event: "user/onboarding.completed" },
    async ({ event, step }) => {
        const { userId, industry } = event.data;

        // Check if insights already exist for this industry
        const existingInsights = await step.run("check-existing", async () => {
            return await db.industryInsight.findUnique({
                where: { industry },
            });
        });

        if (existingInsights) {
            return { status: "existing", industry };
        }

        // Generate new insights
        await step.run("generate-insights", async () => {
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

            const insights = await generateAIJSON(prompt);

            const nextUpdate = new Date();
            nextUpdate.setDate(nextUpdate.getDate() + 7);

            await db.industryInsight.create({
                data: {
                    industry,
                    ...insights,
                    nextUpdate,
                },
            });
        });

        return { status: "created", industry };
    }
);
