import { GoogleGenAI } from "@google/genai";
import { profile } from "@/data/profile";

// Predefined fallback profiles for keyword matching when GEMINI_API_KEY is not set
// Built dynamically from the central profile data
const getFallbackAnswers = () => {
  const autodeskFull = profile.experience.find(e => e.key === "autodeskFull");
  const atosJourney = profile.experience.find(e => e.key === "atosJourney");
  const sap = profile.experience.find(e => e.key === "sap");

  const managerRole = atosJourney.roles[0];
  const blueShieldProj = managerRole.clientProjects[0];

  const consultantRole = atosJourney.roles[1];
  const amFamProj = consultantRole.clientProjects[0];
  const upsProj = consultantRole.clientProjects[1];

  const developerRole = atosJourney.roles[2];
  const autodeskContractProj = developerRole.clientProjects[0];

  const internRole = atosJourney.roles[3];

  return [
    {
      keywords: ["overview", "summary", "profile", "bio", "about", "who is", "career"],
      response: `${profile.personal.name} is a ${profile.personal.title} with ${profile.personal.experienceYears} years of experience. ${profile.personal.summary}`
    },
    {
      keywords: ["autodesk", "adsk"],
      response: `Anand has worked with Autodesk in two separate capacities:

1. **${autodeskFull.resumeItems[0].title} (Full-Time):** ${autodeskFull.resumeItems[0].details}
2. **${autodeskContractProj.role} (Contract, Oct 2020 - Jan 2022):** Placed at Autodesk as a consultant from Visual BI Solutions. ${autodeskContractProj.details.join(" ")}`
    },
    {
      keywords: ["coke", "coca-cola", "coca cola", "cona", "hana", "replatform"],
      response: `For Coke One North America (under Maven Wave), Anand designed and implemented the re-platforming of the BI architecture from SAP HANA to Snowflake. Key achievements included:
• Overhauled data warehousing structures using Kimball Dimensional Modeling principles.
• Reduced Airflow DAG execution runtimes by 400% through data clustering, incremental models, and full-refresh tuning.
• Created custom post-hook dbt macros to run metalytics and logging on BI transformations.`
    },
    {
      keywords: ["skills", "stack", "tech", "technologies", "tools", "languages"],
      response: `Anand's technical stack includes:
• **Data Warehousing:** Snowflake, Google BigQuery, SAP HANA, Kimball DW, Data Vault 2.0
• **Pipeline Ingestion & Orchestration:** dbt, Apache Airflow, Astronomer, Fivetran, Looker, Vertex AI, KFP
• **Languages:** SQL, Python, JavaScript, Shell Scripting, Jinja, ABAP, HTML/CSS
• **Cloud & DevOps:** AWS, GCP, Azure, Terraform, Jenkins, Nginx, Git`
    },
    {
      keywords: ["education", "ut dallas", "utd", "degree", "university", "gpa", "amrita"],
      response: `Anand's educational background:
1. **${profile.education[0].degree}** (GPA ${profile.education[0].gpa}) from **${profile.education[0].school}** (${profile.education[0].highlights.join(", ")}).
2. **${profile.education[1].degree}** (Grade ${profile.education[1].gpa}) from **${profile.education[1].school}**.`
    },
    {
      keywords: ["cert", "certification", "certified"],
      response: `Anand holds the following certifications:
${profile.certifications.map((c, i) => `${i + 1}. **${c.title}** (${c.org}, Issued ${c.date})`).join("\n")}`
    },
    {
      keywords: ["blue shield", "bsc", "clinical"],
      response: `At **Blue Shield of California** (${blueShieldProj.role}, May 2023 - Oct 2023), Anand was placed as a consultant during his time as a Data Engineering Manager at Eviden. ${blueShieldProj.details.join(" ")}`
    },
    {
      keywords: ["eviden"],
      response: `At **Eviden** (Full-time, ${managerRole.title}, Apr 2023 - Oct 2023), Anand managed data engineering teams developing modern cloud platforms, designed warehouse systems in Google BigQuery, and established enterprise-wide dbt standards.`
    },
    {
      keywords: ["american family", "amfam", "afi"],
      response: `At **American Family Insurance** (${amFamProj.role}, Feb 2023 - Apr 2023), Anand was placed as a consultant during his time as a Principal Consultant (formerly Senior Consultant) at Maven Wave/Atos. ${amFamProj.details.join(" ")}`
    },
    {
      keywords: ["ups", "hr", "hierarchical"],
      response: `At **UPS** (${upsProj.role}, May 2022 - Dec 2022), Anand was placed as a consultant during his time as a Principal Consultant (formerly Senior Consultant) at Maven Wave/Atos. ${upsProj.details.join(" ")}`
    },
    {
      keywords: ["visual bi", "visualbi", "solutions", "maven wave", "mavenwave", "eviden", "atos", "consulting", "contract"],
      response: `Anand's consulting career at **${atosJourney.company}** spans from May 2019 to Oct 2023, representing a strong 4.5-year career progression through acquisitions:

• **${managerRole.title}** (${managerRole.period}): Led delivery teams, set dbt standards. Placed at **Blue Shield of California** (${blueShieldProj.role}).
• **${consultantRole.title.split(" (")[0]}** (${consultantRole.period}): Placed at **American Family Insurance** (${amFamProj.role}) and **UPS** (${upsProj.role}).
• **${developerRole.title}** (${developerRole.period}): Designed Snowflake pipelines and dbt models. Placed at **Autodesk** (${autodeskContractProj.role}).
• **${internRole.title}** (${internRole.period}): Kimball DW modeling on SAP HANA.`
    },
    {
      keywords: ["sap", "sap labs", "developer", "frontend", "abap"],
      response: `At **SAP** (3 yrs 2 mos, Jun 2015 - Jul 2018):
• **Developer** (Apr 2018 - Jul 2018): Programmed full-stack features using SAPUI5 and ABAP on SAP HANA databases.
• **Associate Developer** (Jun 2015 - Mar 2018): Shipped 5 web applications utilizing MVC design patterns and OOP concepts, created CI/CD flows in Jenkins, configured Nginx, and analyzed performance in Chrome DevTools.`
    },
    {
      keywords: ["contact", "email", "phone", "linkedin", "github", "reach"],
      response: `Anand's contact details:
• **Email:** ${profile.personal.email}
• **LinkedIn:** ${profile.personal.linkedinShort}
• **GitHub:** ${profile.personal.githubShort}
• **Phone:** +1 ${profile.personal.phone}
• **Location:** ${profile.personal.location}`
    },
    {
      keywords: ["recommendation", "evin", "manager", "arun", "testimonial", "feedback"],
      response: `Anand has received **24 recommendations in total** on LinkedIn from directors, architects, and managers across SAP Labs, Eviden, Maven Wave, and Autodesk!

Here are some highlights:

• **${profile.testimonials[0].name} (${profile.testimonials[0].relationship}):** "${profile.testimonials[0].text}"

• **${profile.testimonials[1].name} (${profile.testimonials[1].relationship}):** "${profile.testimonials[1].text}"`
    },
    {
      keywords: ["resume", "cv", "pdf", "download"],
      response: `You can view and export Anand's official 2-page Zety-style resume directly as an ATS-compliant PDF! 

Click here to open and save the PDF: [Download A4 PDF Resume](/resume?print=true)

This generates a clean, non-editable, and fully vector-text PDF suitable for applicant tracking systems (ATS) and recruiters.`
    }
  ];
};

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Initialize Google Gen AI client if API key is set
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `
        You are Anand's AI Assistant. Your role is to answer questions about Anand Muraleedharan's professional career, skills, and background.
        Keep your answers concise, engaging, and professional. 
        
        Here is Anand's background profile:
        - Name: ${profile.personal.name}
        - Role: ${profile.personal.title} (with ${profile.personal.experienceYears} years of experience)
        - Email: ${profile.personal.email}
        - Contact: +1 ${profile.personal.phone}
        - Portfolio Website: ${profile.personal.websiteShort}
        - Location: ${profile.personal.location}
        - Summary: ${profile.personal.summary}
        - Education: 
          ${profile.education.map(edu => `* ${edu.degree} (GPA ${edu.gpa}) from ${edu.school} (${edu.period}). Highlights: ${edu.highlights.join(", ")}`).join("\n          ")}
        - Certifications: 
          ${profile.certifications.map(c => `* ${c.title} (${c.org}, ${c.date})`).join("\n          ")}
        - Skills: Snowflake, dbt, Airflow, Astronomer, BigQuery, SQL, Python, JavaScript, Shell Scripting, SAP HANA, Terraform, AWS, GCP, Azure, Vertex AI, KFP, Jinja, ABAP, SAPUI5.
        - Professional History:
          ${profile.experience.map(exp => {
            if (exp.isJourney) {
              return `* ${exp.company} (${exp.period}):
            ${exp.roles.map(subRole => `  - ${subRole.title} (${subRole.period}): ${subRole.details.join(" ")}
              ${subRole.clientProjects ? subRole.clientProjects.map(proj => `    Placement: ${proj.client} (${proj.role}): ${proj.details.join(" ")}`).join("\n              ") : ""}`).join("\n            ")}`;
            } else {
              return `* ${exp.company} (${exp.period}): ${exp.role}. Details: ${exp.details.join(" ")}`;
            }
          }).join("\n          ")}
        
        - Key Recommendations from Colleagues:
          * ${profile.testimonials[0].name} (${profile.testimonials[0].relationship}): "${profile.testimonials[0].text}"
          * ${profile.testimonials[1].name} (${profile.testimonials[1].relationship}): "${profile.testimonials[1].text}"
        
        - Resume PDF Copy requests:
          * If the user asks for a resume, CV, PDF copy, or download of Anand's resume, tell them that they can export it as an A4 Zety-style PDF by using the URL: /resume?print=true
        
        Answer the user's questions based on this profile. If they ask things unrelated to his career or data engineering, gently redirect them to ask about Anand's professional capabilities.
      `;

      // Structure messages for API call
      const formattedContents = [
        ...history.map(msg => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        })),
        { role: "user", parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction
        }
      });

      const responseText = response.text || "I apologize, I wasn't able to process that question. Could you try again?";
      return Response.json({ response: responseText });
    } else {
      // Fallback response parsing when API key is missing
      const lowercaseMsg = message.toLowerCase();
      let matchedResponse = "";
      const answers = getFallbackAnswers();

      for (const item of answers) {
        if (item.keywords.some(kw => lowercaseMsg.includes(kw))) {
          matchedResponse = item.response;
          break;
        }
      }

      if (!matchedResponse) {
        matchedResponse = `I'm a specialized portfolio assistant loaded with Anand's profile. Ask me about his roles at Autodesk, his certifications (Astronomer Airflow 3, dbt), recommendations (Evin Anderson), skills (Snowflake, dbt, Airflow, Python), or how to download his A4 Resume PDF!`;
      }

      return Response.json({ response: matchedResponse });
    }
  } catch (error) {
    console.error("Error in chat route:", error);
    return Response.json({ response: "Oops, something went wrong processing your request. Please try again." }, { status: 500 });
  }
}
