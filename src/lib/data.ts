export const profile = {
  name: "Fahreza Alghifari",
  fullName: "Muhammad Fahreza Alghifari",
  titles: ["AI Engineer Lead", "Graduate Researcher", "Open Source Developer", "Kendoka"],
  email: "m.fahreza.alghifari@gmail.com",
  summary:
    "Dabbed in AI before it was mainstream, blessed to have a career and research topics related to it. Spent the last 5+ years shipping AI products — agentic workflows, RAG pipelines, vector search, the whole stack. Also a masters student at IIUM with published research and not done yet. Outside of work, practicing Kendo (2nd Kyu) at AI Kendo Club. Always happy to chat about AI, open source, or anything in between — feel free to reach out.",
  links: {
    github: "https://github.com/MFA-X-AI",
    linkedin: "https://www.linkedin.com/in/m-fahreza-alghifari/",
    scholar:
      "https://scholar.google.com/citations?user=-gc9YzEAAAAJ&hl=en",
  },
  stats: {
    yearsExperience: "5+",
    publications: 11,
    citations: 174,
    hIndex: 7,
  },
};

export const skills = [
  {
    category: "AI / ML / GenAI",
    items: [
      "PyTorch",
      "TensorFlow",
      "Scikit-Learn",
      "LLM Orchestration",
      "RAG",
      "Agentic AI",
      "Vector Databases",
      "ONNX",
    ],
  },
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Perl"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Svelte", "Tailwind CSS"],
  },
  {
    category: "Backend & Cloud",
    items: [
      "FastAPI",
      "Flask",
      "PostgreSQL",
      "AWS",
      "Firebase",
      "GitHub Actions",
    ],
  },
];

export const experiences = [
  {
    role: "AI Engineer Lead",
    company: "XpressAI",
    period: "Mar 2023 — 2025",
    bullets: [
      "Led end-to-end AI product delivery for enterprise clients — architecture, full-stack development (React + Flask), and deployment.",
      "Architected and shipped GenAI solutions: LLM chatbots, agentic AI workflows, and RAG pipelines using OpenAI, Anthropic, Gemini, and DeepSeek APIs.",
      "Lead developer of Xircuits (open-source visual AI platform) and Vecto (enterprise vector database for semantic search).",
    ],
    tech: ["React", "Flask", "OpenAI", "Anthropic", "RAG", "Vector DB"],
  },
  {
    role: "AI Systems Engineer Lead",
    company: "Skymind",
    period: "Jul 2020 — Mar 2023",
    bullets: [
      "Promoted from Data Science Intern to Lead within 18 months; directed product roadmaps and managed concurrent AI/data engineering projects.",
      "Accelerated delivery through automated testing and CI/CD pipelines. Mentored 5+ apprentices; delivered 5+ industry webinars.",
    ],
    tech: ["Python", "CI/CD", "Deep Learning", "Data Engineering"],
  },
];

export const projects = [
  {
    name: "D'AI: Islamic Agentic AI Framework",
    description:
      "Agentic AI framework operationalizing tawhidic epistemology for Islamic knowledge retrieval with multi-layer knowledge bases (SQL + Vector + Knowledge Graph).",
    impact:
      "Built a 6,236-verse Qur'anic benchmark evaluating 15 LLMs. Agentic approach improved accuracy from 31–69% to 80–99.6% EM while reducing cost 167x.",
    tech: ["LLMs", "RAG", "Knowledge Graph", "SQL", "Vector DB"],
    category: "research",
    award: "Best Presenter — ICODS 2025",
  },
  {
    name: "Xircuits",
    description:
      "Open-source visual programming platform for building AI workflows, built on React TypeScript + JupyterLab. Supports TensorFlow, PyTorch, and Spark.",
    impact: "Lead developer since 2021. Active open-source project with community contributors.",
    tech: ["React", "TypeScript", "JupyterLab", "PyTorch", "TensorFlow"],
    category: "opensource",
    link: "https://xircuits.io",
  },
  {
    name: "Kendo Nexus",
    description:
      "Multi-tenant SaaS community management platform for Kendo — the first national-scale production deployment of its kind.",
    impact:
      "Full-stack with Next.js, React, TypeScript, PostgreSQL/Firebase Data Connect (GraphQL), and multi-layered RBAC.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "GraphQL", "Firebase"],
    category: "featured",
    link: "https://kendonexus.com",
  },
  {
    name: "pyvoicebox",
    description:
      "Python library for voice transformation and augmentation, useful for data augmentation in speech ML pipelines.",
    impact:
      "Open-source tool for researchers and developers working with speech and audio data processing.",
    tech: ["Python", "Audio Processing", "Speech ML"],
    category: "opensource",
    link: "https://github.com/MFA-X-AI/pyvoicebox",
  },
  {
    name: "Edge-AI Depression Screening",
    description:
      "Offline, bilingual depression screening device using speech biomarkers on edge hardware, targeting underserved Malaysian community clinics.",
    impact:
      "Modernized legacy training pipeline, ported models across frameworks, built full-stack recording system (Next.js + FastAPI) for structured field data collection.",
    tech: ["TFLite", "ONNX", "Next.js", "FastAPI", "Raspberry Pi"],
    category: "research",
  },
  {
    name: "AI-Driven Financial Forecasting",
    description:
      "End-to-end ETL and ML pipelines for financial forecasting in AWS, with GenAI integration via Bedrock.",
    impact:
      "Achieved 70x processing acceleration and 200x data scaling over legacy systems.",
    tech: ["AWS Glue", "S3", "Bedrock", "Python", "Spark"],
    category: "featured",
  },
  {
    name: "Crowd Monitoring System",
    description:
      "Full-stack crowd monitoring solution for a national railway agency with AI object recognition.",
    impact:
      "Svelte frontend, Gunicorn/Postgres backend, AI recognition module with security compliance.",
    tech: ["Svelte", "Gunicorn", "PostgreSQL", "Computer Vision"],
    category: "featured",
  },
  {
    name: "Project MyEMOS",
    description:
      "Multi-year speech emotion recognition research project spanning undergrad FYP to M.Sc., awarded FRGS and PRGS national research grants.",
    impact:
      "Created the Sorrow Analysis Dataset (SAD, IEEE DataPort). Won Gold (PECIPTA 2019), Silver (MTE 2020). 8+ publications.",
    tech: ["PyTorch", "TensorFlow", "Librosa", "MFCC"],
    category: "research",
    award: "Gold Medal — PECIPTA 2019",
  },
  {
    name: "AIDENTALE",
    description:
      "Medical AI project for dental disease diagnosis using TensorFlow MaskRCNN with cross-platform visualization.",
    impact:
      "Built Kivy cross-platform app for segmentation visualization of dental X-rays.",
    tech: ["TensorFlow", "MaskRCNN", "Kivy", "Python"],
    category: "research",
  },
];

export const publications = {
  stats: {
    total: 11,
    citations: 174,
    hIndex: 7,
    firstAuthored: 7,
  },
  selected: [
    {
      title:
        "Mitigating LLM Hallucinations in Quranic Content: An Agentic Approach Using Deployable Language Models",
      authors: "MF Alghifari, M Kartiwi, MBA Zaim, DOD Handayani",
      venue: "ICoICT",
      year: 2025,
      citations: 0,
    },
    {
      title: "Fikr: AI Chatbot Powered with Vector Search",
      authors: "SR Nurfikri, D Handayani, AM Fahreza, et al.",
      venue: "ICCED",
      year: 2024,
      citations: 1,
    },
    {
      title:
        "Development of Sorrow Analysis Dataset for Speech Depression Prediction",
      authors: "MF Alghifari, TS Gunawan, M Kartiwi",
      venue: "IEEE I2MTC",
      year: 2023,
      citations: 9,
    },
    {
      title:
        "On the Effect of Feature Compression on SER Across Multiple Languages",
      authors: "MF Alghifari, TS Gunawan, NNWN Hashim, et al.",
      venue: "Springer LNEE",
      year: 2021,
      citations: 2,
    },
    {
      title:
        "On the Optimum Speech Segment Length for Depression Detection",
      authors: "MF Alghifari, TS Gunawan, et al.",
      venue: "IEEE ICSIMA",
      year: 2019,
      citations: 10,
    },
    {
      title: "On the Use of Voice Activity Detection in SER",
      authors: "MF Alghifari, TS Gunawan, SAA Qadri, et al.",
      venue: "BEEI",
      year: 2019,
      citations: 27,
    },
    {
      title:
        "A Critical Insight into Multi-Languages Speech Emotion Databases",
      authors: "SAA Qadri, TS Gunawan, MF Alghifari, et al.",
      venue: "BEEI",
      year: 2019,
      citations: 13,
    },
    {
      title: "The Disruptometer: An AI Algorithm for Market Insights",
      authors: "D Vedenyapin, MF Alghifari, TS Gunawan",
      venue: "BEEI",
      year: 2019,
      citations: 8,
    },
    {
      title:
        "Comparative Analysis of Gender Identification Using Speech Analysis and HOS",
      authors: "SAA Qadri, TS Gunawan, T Wani, MF Alghifari, et al.",
      venue: "IEEE ICSIMA",
      year: 2019,
      citations: 4,
    },
    {
      title:
        "Speech Emotion Recognition Using Deep Feedforward Neural Network",
      authors: "MF Alghifari, TS Gunawan, M Kartiwi",
      venue: "IJEECS",
      year: 2018,
      citations: 55,
    },
    {
      title:
        "A Review on Emotion Recognition Algorithms Using Speech Analysis",
      authors: "TS Gunawan, MF Alghifari, MA Morshidi, M Kartiwi",
      venue: "IJEEI",
      year: 2018,
      citations: 45,
    },
  ],
};

export const education = [
  {
    degree: "M.Sc. in Information & Communication Technology",
    institution: "IIUM, Kulliyyah of ICT",
    period: "2025 — Present",
    note: "Research: Agentic AI Framework Based on Islamic Epistemology (D'AI)",
  },
  {
    degree: "M.Sc. in Computer & Information Engineering",
    institution: "IIUM, Kulliyyah of Engineering",
    period: "2018 — 2020",
    note: "Thesis: SER and Depression Prediction Using DNNs",
  },
  {
    degree: "B.Eng. (Hons) in Electronic — Computer & Information Engineering",
    institution: "International Islamic University Malaysia",
    period: "2014 — 2018",
    note: "CGPA: 3.81 | Best Student ECE | IEEE SPS Best FYP",
  },
];

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
];
