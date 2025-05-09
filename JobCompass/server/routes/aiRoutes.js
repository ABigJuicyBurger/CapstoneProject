import express from 'express'
import {GoogleGenAI} from '@google/genai';
import pdf from 'pdf-parse';
import dotenv from 'dotenv';
import path from 'path';
import fs from "fs";

dotenv.config();


const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  
async function extractTextFromPDF(filePath) {
    try {
        const pdfFile = fs.readFileSync(filePath);
        const data = await pdf(pdfFile);

        const cleanedText = data.text
        .replace(/\r\n/g, '\n')      // Normalize line breaks
        .replace(/\n\s*\n/g, '\n')   // Remove extra blank lines
        .replace(/\s+/g, ' ')       // Normalize whitespace
        .trim();                    // Remove leading/trailing whitespace

        return cleanedText;
    } catch (error) {
        console.error("Could not read resume!", error);
        throw error;
    }
}

router.post("/", async (req, res) => {
    try {
        const {jobDescription, resumePath} = req.body;

        const fullPath = path.join(__dirname, "../../uploads", resumePath);

        const resumeText = await extractTextFromPDF(fullPath);

        const prompt = `Analyze the compatibility between this resume and job description:
    Job Description: ${jobDescription}
    Resume: ${resumeText}`

    const result = await ai.models.generateContent({
       model: 'gemini-2.0-flash', // Using the latest stable modelm
        contents: prompt
    });

    const response = await result.response;

    res.json({
        score: response.text().match(/\d+/)[0],
        analysis: response.text()
    });
    } catch (error) {
        console.error("Error processing resume:", error);
        res.status(500).json({ error: "Failed to process resume" });
    }
})

export default router;