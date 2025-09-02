
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DiagnosisData, FormulatedChallenge, GroundingChunk, Language, UIStringKeys } from '../types';
import { GEMINI_MODEL_TEXT, getText } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not found. Please set it up to use the Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); 

const BASE_SYSTEM_PROMPT_STRATEGIST = `You are an expert Chief Strategy Officer and strategic planner, strictly adhering to the principles outlined in Richard Rumelt's "Good Strategy, Bad Strategy". You are also an expert in human psychology and behavioral economics. Your primary function is to help users dissect complex business situations to formulate a clear, actionable strategic challenge based on Rumelt's "Kernel" and ground it in human behavior.

You must analyze the provided data on client, budget, briefing, customer type, market, sector, product/service, core problem, consumer context, and current efforts.

Your response MUST be a JSON object with the following keys: "culturalTension", "marketOpportunity", "consumerInsight", "rumeltDiagnosis", "rumeltGuidingPolicy", "behavioralJustification", "keyAssumptions", "relevantMentalModels".

Here's how to approach each field:

1.  **rumeltDiagnosis (String):** This is the most crucial part of Rumelt's Kernel.
    *   Identify the **single, critical challenge** the organization faces. What is the pivotal problem that needs to be solved?
    *   Simplify the complexity of the situation into this core issue. Avoid listing multiple problems; find the linchpin.
    *   This is NOT a goal (e.g., "Increase sales by 20%"). It's an explanation of the obstacle (e.g., "Our main challenge is the fragmentation of our service delivery, which prevents us from leveraging our core capabilities to meet customer demand for holistic solutions.").

2.  **rumeltGuidingPolicy (String):** This is the second part of Rumelt's Kernel.
    *   Define the **overall approach** to deal with the \`rumeltDiagnosis\`.
    *   It's a broad strategic direction that guides actions, not a list of detailed steps.
    *   It should be a clear, focused response to the diagnosed challenge. (e.g., "Our guiding policy will be to centralize service development and create integrated solution packages, re-training our sales force to communicate this unified value proposition.")

3.  **behavioralJustification (String):** This is critical. Based on your \`rumeltGuidingPolicy\`, identify and explain a core principle from human psychology or behavioral economics that explains WHY this policy is likely to succeed. This provides the 'human-centric' rationale.
    *   **Examples of principles:** Robert Zajonc's 'mere-exposure effect' (familiarity breeds preference), Social Proof (people follow the actions of others), Loss Aversion (people are more motivated to avoid a loss than to gain something), Scarcity, Anchoring, Choice Architecture, etc.
    *   **Example explanation:** "The policy of repeated, consistent messaging across multiple low-cost channels leverages Robert Zajonc's 'mere-exposure effect'. By increasing brand familiarity in a non-intrusive way, we build subconscious trust and preference, making our brand a more intuitive choice at the point of decision."

4.  **culturalTension (String):** Describe a significant cultural shift or paradox relevant to the user's context that *informs or exacerbates* the \`rumeltDiagnosis\`. (e.g., "Growing consumer demand for ethical supply chains clashes with the traditionally opaque nature of our industry.")

5.  **marketOpportunity (String):** Pinpoint a specific, actionable market opportunity, possibly underserved or emerging, that is relevant to the \`rumeltDiagnosis\` and could be leveraged by the \`rumeltGuidingPolicy\`. (e.g., "An emerging niche of B2B clients is actively seeking 'turnkey' integrated solutions, a segment underserved by competitors focused on piecemeal offerings.")

6.  **consumerInsight (String):** Articulate a deep, non-obvious understanding of the target consumer's motivations, pain points, or desires related to the problem space defined in \`rumeltDiagnosis\`. (e.g., "Target customers are overwhelmed by managing multiple vendors and express a desire for a single, trusted partner who can simplify their operations, even at a slightly higher initial cost.")

7.  **keyAssumptions (String):** List 2-3 critical assumptions underpinning your strategy. If these are false, the strategy might be invalid. (e.g., "1. We assume customers will value integration over lowest-cost individual components. 2. We assume we can effectively re-train our workforce within 6 months.")

8.  **relevantMentalModels (String):** Briefly mention 1-2 relevant strategic frameworks. Prioritize **Rumelt's Sources of Strategic Power** (e.g., Leverage, Focus, Chain-Link Systems) if applicable. Explain briefly *how* it's relevant. (e.g., "The Guiding Policy aims to 'Leverage' our underutilized R&D capabilities. We will also apply a 'Focus' strategy on the identified underserved niche.")

**IMPORTANT - Adherence to Principles:**
*   **Avoid Bad Strategy Traps:** Do NOT output fluff, vague statements, or goals masquerading as strategy.
*   **Coherence:** Ensure the Diagnosis, Guiding Policy, Behavioral Justification, and supporting insights are logically connected.
*   **Action-Oriented:** The Guiding Policy should clearly suggest a path for action.
*   **Conciseness & Profundity:** Be brief but insightful.`;

const BASE_SYSTEM_PROMPT_PROMPT_GENERATOR = `You are an expert prompt engineer and creative strategist, guided by Richard Rumelt's "Good Strategy, Bad Strategy". Your task is to generate insightful and actionable prompts based on a formulated strategic challenge, specifically its \`rumeltDiagnosis\` and \`rumeltGuidingPolicy\`. These prompts are intended to spark ideation for "Coherent Actions" – the third part of Rumelt's Kernel – which could be marketing campaigns, new product features, service innovations, or compelling messaging.

The input will be a JSON object containing \`rumeltDiagnosis\` and \`rumeltGuidingPolicy\`, among other fields. Your focus is on these two.

The prompts you generate should:
1.  **Directly address the \`rumeltDiagnosis\`:** How can the organization overcome this specific challenge?
2.  **Operationalize the \`rumeltGuidingPolicy\`:** How can this general approach be translated into concrete steps or initiatives?
3.  **Lead to Coherent Actions:** Encourage ideas that are aligned with each other and the guiding policy, avoiding contradictions.
4.  **Be Open-ended yet Focused:** Allow for creative solutions while staying within the strategic boundaries set by the diagnosis and guiding policy.
5.  **Action-Oriented:** Use phrasing like "How might we...", "What specific steps could we take to...", "Design a [campaign/feature/service] that embodies [aspect of Guiding Policy] to solve [part of Diagnosis]...".
6.  **Diverse:** Explore different angles and types of actions.
7.  **Thought-Provoking & Stimulating:** Encourage deep thinking.
8.  **Consider \`keyAssumptions\` and \`relevantMentalModels\` (if provided):** Prompts could explore ways to test key assumptions or apply the mentioned mental models/sources of power. For example, "How can we test the assumption that [key assumption] while pursuing [Guiding Policy]?" or "In what ways can we apply [Rumelt's Source of Power, e.g., 'Leverage'] to execute our [Guiding Policy] more effectively?"

Your response MUST be a JSON array of 3-5 unique string prompts. Each prompt should be a clear, concise question or instruction.

Avoid generic prompts. They must be tailored to the provided \`rumeltDiagnosis\` and \`rumeltGuidingPolicy\`.`;


const getLanguageInstruction = (lang: Language, outputType: 'json_object' | 'json_array_of_strings'): string => {
  const languageName = lang === Language.ES ? "español" : "English";
  if (outputType === 'json_object') {
    return lang === Language.ES 
      ? `IMPORTANTE: Tu respuesta COMPLETA, incluyendo todas las claves y valores de cadena en la salida JSON, DEBE estar en ${languageName}.`
      : `IMPORTANT: Your entire response, including all keys and string values in the JSON output, MUST be in ${languageName}.`;
  }
  // json_array_of_strings
  return lang === Language.ES
    ? `IMPORTANTE: Tu respuesta COMPLETA, que es un array JSON de cadenas de texto, DEBE estar en ${languageName}. Cada cadena de texto en el array debe estar en ${languageName}.`
    : `IMPORTANT: Your entire response, which is a JSON array of strings, MUST be in ${languageName}. Each string in the array must be in ${languageName}.`;
};


const parseJsonFromMarkdown = <T,>(markdownJson: string): T | null => {
  let jsonStr = markdownJson.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original string:", markdownJson);
    throw new Error(`Invalid JSON response: ${ (e as Error).message }. Original text: ${markdownJson.substring(0, 500)}`);
  }
};

export const generateChallengeFormulation = async (
  diagnosis: DiagnosisData,
  lang: Language
): Promise<{ formulation: FormulatedChallenge; groundingChunks?: GroundingChunk[] }> => {
  try {
    const model = ai.models;
    const languageInstruction = getLanguageInstruction(lang, 'json_object');
    const systemPromptStrategist = `${BASE_SYSTEM_PROMPT_STRATEGIST}\n\n${languageInstruction}`;

    const response: GenerateContentResponse = await model.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: [
        { role: "user", parts: [{ text: `Here is the diagnosis data: ${JSON.stringify(diagnosis, null, 2)} Please formulate the strategic challenge kernel (Diagnosis and Guiding Policy) based on this, following Rumelt's principles.` }] }
      ],
      config: {
        systemInstruction: systemPromptStrategist,
        responseMimeType: "application/json",
      },
    });

    const formulation = parseJsonFromMarkdown<FormulatedChallenge>(response.text);
    if (!formulation) {
        throw new Error(getText(lang, UIStringKeys.ErrorGeneric) + " (Could not parse challenge formulation from Gemini response.)");
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    return { formulation, groundingChunks };

  } catch (error) {
    console.error("Error generating challenge formulation:", error);
    if (error instanceof Error && error.message.startsWith("Invalid JSON response")) {
        throw error;
    }
    throw new Error(getText(lang, UIStringKeys.ErrorGeneric) + (error instanceof Error ? `: ${error.message}` : ''));
  }
};

export const generateSmartPrompts = async (
  challenge: FormulatedChallenge,
  lang: Language
): Promise<{ prompts: string[]; groundingChunks?: GroundingChunk[] }> => {
  try {
    const model = ai.models;
    const languageInstruction = getLanguageInstruction(lang, 'json_array_of_strings');
    const systemPromptPromptGenerator = `${BASE_SYSTEM_PROMPT_PROMPT_GENERATOR}\n\n${languageInstruction}`;
    
    const response: GenerateContentResponse = await model.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: [
        { role: "user", parts: [{ text: `Here is the formulated strategic challenge kernel (Rumelt's Diagnosis and Guiding Policy): ${JSON.stringify(challenge, null, 2)} Please generate smart prompts for Coherent Actions based on this.` }] }
      ],
      config: {
        systemInstruction: systemPromptPromptGenerator,
        responseMimeType: "application/json",
      },
    });

    const prompts = parseJsonFromMarkdown<string[]>(response.text);
    if (!prompts || !Array.isArray(prompts)) {
        throw new Error(getText(lang, UIStringKeys.ErrorGeneric) + " (Could not parse prompts from Gemini response or it's not an array.)");
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    
    return { prompts, groundingChunks };

  } catch (error) {
    console.error("Error generating smart prompts:", error);
     if (error instanceof Error && error.message.startsWith("Invalid JSON response")) {
        throw error;
    }
    throw new Error(getText(lang, UIStringKeys.ErrorGeneric) + (error instanceof Error ? `: ${error.message}` : ''));
  }
};

export const suggestContextualItem = async (
  fieldType: string,
  currentValue: string,
  context: Partial<DiagnosisData>,
  lang: Language
): Promise<string[]> => {
  try {
    const model = ai.models;
    const languageInstruction = getLanguageInstruction(lang, 'json_array_of_strings');
    const prompt = `Given the current context: ${JSON.stringify(context)}, and the user is trying to define "${fieldType}" and has typed "${currentValue}", suggest 3-5 improved or alternative phrases. Focus on clarity and strategic relevance according to Rumelt's principles (e.g., for a diagnosis, ensure it's a specific challenge, not a goal). Output as a JSON array of strings.\n\n${languageInstruction}`;
    const response: GenerateContentResponse = await model.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    const suggestions = parseJsonFromMarkdown<string[]>(response.text);
    return suggestions || [];
  } catch (error) {
    console.error(`Error suggesting ${fieldType}:`, error);
    return []; 
  }
};