import { GoogleGenAI } from "@google/genai";
import { profile } from "@/data/profile";

async function generateContentWithRetry(ai, prompt) {
  const modelsToTry = [
    { name: "gemini-2.5-flash", delay: 1200 },
    { name: "gemini-2.5-flash-lite", delay: 1500 }, // Fallback to 2.5-flash-lite (active free tier quota)
    { name: "gemini-2.5-flash", delay: 2500 }       // Retry 2.5-flash after a delay
  ];

  let lastError;
  for (let i = 0; i < modelsToTry.length; i++) {
    const { name, delay } = modelsToTry[i];
    try {
      console.log(`[Tailor API] Attempt ${i + 1}: calling ${name}...`);
      const response = await ai.models.generateContent({
        model: name,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a professional technical recruiter whose output is strictly structured, valid JSON matching the requested schema."
        }
      });
      return response;
    } catch (e) {
      lastError = e;
      console.warn(`[Tailor API] Attempt ${i + 1} (${name}) failed:`, e.message);
      if (i < modelsToTry.length - 1) {
        console.log(`Waiting ${delay}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

export async function POST(req) {
  try {
    const { jobDescription } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key is not configured. Please add your GEMINI_API_KEY in .env.local to use the Recruiter Agent." },
        { status: 400 }
      );
    }

    if (!jobDescription || !jobDescription.trim()) {
      return Response.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert technical recruiter and resume customizer. 
      Analyze the provided Job Description and customize Anand Muraleedharan's master resume profile to align with the role.
      
      Here is Anand's master profile:
      ${JSON.stringify(profile, null, 2)}
      
      Here is the target Job Description:
      "${jobDescription}"
      
      Your goal is to tailor Anand's resume details and analyze his fit.
      
      Rules:
      1. Stay 100% factual. Do NOT invent new companies, dates, degrees, certifications, or projects.
      2. Rephrase or reorder the existing details/bullet points in the 'experience' list to emphasize projects and technologies requested in the Job Description. 
      3. For example:
         - If they emphasize Snowflake and dbt, make sure the bullet points for Autodesk (full-time and contract) and Coke One North America highlight Snowflake migrations and dbt modeling first.
         - If they emphasize clinical data or Data Vault 2.0, highlight the Blue Shield of California placement.
         - If they emphasize GCP or Vertex AI, highlight the American Family Insurance placement.
      4. Re-write the 'personal.summary' to directly address the key requirements of the job description, showing why Anand is the ideal candidate.
      5. Re-order the lists 'skills.resumeSidebar' and 'skills.resumeSidebarPage2' so that the skills matching the job description appear at the top.
      6. Provide a 'fitAnalysis' detailing:
         - 'score': an integer from 0 to 100 representing how well his actual experience aligns with the requirements.
         - 'strengths': array of 3-4 bullet points explaining why he is a strong match.
         - 'growth': array of 1-2 points listing technologies or practices in the JD that are not directly in his master resume, framed as areas he can quickly pick up given his background.
         - 'highlights': array of 2-3 specific projects from his history that you highlighted for this role.
         
      Return a single JSON object with the following structure:
      {
        "fitAnalysis": {
          "score": 95,
          "strengths": ["...", "..."],
          "growth": ["...", "..."],
          "highlights": ["...", "..."]
        },
        "tailoredProfile": {
          // This must match the structure of Anand's profile JSON but with tailored values for:
          // personal.summary, skills.resumeSidebar, skills.resumeSidebarPage2, and experience.
        }
      }
    `;

    const response = await generateContentWithRetry(ai, prompt);
    const resultText = response.text;
    
    // Parse the JSON to ensure it is valid before sending back
    const resultJson = JSON.parse(resultText);

    return Response.json(resultJson);
  } catch (error) {
    console.error("Error in tailor API:", error);
    const isServiceUnavailable = error.message && (error.message.includes("503") || error.message.includes("UNAVAILABLE") || error.message.includes("busy") || error.message.includes("demand") || error.message.includes("limit"));
    return Response.json(
      { error: isServiceUnavailable 
          ? "The Gemini API is currently experiencing high demand. Please try clicking the button again in a few seconds." 
          : "Failed to customize resume. Please verify your API key limits and try again." 
      },
      { status: 500 }
    );
  }
}
