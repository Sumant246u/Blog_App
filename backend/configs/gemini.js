import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
const MAX_RETRIES = 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryable = (error) => {
    const message = error?.message || "";
    return message.includes("503") || message.includes("429");
};

async function generateWithModel(model, prompt) {
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    return response.text;
}

async function main(prompt) {
    let lastError;

    for (const model of MODELS) {
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                return await generateWithModel(model, prompt);
            } catch (error) {
                lastError = error;
                if (!isRetryable(error) || attempt === MAX_RETRIES) break;
                await sleep(1500 * (attempt + 1));
            }
        }
    }

    throw lastError;
}

export default main;
