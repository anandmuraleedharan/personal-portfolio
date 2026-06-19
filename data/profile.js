// Centralized Profile Data for Anand Muraleedharan
// Single source of truth for portfolio site, experience stepper, Zety-style resume, and AI chatbot.

export const profile = {
  personal: {
    name: "Anand Muraleedharan",
    title: "Principal Data Engineer & Architect",
    subtitle: "Principal Data Engineer / Data Architect",
    experienceYears: "10+",
    email: "anand.muraleedharan@gmail.com",
    phone: "214-937-1403",
    location: "Frisco, TX, 75033",
    linkedin: "https://linkedin.com/in/Anand-Muraleedharan",
    linkedinShort: "linkedin.com/in/Anand-Muraleedharan",
    github: "https://github.com/anandmuraleedharan",
    githubShort: "github.com/anandmuraleedharan",
    website: "https://anandmuraleedharan.com",
    websiteShort: "anandmuraleedharan.com",
    summary: "Highly qualified Principal Data Engineer & Architect with 10+ years of experience focused on translating complex business mandates into actionable plans and scalable data systems. Expert in data transformation pipelines, cloud migrations, and Kimball/Data Vault 2.0 modeling. Started career immediately in June 2015 at SAP Labs, with only a brief 9-month transition gap during UT Dallas graduate studies before resuming active engineering roles."
  },
  
  skills: {
    // Divided into groups for homepage display
    groups: [
      {
        title: "Data Warehousing & Architecture",
        skills: [
          { name: "Snowflake", level: "Expert", rating: 4 },
          { name: "Google BigQuery", level: "Expert", rating: 4 },
          { name: "SAP HANA", level: "Advanced", rating: 3 },
          { name: "Kimball Dimensional Modeling", level: "Expert", rating: 4 },
          { name: "Data Vault 2.0 (dbtVault / AutomateDV)", level: "Advanced", rating: 4 }
        ]
      },
      {
        title: "Pipeline Ingestion & Orchestration",
        skills: [
          { name: "dbt (data build tool)", level: "Expert", rating: 4 },
          { name: "Apache Airflow / Astronomer", level: "Expert", rating: 4 },
          { name: "Vertex AI & Kubeflow (KFP) Pipelines", level: "Advanced", rating: 3 },
          { name: "Fivetran", level: "Advanced", rating: 3 },
          { name: "Looker (PDTs)", level: "Advanced", rating: 3 }
        ]
      },
      {
        title: "Languages, Infra & Cloud",
        skills: [
          { name: "SQL & Python", level: "Expert", rating: 4 },
          { name: "JavaScript / SAPUI5", level: "Advanced", rating: 4 },
          { name: "AWS, GCP & Azure", level: "Advanced", rating: 3 },
          { name: "Terraform", level: "Advanced", rating: 3 },
          { name: "Jinja, ABAP & Shell Scripting", level: "Advanced", rating: 4 }
        ]
      }
    ],
    // Flat list for resume sidebar ordering
    resumeSidebar: [
      { name: "Data Warehousing", level: "Very Good", rating: 4 },
      { name: "Snowflake", level: "Very Good", rating: 4 },
      { name: "dbt (Data Build Tool)", level: "Very Good", rating: 4 },
      { name: "Apache Airflow", level: "Good", rating: 3 },
      { name: "Astronomer", level: "Good", rating: 3 },
      { name: "Looker", level: "Good", rating: 3 },
      { name: "Fivetran", level: "Good", rating: 3 }
    ],
    resumeSidebarPage2: [
      { name: "Python", level: "Good", rating: 3 },
      { name: "SQL", level: "Very Good", rating: 4 },
      { name: "JavaScript", level: "Very Good", rating: 4 },
      { name: "Google BigQuery", level: "Very Good", rating: 4 },
      { name: "Shell Scripting", level: "Very Good", rating: 4 },
      { name: "Terraform", level: "Good", rating: 3 },
      { name: "SAP HANA", level: "Good", rating: 3 }
    ]
  },

  certifications: [
    { title: "Astronomer Certification for Apache Airflow 3 Fundamentals", date: "2025-06", org: "Astronomer" },
    { title: "dbt Certified Developer (dbt Labs)", date: "2022-07", org: "dbt Labs" },
    { title: "AWS Certified Cloud Practitioner", date: "2022-03", org: "Amazon Web Services" },
    { title: "HashiCorp Certified: Terraform Associate", date: "2022-02", org: "HashiCorp" }
  ],

  education: [
    {
      degree: "Master of Science: Information Technology and Management",
      school: "The University of Texas at Dallas",
      location: "Richardson, TX",
      period: "2018 - 2020",
      gpa: "4.0/4.0",
      highlights: [
        "Awarded ITM All Rounder Award",
        "President of ITM Student Leadership Club | Dean's List",
        "ERP Specialization"
      ]
    },
    {
      degree: "Bachelor of Technology: Mechanical Engineering",
      school: "Amrita Vishwa Vidyapeetham",
      location: "Coimbatore, India",
      period: "2011 - 2015",
      gpa: "8.7/10",
      highlights: []
    }
  ],

  experience: [
    {
      key: "autodeskFull",
      role: "Principal Data Engineer & Architect (officially Sr. Data Engineer)",
      company: "Autodesk",
      location: "Frisco, TX (Remote)",
      period: "Nov 2023 - Present (2 yrs 8 mos)",
      isFulltime: true,
      isJourney: false,
      description: "Leading enterprise telemetry pipelines and GTM analytics at Autodesk.",
      details: [
        "**Principal Data Engineer** (Jan 2026 - Present): Designing robust product telemetry schemas, optimizing warehouse performance in Snowflake, and streamlining data models using dbt and Apache Airflow on Astronomer.",
        "**Senior Sales Operations Analyst** (Nov 2023 - Dec 2025): Developed custom GTM insight frameworks in Python and SQL, saving operational overhead and automating finance data reporting.",
        "Skills: Python, SQL, Snowflake, dbt, Airflow, Astronomer"
      ],
      resumeItems: [
        {
          title: "Principal Data Engineer (Senior title officially, Jan 2026 - Present)",
          details: "Design robust telemetry schemas, optimize warehouse performance in Snowflake, and build Airflow DAGs on Astronomer."
        },
        {
          title: "Senior Sales Operations Analyst (Nov 2023 - Dec 2025)",
          details: "Developed custom GTM insight frameworks in Python and SQL, saving operational overhead and automating finance data reporting."
        }
      ]
    },
    {
      key: "atosJourney",
      role: "Data Engineering Progression & Consulting Journey",
      company: "Visual BI → Maven Wave → Eviden (An Atos Company)",
      location: "Plano, TX / Remote",
      period: "May 2019 - Oct 2023 (4 yrs 6 mos)",
      isFulltime: true,
      isJourney: true,
      description: "Delivered modern cloud data solutions and directed technical execution for enterprise clients. Progressed through multiple engineering, consulting, and leadership roles while navigating company acquisitions (Visual BI acquired by Atos/Maven Wave, later rebranded as Eviden). Note: This timeline highlights a brief 9-month transition gap starting grad studies at UTD in Aug 2018, before starting this active engineering progression in May 2019.",
      roles: [
        {
          title: "Manager - Data Engineering",
          period: "Apr 2023 - Oct 2023 (7 mos)",
          details: [
            "Managed data engineering delivery teams, established enterprise-wide dbt coding standards, and set up BigQuery testing architectures."
          ],
          clientProjects: [
            {
              client: "Blue Shield of California",
              role: "Principal Data Engineer (Contract)",
              period: "May 2023 - Oct 2023 (6 mos)",
              details: [
                "Modeled core clinical and financial transactions in Snowflake using **Data Vault 2.0** modeling principles.",
                "Engineered scalable dbt pipelines utilizing **dbtVault / AutomateDV** on Azure cloud systems."
              ],
              skills: "Azure | Snowflake | dbt | Data Vault 2.0 | AutomateDV"
            }
          ]
        },
        {
          title: "Principal Consultant - Data Engineering (formerly Sr. Consultant)",
          period: "Feb 2022 - Mar 2023 (1 yr 2 mos)",
          details: [
            "Led the BI architecture migration of Coke One North America (CONA) from SAP HANA to Snowflake, improving Airflow DAG runs by 400% through data clustering, incremental models, and custom post-hook macros.",
            "Designed and configured client infrastructure code using Terraform on AWS and GCP."
          ],
          clientProjects: [
            {
              client: "American Family Insurance",
              role: "Principal Data Engineer (Contract)",
              period: "Feb 2023 - Apr 2023 (3 mos)",
              details: [
                "Structured GCP BigQuery pipelines and integrated **Vertex AI** with Kubeflow (**KFP**) ML pipelines.",
                "Wrote custom Python ingestion adapters for macroeconomic APIs (FRED, BLS, BTS, CDC, Yfinance)."
              ],
              skills: "GCP | BigQuery | Vertex AI | KFP Pipelines | Python | SQL"
            },
            {
              client: "UPS",
              role: "Principal Data Engineer (Contract)",
              period: "May 2022 - Dec 2022 (8 mos)",
              details: [
                "Developed custom Unix Shell and Python ingestion wrappers on a Linux Integration hub.",
                "Designed BigQuery data warehouse models to query complex hierarchical HR organization charts."
              ],
              skills: "GCP | BigQuery | Shell | SQL | Python"
            }
          ]
        },
        {
          title: "Principal Consultant - BI & Analytics Solutions Developer",
          period: "Oct 2020 - Mar 2022 (1 yr 6 mos)",
          details: [
            "Designed Snowflake pipelines, dbt transformations, and integrated with Azure Repos for version control."
          ],
          clientProjects: [
            {
              client: "Autodesk",
              role: "Principal Data Engineer (Contract)",
              period: "Oct 2020 - Jan 2022 (1 yr 4 mos)",
              details: [
                "Developed a dbt-based testing framework for early detection of Fivetran pipeline failures.",
                "Migrated legacy finance pipelines to a Snowflake + dbt stack, improving DAG run times by 200%.",
                "Pushed Looker PDTs down into the database transformation layer to ensure DRY modeling practices."
              ],
              skills: "Snowflake | dbt | Airflow | Astronomer | Looker"
            }
          ]
        },
        {
          title: "Business Intelligence Developer (Internship)",
          period: "May 2019 - Oct 2020 (1 yr 6 mos)",
          details: [
            "Modeled schemas using Kimball Dimensional Design on SAP HANA databases.",
            "Wrote optimized SQL queries and built operational analytics dashboards for clients."
          ],
          skills: "SAP HANA | Kimball Dimensional Modeling | SQL"
        }
      ]
    },
    {
      key: "sap",
      role: "Developer (formerly Associate Developer)",
      company: "SAP Labs India",
      location: "Bengaluru, India",
      period: "Jun 2015 - Jul 2018 (3 yrs 2 mos)",
      isFulltime: true,
      isJourney: false,
      description: "Developed enterprise frontend web applications and backend lifecycle tools.",
      details: [
        "**Developer** (Apr 2018 - Jul 2018): Programmed full-stack features using SAPUI5 and ABAP on SAP HANA databases.",
        "**Associate Developer** (Jun 2015 - Mar 2018): Shipped 5 web applications utilizing MVC design patterns and OOP concepts.",
        "Created CI/CD flows in Jenkins, configured Nginx servers, and analyzed client-side latency in Chrome DevTools.",
        "Skills: SAPUI5, ABAP, HANA, oData, JavaScript, Nginx, Jenkins"
      ],
      resumeItems: [
        {
          title: "Developer (Apr 2018 - Jul 2018)",
          details: "Programmed full-stack features using SAPUI5 and ABAP on SAP HANA databases."
        },
        {
          title: "Associate Developer (Jun 2015 - Mar 2018)",
          details: "Shipped 5 enterprise web apps utilizing MVC patterns, configured Jenkins CI/CD pipelines, Nginx, and analyzed performance."
        }
      ]
    }
  ],
  
  testimonials: [
    {
      name: "Evin Anderson",
      title: "Analytics Engineering @ Luxury Presence",
      relation: "Managed Anand directly at Autodesk & Maven Wave",
      date: "April 2026",
      text: "Anand worked with me as a consultant and later on the same team. As a customer of his, I felt taken care of. As a people manager, I had confidence in execution. His attention to detail, understanding of complicated processes, and ability to embrace ambiguity is unparalleled. On top of this, his skills as a data engineer and consultant are unbelievable. He has an amazing personality. I hope to be able to hire him again one day."
    },
    {
      name: "Naresh Sigamani",
      title: "Director of Data Architecture | Service Line Lead",
      relation: "Managed Anand directly",
      date: "December 2023",
      text: "His dedication, quick learning abilities, and passion for data have been truly impressive. Anand consistently demonstrated a strong commitment to mastering data engineering, grasping complex concepts swiftly, and applying them in real-world scenarios. Anand is proactive, innovative, and played a crucial role in multiple large projects, showcasing technical prowess and a keen problem-solving mindset."
    },
    {
      name: "Eshwar Venkatadri",
      title: "Principal, Senior Manager, Data & Analytics | Eviden",
      relation: "Managed Anand directly",
      date: "November 2023",
      text: "He is technically proficient in his field of expertise, with the additional quality of being flexible and a fast learner - he has always been a keystone resource on all the projects that he has been a part of. In addition, he is highly organized and has the tendency to take full ownership of the work he does regardless of what capacity he is working in."
    },
    {
      name: "Bill Faley",
      title: "Cloud Data Architect | Snowflake & Google Cloud",
      relation: "Managed Anand directly",
      date: "October 2023",
      text: "Anand is a brilliant technologist that can manage and develop the most complex data engineering use cases. He can drive business value with the solutions being developed and speak to a wide variety of stakeholders along the way. Of the many skills he brings to the table, I'd say his attention to detail, adherence to best practices, and ability to manage technical teams stand out."
    },
    {
      name: "Jay Goebel",
      title: "Practice Lead - CMEG at Lovelytics",
      relation: "Managed Anand directly at Eviden",
      date: "November 2023",
      text: "I was Anand's manager during my time at Eviden. During that time, Anand was a tremendous asset to the Data Engineering team and an absolute pleasure to work with. What impressed me most was his strong work ethic, unique problem solving abilities, and his constant desire to expand and apply his technical skill set. Anand would frequently lead the development efforts for multiple internal projects and achieve multiple technical certifications. He's a team player, trusted friend, and technical rockstar."
    },
    {
      name: "Rajeev Bajaj",
      title: "Data & Analytics Leader | Cloud & Digital Transformation",
      relation: "Managed Anand directly at Eviden",
      date: "November 2023",
      text: "I worked with Anand on two large, highly complex client projects focused on Cloud based data solutions. Over this time, I saw Anand taking a larger role leading the development team, defining architecture for cloud data pipelines and providing guidance to the client. Anand consistently demonstrated his strong technical know how, deep thinking and ability to solve complex problems. He is very dependable, humble, and always makes effective and consistent contributions."
    },
    {
      name: "Seshadri Chatterjee",
      title: "Lead Architect | SAP Data Science",
      relation: "Managed Anand directly at SAP Labs India",
      date: "December 2018",
      text: "Anand had delivered, time and again, on his commitments towards product development. Under high-pressure situations, he was able to prioritize well and walk the extra mile, keeping calm throughout. He remained proactive and transparent in all communications that impacted not only his work but also that of his colleagues."
    },
    {
      name: "Resmi K S",
      title: "Product Manager | SAP Cloud Application Lifecycle Management",
      relation: "Managed Anand directly at SAP Labs India",
      date: "June 2018",
      text: "I worked with Anand in the SAP Solution Manager and Focused Run for SAP Solution Manager. When I joined the team I realized there was a lot of respect the team had towards him. In the course of time I came to admire Anand for his commitment (he proactively updates statuses), creativity (newer and simpler solutions to seemingly complex problems), and collaboration. Anand is a great team player and understands team dynamics very fast. He is a man of a few words and gives meaningful feedback."
    },
    {
      name: "Arun Varadarajan, PMP",
      title: "Data Enthusiast & Enterprise Data Architect",
      relation: "Managed Anand directly",
      date: "February 2025",
      text: "I worked with Anand and also was a manager on some of his projects. Anand is an extremely talented person who was a key contributor for projects and helped deliver projects on time. He went above and beyond what was stated and is a man of few words but is someone who can get things done effectively. He also picked up skills on the job and scaled up when the need presented itself which was very valuable to us on projects."
    },
    {
      name: "Nitesh Jain",
      title: "Senior Architect",
      relation: "Worked with Anand on the same team",
      date: "November 2023",
      text: "Anand is absolutely fantastic person to work with. There is lot of depth and width in discussions with him both technological and functional. You can assign him the task or the problem and rest assured that it will be done. I will not miss another chance to get him on my team. In short, reliable, knowledgeable and committed."
    }
  ]
};
