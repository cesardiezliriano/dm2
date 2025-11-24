
import { GoogleGenAI, Type } from "@google/genai";
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

const BASE_SYSTEM_PROMPT_STRATEGIST = `You are an elite **Strategic Media Planner** and strategist. You combine the rigorous strategy framework of Richard Rumelt ("Good Strategy, Bad Strategy") with the sharp, audience-centric focus of a top-tier media agency planner.

Your goal is to formulate a "Strategic Challenge Kernel" that identifies critical bottlenecks in consumer attention, media behavior, and brand connection, and proposes a guiding policy to overcome them.

**Your Lens (The Media Planner Bias):**
*   **Attention & Relevance:** Focus on why the audience isn't paying attention or why the brand isn't relevant in their life context.
*   **Touchpoints:** Think about where the consumer actually exists (digital ecosystems, physical spaces) and the frictions there.
*   **Behavioral Triggers:** Use psychology to understand *why* they act (or don't act) in specific channels.
*   **Cultural Context:** Look for trends in culture and media consumption that impact the brand.

**The Rumelt Framework:**
1.  **Diagnosis:** The specific challenge. Not just "low sales", but "fragmented attention in a saturated category".
2.  **Guiding Policy:** The approach. How do we navigate the media landscape to solve the diagnosis?

**Operational Rules:**
1.  **Use Google Search:** You have access to Google Search. You MUST use it to find REAL, current cultural tensions, market data, and consumer behaviors to support your diagnosis.
2.  **Format:** You MUST organize your response using Markdown headers exactly as requested. Do NOT use JSON for the main text response, as it conflicts with the Search tool.
`;

const BASE_SYSTEM_PROMPT_PROMPT_GENERATOR = `You are an expert Creative Media Planner. Generate 5-7 smart, actionable ideation prompts for a media and creative campaign based on the provided strategy.
Focus on channel innovation, message distinctiveness, and behavioral triggers.
Return a JSON array of strings.`;

const BASE_SYSTEM_PROMPT_HELPER = `You are a helpful Strategic Media Planner assistant. Suggest 3 short, high-quality completions for a strategic brief field, keeping in mind media and audience context. Return a JSON array of strings.`;

// --- UTILITIES ---

/**
 * Robust Helper function to extract sections from Markdown text.
 * Handles various header formats (e.g., ## Header, ### Header, ## **Header**, ## 1. Header)
 */
const extractSection = (text: string, header: string): string => {
  if (!text) return "";
  
  // Escape special regex characters in the header name
  const safeHeader = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Regex Breakdown:
  // #{1,6}         -> Match 1 to 6 hashes (##, ###, etc.)
  // \s*            -> Match optional whitespace
  // (?:\d+\.?\s*)? -> Non-capturing group for optional numbering (e.g., "1. " or "1 ")
  // \**            -> Match optional bold marker "**" start
  // ${safeHeader}  -> The specific header text
  // \**            -> Match optional bold marker "**" end
  // [:]?           -> Match optional colon ":"
  // .*             -> Match rest of the header line
  // \n             -> Match newline
  // ([\s\S]*?)     -> Capture Group 1: The content (non-greedy)
  // (?=(?:#{1,6}\s|$)) -> Lookahead: Stop before the next header (hash + space) or end of string
  const regex = new RegExp(
    `#{1,6}\\s*(?:\\d+\\.?\\s*)?\\**${safeHeader}\\**[:]?[\\s\\S]*?([\\s\\S]*?)(?=(?:#{1,6}\\s|$))`,
    'i'
  );
  
  const match = text.match(regex);
  return match && match[1] ? match[1].trim() : "";
};

/**
 * Cleans JSON string to extract array.
 * Robustly handles markdown code blocks and extra text.
 */
const cleanJsonArrayString = (text: string): string => {
  if (!text) return "[]";

  // Find the first '[' and last ']'
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');

  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    return text.substring(firstBracket, lastBracket + 1);
  }

  // Fallback: try to strip markdown code blocks if brackets aren't clear
  return text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
};

// --- API FUNCTIONS ---

export const generateChallengeFormulation = async (data: DiagnosisData, lang: Language): Promise<{ formulation: FormulatedChallenge, groundingChunks?: GroundingChunk[] }> => {
  const ai = getAiClient();

  const userPrompt = `
    **Context:**
    - Language: ${lang}
    - Client: ${data.clientName}
    - Project Budget: ${data.projectBudget || "Not defined"}
    - Briefing Content: ${data.briefingFileContent ? data.briefingFileContent.substring(0, 4000) + "..." : "Not provided"}
    - Customer Type: ${data.customerType}
    - Market/Category: ${data.market}
    - Sector: ${data.sector}
    - Product/Service: ${data.productOrService}
    - Business Challenge: ${data.businessChallenge}
    - Customer Challenge: ${data.customerChallenge}
    - Consumer Context: Involvement (${data.consumerContext.involvement}), Funnel Stage (${data.consumerContext.funnelStage}), Barriers (${data.consumerContext.barriers})
    - Current Strategy: ${data.currentStrategyAttempt}

    **Task:**
    As a Strategic Media Planner, use Google Search to validate context and then formulate the Rumelt Strategic Challenge Kernel.
    
    **Output Format (MANDATORY):**
    Please provide the response using Markdown headers (e.g. ## Header Name). Do not use code blocks. Just text under headers.

    ## Cultural Tension
    (Describe a significant cultural shift, media trend, or paradox relevant to the user's context found via search)

    ## Market Opportunity
    (A specific, actionable market or media opportunity found via search)

    ## Consumer Insight
    (A deep, non-obvious understanding of the target consumer's motivations and media behaviors)

    ## Rumelt Diagnosis
    (The critical challenge at the intersection of business/customer problems. The 'What's holding us back' from a media/attention perspective)

    ## Rumelt Guiding Policy
    (The overall strategic approach to overcome the diagnosed challenge. The 'How we will overcome it' using channels and messaging)

    ## Behavioral Justification
    (A core principle from human psychology explaining WHY this policy works)

    ## Key Assumptions
    (2-3 critical assumptions underpinning the strategy)

    ## Relevant Mental Models
    (Relevant strategic frameworks or Rumelt's sources of power)
  `;

  try {
    // STRATEGY:
    // We enable `googleSearch` tool.
    // We DO NOT set `responseMimeType: application/json` or `responseSchema`.
    // This prevents the API error "GoogleSearch tool is not supported with responseSchema".
    // We rely on the `extractSection` regex to parse the structured markdown response.
    
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: userPrompt,
      config: {
        systemInstruction: BASE_SYSTEM_PROMPT_STRATEGIST,
        tools: [{ googleSearch: {} }], 
      }
    });

    const responseText = response.text || "";
    
    // Manual Parsing of the Markdown response
    const formulation: FormulatedChallenge = {
      culturalTension: extractSection(responseText, "Cultural Tension"),
      marketOpportunity: extractSection(responseText, "Market Opportunity"),
      consumerInsight: extractSection(responseText, "Consumer Insight"),
      rumeltDiagnosis: extractSection(responseText, "Rumelt Diagnosis"),
      rumeltGuidingPolicy: extractSection(responseText, "Rumelt Guiding Policy"),
      behavioralJustification: extractSection(responseText, "Behavioral Justification"),
      keyAssumptions: extractSection(responseText, "Key Assumptions"),
      relevantMentalModels: extractSection(responseText, "Relevant Mental Models"),
    };

    // Extract Grounding Metadata (Citations)
    const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Fallback: If parsing completely failed (e.g. model ignored headers), 
    // put the raw text in the diagnosis field so the user at least sees the output.
    if (!formulation.rumeltDiagnosis && !formulation.rumeltGuidingPolicy && responseText.length > 0) {
        console.warn("Markdown parsing failed to find headers. Returning raw text into diagnosis field.");
        formulation.rumeltDiagnosis = responseText; 
    }

    return { formulation, groundingChunks };

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
    // For this function, we do NOT use googleSearch, so we CAN use responseSchema safely.
    // This ensures we get a perfect JSON array every time.
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

    const responseText = response.text;
    if (!responseText) throw new Error("The AI returned an empty response.");

    let prompts: string[] = [];
    try {
        // Clean and parse
        const jsonStr = cleanJsonArrayString(responseText);
        prompts = JSON.parse(jsonStr) as string[];
    } catch (e) {
        console.error("Failed to parse JSON response", responseText);
        // Fallback: if it's just text, wrap it
        prompts = [responseText];
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
    // No search needed for simple suggestions, so we use strict JSON schema.
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

    const responseText = response.text;
    if (!responseText) return [];

    try {
      const jsonStr = cleanJsonArrayString(responseText);
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
