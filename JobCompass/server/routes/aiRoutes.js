import express from 'express'
import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from "fs";

dotenv.config();


const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

function extractTextFromBuffer(buffer) {
    const text = buffer.toString('utf8');
    // This is a simplified version that works for some PDFs
    // For more complex PDFs, you might need to implement more sophisticated parsing
    return text;
}
  
async function extractTextFromPDF(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error (`File not found: ${filePath}`)
        }
        
        const pdfFile = fs.readFileSync(filePath);
        const text = await extractTextFromBuffer(pdfFile);


        const cleanedText = text
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



// Update the route to handle the request correctly
router.post("/", async (req, res) => {
    try {
        const { jobDescription, resumePath } = req.body;

        const {default: pdf} = await import('pdf-parse/lib/pdf-parse.js')

        const absolutePath = path.join(process.cwd(), resumePath);
        console.log('Looking for PDF at path:', absolutePath);

        if (!fs.existsSync(absolutePath)) {
            console.error('PDF file does not exist at path:', absolutePath);
            return res.status(400).json({ error: 'Resume file not found',                 details: `File not found at: ${absolutePath}`
            });
        }

        const dataBuffer = fs.readFileSync(absolutePath);
        const data = await pdf(dataBuffer);
        const resumeText = data.text;

        if (!resumeText) {
            console.error('No text could be extracted from the PDF');
            return res.status(400).json({ error: 'Could not extract text from resume' });
        }

        if (!jobDescription || !resumeText) {
            return res.status(400).json({ 
                error: "Both jobDescription and resumeText are required" 
            });
        }

        const prompt = `Analyze the compatibility between this resume and job description. Provide a clear, structured response with the following sections:

1. **Compatibility Score**: A score from 1-10 based on how well the resume matches the job requirements.

2. **Key Strengths**: 
   - 2-3 bullet points highlighting the best matches between the resume and job description
   - Focus on specific skills and experiences that align well

3. **Areas for Improvement**:
   - 2-3 specific, actionable suggestions for better alignment
   - Focus on missing skills or experiences

4. **Recommended Resume Updates**:
   - Specific changes to make the resume more appealing for this role. DO NOT PROVIDE A RESUME REWRITE.
   - Focus on transferable skills and relevant keywords

Format your response in clear, concise paragraphs with proper spacing between sections. Use bullet points for lists and keep the language professional but approachable.
Job Description: ${jobDescription}
Resume: ${resumeText}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-lite',
            contents: [{
                role: 'user',
                parts: [{
                    text: `You are an expert career advisor. Analyze this job description and resume, then provide structured, actionable advice.

                    # Analysis for [Job Title] Role
                    
                    🔍 Compatibility: [X]/10
                    [Brief 1-2 sentence overview of overall fit]
                    
                    ## ✅ Key Strengths
                    - **Strength 1**: 1-2 sentences explanation
                    - **Strength 2**: 1-2 sentences explanation
                    
                    ## 🎯 Areas for Improvement
                    - **Area 1**: Specific, actionable suggestion
                    - **Area 2**: Specific, actionable suggestion
                    
                    ## 📝 Recommended Updates
                    - **Update 1**: Specific change with reasoning
                    - **Update 2**: Specific change with reasoning
                    
Job Description: ${jobDescription}

Resume: ${resumeText}`
        }]
    }],
    config: {
        systemInstruction: `You are a career coach providing clear, structured resume advice. Follow these rules:
        1. Use exactly the section headers and structure provided
        2. Keep each bullet point concise (1-2 sentences max)
        3. Use **bold** for key terms and section headers
        4. Put each point on a new line
        5. Use emojis consistently for visual separation
        6. Be direct and action-oriented
        7. Focus on the most important 2-3 points per section`
    }
});

        const text = response.text;
        
        // Extract the score (if it exists)
        const scoreMatch = text.match(/(\d+)/);
        const score = scoreMatch ? scoreMatch[0] : 'N/A';

        res.json({
            score: score,
            analysis: text
        });
    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Add this route at the top of your routes file, before the PDF route
// Update the test route to handle the Gemini response correctly
router.post("/test", async (req, res) => {
    try {
        const { jobDescription, resumeText } = req.body;

        if (!jobDescription || !resumeText) {
            return res.status(400).json({ 
                error: "Both jobDescription and resumeText are required" 
            });
        }

        const prompt = `Analyze the compatibility between this resume and job description:
        Job Description: ${jobDescription}
        Resume: ${resumeText}
        
        Provide a compatibility score (1-10) and detailed analysis of strengths and areas for improvement.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are an AI resume advisor. You will be given a resume in text format, and a job title and description and you will provide easy, simple to read advice. Think how you'd present your response in a UX/UI friendly manner in an application that visualizes job postings and allows users to create profiles"
            }
        });

        // Wait for the response and get the text
        const text = response.text;

        
        // Extract the score (if it exists)
        const scoreMatch = text.match(/(\d+)/);
        const score = scoreMatch ? scoreMatch[0] : 'N/A';

        res.json({
            score: score,
            analysis: text
        });
    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;