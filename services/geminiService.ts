import { GoogleGenAI, Type } from "@google/genai";
import { Claim, Reference, AnalysisReport } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the "Grant Auditor"
const AUDITOR_SYSTEM_INSTRUCTION = `
You are GrantAxiom, an elite scientific grant auditor. Your goal is to maximize the user's chance of funding.
You rigorously check claims against provided references.
You are strict, precise, and empirical.
When analyzing, categorize claims as:
- Verified (Green): Fully supported by references.
- Warning (Yellow): Supported but lacks nuance or specific citation.
- Contradiction (Red): Directly opposes reference material.
`;

export const analyzeProposal = async (proposalText: string, references: Reference[]): Promise<AnalysisReport> => {
  const referenceContext = references.map(r => 
    `[ID: ${r.id}] Title: ${r.title} (${r.year})\nSnippet: ${r.contentSnippet}`
  ).join('\n---\n');

  const prompt = `
  Analyze the following Grant Proposal Text against the provided Reference Library.
  
  Proposal Text:
  """
  ${proposalText}
  """

  Reference Library:
  """
  ${referenceContext}
  """

  Perform a deep audit. Identify key scientific claims. Cross-reference them. 
  
  Output valid JSON matching this schema:
  {
    "overallScore": number (0-100),
    "claims": [
      {
        "id": "string",
        "text": "The exact text of the claim",
        "status": "verified" | "warning" | "contradiction",
        "confidence": number (0-1),
        "sourceId": "ref-id or null",
        "explanation": "Why this status was assigned",
        "suggestion": "How to fix it (if not verified)"
      }
    ],
    "complianceIssues": ["string", "string"],
    "toneAnalysis": "Brief analysis of the scientific tone"
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using 2.5 Flash for Thinking support
      contents: prompt,
      config: {
        systemInstruction: AUDITOR_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        thinkingConfig: {
          thinkingBudget: 2048 // Allocated budget for auditing reasoning
        }
      }
    });

    const text = response.text || "{}";
    // Sanitize in case markdown blocks are included (though mimeType json should prevent this usually)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr) as AnalysisReport;

  } catch (error) {
    console.error("Audit failed", error);
    // Return a fallback mock in case of failure for the demo
    return {
      overallScore: 0,
      claims: [],
      complianceIssues: ["Error analyzing proposal. Please try again."],
      toneAnalysis: "N/A"
    };
  }
};

export const chatWithAgent = async (
  history: { role: string; text: string }[], 
  newMessage: string,
  context?: string
): Promise<string> => {
  try {
    // We use gemini-2.5-flash for the chat for speed, but add search grounding for up-to-date info
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Context: ${context || 'No specific context provided.'}
        
        Chat History:
        ${history.map(h => `${h.role}: ${h.text}`).join('\n')}
        
        User: ${newMessage}
      `,
      config: {
        systemInstruction: "You are a helpful GrantAxiom assistant. Assist the researcher in refining their proposal. Be concise and helpful.",
        tools: [{ googleSearch: {} }] // Enable search for finding new references
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat failed", error);
    return "I'm having trouble connecting to the network right now.";
  }
};

export const generateImpactSimulation = async (
  proposalText: string,
  references: Reference[],
  report: AnalysisReport | null,
  userPrompt?: string
): Promise<string> => {
  
  const refSnippet = references.slice(0, 5).map(r => `- ${r.title}: ${r.contentSnippet.slice(0, 200)}...`).join('\n');
  const auditSnippet = report ? `Audit Score: ${report.overallScore}. Key Issue: ${report.complianceIssues[0] || 'None'}` : 'Audit not yet performed.';

  const prompt = `
  You are an expert scientific visualization engineer and educator.
  
  Task: Create a self-contained, interactive HTML5 simulation (HTML, CSS, JS) to demonstrate the core scientific concepts or "Broader Impacts" of the following research proposal.
  The target audience is high school students or the general public.
  
  Context (Proposal):
  """
  ${proposalText.slice(0, 5000)}
  """

  Context (Key References):
  """
  ${refSnippet}
  """

  Context (Audit Status):
  ${auditSnippet}
  
  User Requirement: ${userPrompt || "Generate a highly interactive, scientifically accurate simulation based on the methodology and findings described above. Make it visually stunning."}
  
  Requirements:
  1. Output ONLY valid HTML code. Start with <!DOCTYPE html>.
  2. Use HTML5 Canvas for rendering.
  3. Include interactivity (mouse, click, or sliders).
  4. Styling: Dark mode, scientific aesthetic (slate/blue/neon colors), clean typography (sans-serif).
  5. The code must be self-contained (no external CSS/JS files unless using reliable CDNs like Tailwind or Recharts).
  6. Ensure the simulation actually runs and doesn't just show static text.
  7. Do not include markdown code fences (like \`\`\`html). Just return the raw HTML string.
  
  Make it impressive.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using 2.5 Flash for Thinking support
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4096 }, // Higher budget for code generation
        responseMimeType: 'text/plain'
      }
    });

    let code = response.text || "";
    // Cleanup markdown if present
    if (code.includes("```html")) {
      code = code.split("```html")[1].split("```")[0];
    } else if (code.includes("```")) {
      code = code.split("```")[1].split("```")[0];
    }
    return code.trim();
  } catch (error) {
    console.error("Simulation generation failed", error);
    return `<html><body style="background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;"><h3>Failed to generate simulation. Please try again.</h3></body></html>`;
  }
};