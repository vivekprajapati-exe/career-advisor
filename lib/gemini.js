import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Use gemini-1.5-flash for cost efficiency (free tier friendly)
export const model = genAI?.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
    },
});

/**
 * Generate AI content with error handling
 * @param {string} prompt - The prompt to send to the AI
 * @returns {Promise<string>} - The generated text
 */
export async function generateAIContent(prompt) {
    if (!model) {
        throw new Error("Gemini AI is not configured. Please set GEMINI_API_KEY.");
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        throw new Error("Failed to generate AI content. Please try again.");
    }
}

/**
 * Generate AI content and parse as JSON
 * @param {string} prompt - The prompt to send to the AI
 * @returns {Promise<Object>} - The parsed JSON response
 */
export async function generateAIJSON(prompt) {
    const text = await generateAIContent(prompt);

    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : text.trim();

    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Failed to parse AI response as JSON:", text);
        throw new Error("Failed to parse AI response. Please try again.");
    }
}
