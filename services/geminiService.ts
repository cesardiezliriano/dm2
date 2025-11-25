
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DiagnosisData, FormulatedChallenge, GroundingChunk, Language, FunnelStage, InvolvementLevel } from '../types';
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

// UPDATED: CSO DIGITAL MEDIA & ADTECH BIAS
const BASE_SYSTEM_PROMPT_STRATEGIST = `You are the **Chief Strategy Officer (CSO)** specialized in **Digital Media, Adtech, Measurement, Data Strategy, and Performance**. You are an expert in Richard Rumelt's "Good Strategy, Bad Strategy" framework.

**YOUR GOAL:**
Transform disordered inputs into a structured Strategic Challenge.
You must ALWAYS generate **Three Strategic Angles (A, B, C)** before defining the final Rumelt Kernel.

**PERSPECTIVE (MEDIA + TECH + DATA):**
*   Think in terms of audience addressability, first-party data, tech stack maturity, and measurement frameworks.
*   Avoid generic marketing fluff. Focus on the mechanics of growth via media and tech.

**REQUIRED OUTPUT STRUCTURE:**

1.  **Strategic Alternatives (A/B/C):**
    *   **A: Challenger:** Disruptive, bold, riskier. Changes the rules of the category.
    *   **B: Consultative:** Efficiency-focused, safe, optimization of current assets.
    *   **C: Mixed (Synthesis):** The balanced approach. (Likely the recommended path).

2.  **Analytical Blocks (Context):**
    *   **Cultural Tension:** What is happening in culture/media that creates friction?
    *   **Market Opportunity:** The specific Adtech/Data gap to exploit.
    *   **Consumer Insight:** Deep truth about the user's relationship with the category.

3.  **Rumelt Kernel (Based on the BEST angle, usually C):**
    *   **Diagnosis:** The root cause (Obstacle).
    *   **Guiding Policy:** The strategic approach.

4.  **Validation:**
    *   **Behavioral Justification:** Behavioral economics principle (e.g., Loss Aversion, Social Proof).
    *   **Key Assumptions:** 2-5 hypotheses that must be true.
    *   **Mental Models:** Frameworks used (e.g., Rumelt, Flywheel, Pace Layering).

**ABSOLUTE PROHIBITIONS:**
*   NO TACTICS (No specific banner ideas, influencers, or channel plans).
*   Keep it STRATEGIC.

**Format:**
Return a valid JSON object.`;

const BASE_SYSTEM_PROMPT_BRIEFING_ANALYZER = `You are an expert Strategic Planner and Data Analyst acting as a CSO.
Your task is to analyze the available inputs (Client Name, Contextual Dropdowns, and Optional Files/Notes).
You must DEDUCE the likely Sector, Business Challenge, Customer Challenge, etc.

**Rules:**
*   **Language Priority:** The input documents might be in any language (English, Spanish, Portuguese, etc.). However, you **MUST** translate and output your analysis in the target language requested by the user prompt.
*   **Context is King:** Use the 'Opportunity Type' (Newbiz/Upsell), 'Media Role' (Performance/Brand), and 'Digital Maturity' to infer the likely challenges.
*   **Limited Input?** If the user provides NO text/files, use the 'Client Name' (if it is a known brand) and the dropdowns to hallucinates/infer a *likely* generic scenario for that sector.
*   **Sector/Industry:** Be specific (e.g., "Fintech - Payments" not just "Finance").
*   **Business Challenge:** What is the *company* suffering from? (Revenue, Margin, Churn, Efficiency).
*   **Customer Challenge:** What is the *end-user* suffering from? (Complexity, Cost, Lack of Trust).
*   **Current Strategy:** What have they tried already? (e.g., "Meta Ads with no results").

Return JSON only.`;

const BASE_SYSTEM_PROMPT_PROMPT_GENERATOR = `You are the Chief Strategy Officer (Digital Media & Data).
Based on the formulated Rumelt Strategy, generate 5-7 **Strategic Investigation Avenues** or **Actionable Directions** for the team to explore in the next phase.

**Directives:**
*   These are **NOT** creative campaign ideas.
*   These are "How might we..." strategic pivots or areas of focus.
*   Focus on: Data Strategy, Measurement Frameworks, Adtech Utilization, Audience Addressability, and Media Efficiency.
*   Keep them actionable but high-level (Strategy, not Tactics).

Return a JSON array of strings.`;

const BASE_SYSTEM_PROMPT_HELPER = `You are a helpful Senior Digital Media Strategist assistant. Suggest 3 short, high-quality completions for a strategic brief field, keeping in mind media, data, and audience context. Return a JSON array of strings.`;

// --- UTILITIES ---

const cleanJsonString = (text: string): string => {
  if (!text) return "";
  let cleaned = text;
  cleaned = cleaned.replace(/```json\s*/g, "").replace(/```\s*/g, "");
  return cleaned.trim();
};

// --- API FUNCTIONS ---

// NEW: ANALYZE BRIEFING (PHASE 1 AUTOMATION)
export const analyzeBriefingInputs = async (data: DiagnosisData, lang: Language): Promise<Partial<DiagnosisData>> => {
    const ai = getAiClient();

    // Constructing a prompt that handles missing optional data gracefully
    const userPrompt = `
      **TARGET LANGUAGE FOR OUTPUT:** ${lang === Language.ES ? 'SPANISH (Español)' : 'ENGLISH'}
      
      **Client:** ${data.clientName}
      
      **Strategic Context (Mandatory):**
      - Opportunity Type: ${data.opportunityType || "Unknown"}
      - Media Role: ${data.mediaRole || "Unknown"}
      - Digital Maturity: ${data.digitalMaturity || "Unknown"}
      
      **Optional Inputs:**
      - Manual Notes: ${data.manualBriefingText ? data.manualBriefingText : "Not provided"}
      - File Name: ${data.briefingFileName ? data.briefingFileName : "Not provided"}
      - File Content (Snippet): ${data.briefingFileContent ? data.briefingFileContent.substring(0, 8000) : "Not available (or non-text file)"}

      **Task:** 
      1. Analyze all inputs above. The "File Content" or "Manual Notes" may be in English, Spanish, or another language.
      2. **CRITICAL:** Interpret the information and output the extracted JSON fields **STRICTLY IN ${lang === Language.ES ? 'SPANISH' : 'ENGLISH'}**, regardless of the original document language.
      3. Deduce the likely Sector, Market, Product, Business Challenge, Customer Challenge, Customer Type, and Consumer Context.
      4. Try to identify if they have mentioned any CURRENT EFFORTS or previous failed attempts.
      5. If inputs are sparse, provide a "best guess" typical for a client in this sector with this digital maturity.
    `;

    const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            sector: { type: Type.STRING },
            market: { type: Type.STRING },
            productOrService: { type: Type.STRING },
            customerType: { type: Type.STRING },
            businessChallenge: { type: Type.STRING, description: "The problem the business is facing (e.g., churn, low efficiency)." },
            customerChallenge: { type: Type.STRING, description: "The problem the user is facing." },
            currentStrategyAttempt: { type: Type.STRING, description: "What has the client tried so far? (e.g., 'Google Ads with high CPA'). If unknown, leave empty." },
            consumerContext: {
                type: Type.OBJECT,
                properties: {
                    involvement: { type: Type.STRING, enum: [InvolvementLevel.LOW, InvolvementLevel.MEDIUM, InvolvementLevel.HIGH] },
                    funnelStage: { type: Type.STRING, enum: [FunnelStage.AWARENESS, FunnelStage.CONSIDERATION, FunnelStage.DECISION, FunnelStage.LOYALTY, FunnelStage.RETENTION, FunnelStage.ADVOCACY] },
                    barriers: { type: Type.STRING }
                }
            }
        },
        required: ["sector", "businessChallenge", "customerChallenge"]
    };

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL_TEXT,
            contents: userPrompt,
            config: {
                systemInstruction: BASE_SYSTEM_PROMPT_BRIEFING_ANALYZER,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonStr = cleanJsonString(response.text || "{}");
        const result = JSON.parse(jsonStr);
        
        // Map result back to DiagnosisData structure
        return {
            sector: result.sector,
            market: result.market,
            productOrService: result.productOrService,
            customerType: result.customerType,
            businessChallenge: result.businessChallenge,
            customerChallenge: result.customerChallenge,
            currentStrategyAttempt: result.currentStrategyAttempt, // Added extraction
            consumerContext: {
                involvement: result.consumerContext?.involvement as InvolvementLevel,
                funnelStage: result.consumerContext?.funnelStage as FunnelStage,
                barriers: result.consumerContext?.barriers
            }
        };

    } catch (error) {
        console.error("Error analyzing briefing:", error);
        throw error;
    }
};

export const generateChallengeFormulation = async (data: DiagnosisData, lang: Language): Promise<{ formulation: FormulatedChallenge, groundingChunks?: GroundingChunk[] }> => {
  const ai = getAiClient();

  const userTextPrompt = `
    **Context:**
    - Target Language: ${lang === Language.ES ? 'SPANISH' : 'ENGLISH'}
    - Client: ${data.clientName}
    - Opportunity Type: ${data.opportunityType}
    - Media Role: ${data.mediaRole}
    - Digital Maturity: ${data.digitalMaturity}
    
    **Analysis Inputs:**
    - Sector: ${data.sector}
    - Business Challenge: ${data.businessChallenge}
    - Customer Challenge: ${data.customerChallenge}
    - Consumer Barriers: ${data.consumerContext.barriers}
    - Previous/Current Efforts: ${data.currentStrategyAttempt}
    
    **Raw Content (Reference):**
    - Briefing/Notes: ${data.manualBriefingText || ""} ${data.briefingFileContent ? "(See file)" : ""}

    **Task:**
    As the CSO (Digital Media & Adtech), provide the **3 Strategic Angles (A, B, C)** and then the **Rumelt Kernel** for the recommended path.
    Focus on Data, Tech, and Media Efficiency. 
    NO TACTICS.
    
    **CRITICAL:** The output MUST be in ${lang === Language.ES ? 'SPANISH' : 'ENGLISH'}.
    
    RETURN JSON ONLY.
  `;

  const contents: any = { parts: [{ text: userTextPrompt }] };

  if (data.briefingFileContent) {
      contents.parts.push({ text: `Briefing Content: ${data.briefingFileContent.substring(0, 10000)}` });
  }

  // Add Screenshots if available (Multimodal)
  if (data.screenshots && data.screenshots.length > 0) {
      data.screenshots.forEach(screenshot => {
          contents.parts.push({
              inlineData: {
                  mimeType: screenshot.mimeType,
                  data: screenshot.data 
              }
          });
      });
  }

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      strategicAlternativeA: { type: Type.STRING, description: "Option A: Challenger / Disruptive Approach. Bold change." },
      strategicAlternativeB: { type: Type.STRING, description: "Option B: Consultative / Efficiency Approach. Optimization focused." },
      strategicAlternativeC: { type: Type.STRING, description: "Option C: Mixed / Synthesis. Balanced approach." },
      culturalTension: { type: Type.STRING, description: "A significant cultural shift, media trend, or paradox relevant to the user's context." },
      marketOpportunity: { type: Type.STRING, description: "A specific, actionable market or media opportunity (Adtech/Data/Performance)." },
      consumerInsight: { type: Type.STRING, description: "A deep, non-obvious understanding of the target consumer's motivations and media behaviors." },
      rumeltDiagnosis: { type: Type.STRING, description: "The critical challenge (Root Cause) of the recommended strategy (usually Option C)." },
      rumeltGuidingPolicy: { type: Type.STRING, description: "The overall strategic approach to overcome the diagnosed challenge. High-level direction, not tactics." },
      behavioralJustification: { type: Type.STRING, description: "A core principle from human psychology/behavioral economics explaining WHY this policy works." },
      keyAssumptions: { type: Type.STRING, description: "2-5 critical assumptions underpinning the strategy." },
      relevantMentalModels: { type: Type.STRING, description: "Relevant strategic frameworks (e.g., Rumelt, Leverage points) used." },
    },
    required: ["strategicAlternativeA", "strategicAlternativeB", "strategicAlternativeC", "culturalTension", "marketOpportunity", "consumerInsight", "rumeltDiagnosis", "rumeltGuidingPolicy", "behavioralJustification", "keyAssumptions", "relevantMentalModels"],
  };

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: contents,
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
        const parsed = JSON.parse(jsonStr);
        // Ensure default selection is C if new generation occurs
        formulation = { ...parsed, selectedAlternative: 'C' } as FormulatedChallenge;
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
    - Target Language: ${lang === Language.ES ? 'SPANISH' : 'ENGLISH'}
    - Rumelt's Diagnosis: ${challenge.rumeltDiagnosis}
    - Rumelt's Guiding Policy: ${challenge.rumeltGuidingPolicy}
    - Behavioral Justification: ${challenge.behavioralJustification}

    Generate 5-7 Strategic Investigation Avenues (Not creative tactics) for the team to explore regarding Data, Media, and Technology.
    Output MUST be in ${lang === Language.ES ? 'SPANISH' : 'ENGLISH'}.
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
    - Target Language: ${lang === Language.ES ? 'SPANISH' : 'ENGLISH'}
    - Client: ${context.clientName || "Unknown"}
    - Sector: ${context.sector || "Unknown"}
    
    Field: "${fieldLabel}"
    Current input: "${currentValue}"
    
    Provide 3 suggestions from a Digital Media & Adtech Strategy perspective in ${lang === Language.ES ? 'SPANISH' : 'ENGLISH'}.
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
