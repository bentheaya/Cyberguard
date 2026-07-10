import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, PhishingEmail } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to strip Markdown code blocks if present
const cleanJson = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
};

export const generateQuizQuestions = async (topic: string, count: number = 5): Promise<QuizQuestion[]> => {
  if (!apiKey) {
    console.warn("No API Key provided, returning fallback questions.");
    return fallbackQuestions;
  }

  try {
    const prompt = `Generate ${count} multiple-choice cybersecurity quiz questions about ${topic}.
    Ensure the questions are challenging but educational for general users.
    Return JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER, description: "Zero-based index of the correct option" },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const json = cleanJson(text);
    return JSON.parse(json) as QuizQuestion[];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return fallbackQuestions;
  }
};

export const generatePhishingEmail = async (): Promise<PhishingEmail | null> => {
  if (!apiKey) return null;

  try {
    // Randomly decide if it's phishing (60% chance) or legit (40% chance) for variety
    const isPhishing = Math.random() < 0.6;
    const typePrompt = isPhishing 
      ? "a SOPHISTICATED phishing email. It should have subtle red flags (e.g. slight urgency, mismatched domain, generic greeting) but look convincing." 
      : "a LEGITIMATE email from a known service or workplace context. It should not have red flags.";

    const prompt = `Generate ${typePrompt}
    Contexts to choose from: Banking, HR, Social Media, Package Delivery, IT Support.
    Return JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sender: { type: Type.STRING },
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
            isPhishing: { type: Type.BOOLEAN },
            indicators: { 
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of red flags if phishing, or empty list if legitimate"
            }
          },
          required: ["sender", "subject", "body", "isPhishing", "indicators"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    const json = cleanJson(text);
    const result = JSON.parse(json);
    return {
      id: Date.now(),
      ...result
    } as PhishingEmail;

  } catch (error) {
    console.error("Gemini Phishing Gen Error:", error);
    return null;
  }
};

export const getSecurityExplanation = async (term: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure your environment.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the cybersecurity concept "${term}" simply and concisely in one paragraph.`,
    });
    return response.text || "No explanation available.";
  } catch (error) {
    console.error(error);
    return "Error fetching explanation.";
  }
};

const fallbackQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is Phishing?",
    options: ["A sport", "A fraudulent attempt to obtain sensitive information", "A firewall setting", "A virus type"],
    correctAnswer: 1,
    explanation: "Phishing is a cybercrime in which a target or targets are contacted by email, telephone or text message by someone posing as a legitimate institution."
  },
  {
    id: 2,
    question: "Which password is strongest?",
    options: ["password123", "MyNameIsJohn", "Tr0ub4dor&3", "12345678"],
    correctAnswer: 2,
    explanation: "Strong passwords combine upper/lowercase letters, numbers, and symbols, and are not easily guessable phrases."
  }
];