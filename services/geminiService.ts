import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SlideContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const slideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The headline of the slide." },
    bullets: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3-4 concise bullet points for the slide body." 
    },
    highlight: { type: Type.STRING, description: "A short, punchy key takeaway or statistic." },
    imageKeyword: { type: Type.STRING, description: "A single English word describing the visual theme (e.g. 'laboratory', 'solar', 'china', 'molecule')." },
    notes: { type: Type.STRING, description: "Speaker notes explaining the slide in detail." }
  },
  required: ["title", "bullets", "highlight", "imageKeyword", "notes"]
};

const presentationSchema: Schema = {
  type: Type.ARRAY,
  items: slideSchema
};

export const generateSlides = async (): Promise<SlideContent[]> => {
  const prompt = `
    Create a professional, modern 10-slide presentation about "Green Chemistry's Contribution to Energy Efficiency Design".
    
    The content should cover:
    1. Introduction to Green Chemistry principles relevant to energy.
    2. Designing chemicals for energy efficiency.
    3. Catalysis and energy reduction.
    4. Solvent-free processes.
    5. Renewable feedstocks.
    6. Case Study: Solar or Battery technology advancements via green chemistry.
    7. SPECIFIC SLIDE: China's contribution to Green Chemistry and Energy Efficiency (policies, major research, or industrial shifts).
    8. Industrial applications and scaling.
    9. Future challenges and opportunities.
    10. Conclusion and Call to Action.

    Tone: Academic yet accessible, inspiring, and sustainability-focused.
    Ensure the JSON structure matches the schema exactly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: presentationSchema,
        systemInstruction: "You are a world-class expert in Sustainable Chemistry and Chemical Engineering.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const slides = JSON.parse(text) as SlideContent[];
    return slides;
  } catch (error) {
    console.error("Error generating slides:", error);
    throw error;
  }
};
