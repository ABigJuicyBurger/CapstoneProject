// server/testAI.js
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize AI with API key
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

async function testAI() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash', // Using the latest stable model
            contents: "How do you work in JS as an AI integrator?",
            config: {
                systemInstruction: "You are an AI tutor for a web developer."
            }
        });

        console.log("AI Response:", response.text);
    } catch (error) {
        console.error("AI Test Error:", error);
    }
}

// Run the test
await testAI();