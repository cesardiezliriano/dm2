
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DiagnosisData, FormulatedChallenge, GroundingChunk, Language } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing in process.env.API_KEY");
    throw new Error("API Key not found. Please ensure it is configured correctly in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

// --- PERSONAS & SYSTEM PROMPTS ---

// REINFORCED MEDIA PLANNER BIAS
const BASE_SYSTEM_PROMPT_STRATEGIST = `You are an elite **Strategic Media Planner** and strategist. You combine the rigorous strategy framework of Richard Rumelt ("Good Strategy, Bad Strategy") with the sharp, audience-centric focus of a top-tier media agency planner.

Your goal is to formulate a "Strategic Challenge Kernel" that identifies critical bottlenecks in consumer attention, media behavior, and brand connection, and proposes a guiding policy to overcome them.

**Your Lens (The Media Planner Bias):**
*   **Attention & Relevance:** Focus on why the audience isn't paying attention or why the brand isn't relevant in their life context.
*   **Touchpoints:** Think about where the consumer actually exists (digital ecosystems, physical spaces) and the frictions there.
*   **Behavioral Triggers:** Use psychology to understand *why* they act (or don't act) in specific channels.
*   **Cultural Context:** Use your knowledge to identify trends in culture and media consumption that impact the brand.

**Differentiation & Business Fit:**
*   **Adaptability:** The strategy must be tailored to the specific business constraints and budget provided. Do not offer generic "big brand" advice for a small budget, or vice versa.
*   **Differentiation:** Avoid standard category tropes. Find the "unobvious" angle. If everyone is doing X, propose why Y is the smarter media play.

**The Rumelt Framework:**
1.  **Diagnosis:** The specific challenge. Not just "low sales", but "fragmented attention in a saturated category".
2.  **Guiding Policy:** The approach. How do we navigate the media landscape to solve the diagnosis?

**Format:**
You must return a valid JSON object matching the requested schema.`;

const BASE_SYSTEM_PROMPT_PROMPT_GENERATOR = `You are an expert Creative Media Planner. Generate 5-7 smart, actionable ideation prompts for a media and creative campaign based on the provided strategy.
Focus on channel innovation, message distinctiveness, and behavioral triggers.
Return a JSON array of strings.`;

const BASE_SYSTEM_PROMPT_HELPER = `You are a helpful Strategic Media Planner assistant. Suggest 3 short, high-quality completions for a strategic brief field, keeping in mind media and audience context. Return a JSON array of strings.`;

// --- UTILITIES ---

/**
 * Cleans JSON string to extract JSON content.
 * Robustly handles markdown code blocks and extra text.
 */
const cleanJsonString = (text: string): string => {
  if (!text) return "";
  let cleaned = text;
  // Remove markdown code blocks
  cleaned = cleaned.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  return cleaned.trim();
};

// --- API FUNCTIONS ---

export const generateChallengeFormulation = async (data: DiagnosisData, lang: Language): Promise<{ formulation: FormulatedChallenge, groundingChunks?: GroundingChunk[] }> => {
  const ai = getAiClient();

  // Construct text prompt
  const userTextPrompt = `
    **Context:**
    - Language: ${lang}
    - Client: ${data.clientName}
    - Project Budget: ${data.projectBudget || "Not defined"}
    - Briefing PDF Content: ${data.briefingFileContent ? data.briefingFileContent.substring(0, 4000) + "..." : "Not provided"}
    - Manual Briefing/Notes: ${data.manualBriefingText || "Not provided"}
    - Customer Type: ${data.customerType}
    - Market/Category: ${data.market}
    - Sector: ${data.sector}
    - Product/Service: ${data.productOrService}
    - Business Challenge: ${data.businessChallenge}
    - Customer Challenge: ${data.customerChallenge}
    - Consumer Context: Involvement (${data.consumerContext.involvement}), Funnel Stage (${data.consumerContext.funnelStage}), Barriers (${data.consumerContext.barriers})
    - Current Strategy: ${data.currentStrategyAttempt}

    **Task:**
    As a Strategic Media Planner, analyze the text and any provided images to formulate the Rumelt Strategic Challenge Kernel.
    
    RETURN JSON ONLY.
  `;

  const contents: any = { parts: [{ text: userTextPrompt }] };

  // Add Screenshots if available (Multimodal)
  if (data.screenshots && data.screenshots.length > 0) {
      data.screenshots.forEach(screenshot => {
          contents.parts.push({
              inlineData: {
                  mimeType: screenshot.mimeType,
                  data: screenshot.data // Expecting raw base64 here
              }
          });
      });
  }

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      culturalTension: { type: Type.STRING, description: "A significant cultural shift, media trend, or paradox relevant to the user's context." },
      marketOpportunity: { type: Type.STRING, description: "A specific, actionable market or media opportunity." },
      consumerInsight: { type: Type.STRING, description: "A deep, non-obvious understanding of the target consumer's motivations and media behaviors." },
      rumeltDiagnosis: { type: Type.STRING, description: "The critical challenge at the intersection of business/customer problems. The 'What's holding us back' from a media/attention perspective." },
      rumeltGuidingPolicy: { type: Type.STRING, description: "The overall strategic approach to overcome the diagnosed challenge. The 'How we will overcome it' using channels and messaging." },
      behavioralJustification: { type: Type.STRING, description: "A core principle from human psychology explaining WHY this policy works." },
      keyAssumptions: { type: Type.STRING, description: "2-3 critical assumptions underpinning the strategy." },
      relevantMentalModels: { type: Type.STRING, description: "Relevant strategic frameworks or Rumelt's sources of power." },
    },
    required: ["culturalTension", "marketOpportunity", "consumerInsight", "rumeltDiagnosis", "rumeltGuidingPolicy", "behavioralJustification"],
  };

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: contents, // Sending multimodal parts
      config: {
        systemInstruction: BASE_SYSTEM_PROMPT_STRATEGIST,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const responseText = response.text || "";
    const jsonStr = cleanJsonString(responseText);
    
    let formulation: FormulatedChallenge;
    try {
        formulation = JSON.parse(jsonStr) as FormulatedChallenge;
    } catch (e) {
        console.error("JSON Parsing failed", e);
        throw new Error("Failed to parse AI response. Please try again.");
    }

    return { formulation, groundingChunks: [] };

  } catch (error) {
    console.error("[generateChallengeFormulation] API Error:", error);
    throw error;
  }
};

export const generateSmartPrompts = async (
  challenge: FormulatedChallenge, 
  diagnosis: DiagnosisData,
  lang: Language
): Promise<{ prompts: string[], groundingChunks?: GroundingChunk[] }> => {
  const ai = getAiClient();

  const userPrompt = `
    Context:
    - Language: ${lang}
    - Project Budget: ${diagnosis.projectBudget || "Not defined"}
    - Rumelt's Diagnosis: ${challenge.rumeltDiagnosis}
    - Rumelt's Guiding Policy: ${challenge.rumeltGuidingPolicy}
    - Behavioral Justification: ${challenge.behavioralJustification}

    Generate 5-7 smart, actionable ideation prompts for Coherent Actions (Media, Creative, Touchpoints).
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: userPrompt,
      config: {
        systemInstruction: BASE_SYSTEM_PROMPT_PROMPT_GENERATOR,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });

    const responseText = response.text || "[]";
    const jsonStr = cleanJsonString(responseText);

    let prompts: string[] = [];
    try {
        prompts = JSON.parse(jsonStr) as string[];
    } catch (e) {
        console.error("Failed to parse JSON response", responseText);
        prompts = [];
    }
    
    return { prompts, groundingChunks: undefined };

  } catch (error) {
    console.error("[generateSmartPrompts] API Error:", error);
    throw error;
  }
};

export const suggestContextualItem = async (
  fieldLabel: string,
  currentValue: string,
  context: Partial<DiagnosisData>,
  lang: Language
): Promise<string[]> => {
  const ai = getAiClient();

  const userPrompt = `
    Context:
    - Language: ${lang}
    - Client: ${context.clientName || "Unknown"}
    - Sector: ${context.sector || "Unknown"}
    
    Field: "${fieldLabel}"
    Current input: "${currentValue}"
    
    Provide 3 suggestions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: userPrompt,
      config: {
        systemInstruction: BASE_SYSTEM_PROMPT_HELPER,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });

    const responseText = response.text || "[]";
    const jsonStr = cleanJsonString(responseText);

    try {
      return JSON.parse(jsonStr) as string[];
    } catch (e) {
      console.error("Failed to parse suggestions JSON", e);
      return [];
    }
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return [];
  }
};
