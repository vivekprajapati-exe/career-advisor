import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
    weeklyIndustryUpdate,
    keepDatabaseAlive,
    generateUserIndustryInsights
} from "@/inngest/functions";

// Create an API route that serves the Inngest endpoint
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        weeklyIndustryUpdate,
        keepDatabaseAlive,
        generateUserIndustryInsights,
    ],
});
