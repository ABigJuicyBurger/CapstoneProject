import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const analyzeResume = async (jobDescription: string, resumeText: string) => {
    try {
        const response = await axios.post(
            `${backendURL}/resumeAI`,
            {
                jobDescription,
                resumeText
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error analyzing resume:', error);
        throw error;
    }
};

export default analyzeResume