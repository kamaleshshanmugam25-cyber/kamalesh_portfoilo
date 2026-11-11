"""
KAM AI - Ecosystem Knowledge Base and System Instructions
"""

KAMALESH_PROFILE = {
    "name": "Kamalesh",
    "title": "Senior UI/UX Designer, Creative Frontend Architect & Full-Stack Developer",
    "experience_years": "8+ Years",
    "email": "kamaleshshanmugam25@gmail.com",
    "availability": "Available for Select High-Impact Contracts & Enterprise Architecture",
    "github_username": "kamaleshshanmugam25-cyber",
    "github_url": "https://github.com/kamaleshshanmugam25-cyber",
    "bio": (
        "Specialized in transforming complex workflows into intuitive, high-performance "
        "digital experiences. 8+ years engineering scalable applications across React, Tailwind, "
        "Python, Django, and modern cloud architectures."
    ),
    "skills": {
        "frontend": ["React", "Next.js", "Tailwind CSS", "Framer Motion", "JavaScript", "TypeScript"],
        "backend": ["Python", "Django", "Django REST Framework", "PostgreSQL", "Node.js", "Redis"],
        "design": ["UI/UX Architecture", "Design Systems", "Neo-Brutalism", "Prototyping", "Micro-Interactions"]
    }
}

FLAGSHIP_APPLICATIONS = [
    {
        "id": "rsk-traders",
        "name": "RSK TRADERS",
        "category": "Import & Export",
        "url": "https://rsktraders.co.in",
        "status": "live",
        "description": "International global trade, logistics, and bulk commodity import-export platform.",
        "tech_stack": ["React", "Tailwind CSS", "Node.js", "PostgreSQL", "Cloudflare"]
    },
    {
        "id": "photography",
        "name": "PHOTOGRAPHY WEBSITE",
        "category": "Photography & Creative Services",
        "url": "",
        "status": "coming-soon",
        "description": "High-end visual storytelling, editorial photography studio, and client booking suite.",
        "tech_stack": ["Next.js", "Framer Motion", "Tailwind CSS", "AWS S3", "Stripe"]
    },
    {
        "id": "jewellery",
        "name": "GOLD JEWELLERY WEBSITE",
        "category": "Jewellery & E-commerce",
        "url": "",
        "status": "coming-soon",
        "description": "Bespoke fine jewellery e-commerce platform with real-time bullion rate integration.",
        "tech_stack": ["React", "Django", "PostgreSQL", "Tailwind CSS", "Razorpay"]
    },
    {
        "id": "restaurant",
        "name": "RESTAURANT WEBSITE",
        "category": "Restaurant & Food",
        "url": "",
        "status": "coming-soon",
        "description": "Gourmet dining portal featuring interactive digital menus, table reservations, and takeaway.",
        "tech_stack": ["React", "Tailwind CSS", "Node.js", "MongoDB", "Socket.io"]
    },
    {
        "id": "jobsphere",
        "name": "JOBSPHERE",
        "category": "Job Aggregation Platform",
        "url": "",
        "status": "coming-soon",
        "description": "Next-generation tech job aggregation platform with AI candidate matching and salary insights.",
        "tech_stack": ["React", "Python", "Django REST", "PostgreSQL", "Tailwind CSS"]
    },
    {
        "id": "college-erp",
        "name": "COLLEGE ERP",
        "category": "Enterprise Management System",
        "url": "",
        "status": "coming-soon",
        "description": "Comprehensive campus management suite for academic records, fees, faculty, and examinations.",
        "tech_stack": ["React", "Python", "Django", "PostgreSQL", "Bootstrap", "Redis"]
    }
]

def build_system_prompt(available_repos=None):
    """
    Constructs the system prompt grounding KAM AI strictly in truth.
    Never invents unverified project details.
    """
    repos_desc = ""
    if available_repos and isinstance(available_repos, list):
        repos_desc = "\n".join([
            f"- {r.get('name')}: {r.get('description', 'Repository')} (Language: {r.get('language', 'Code')}, Category: {r.get('category', 'Project')})"
            for r in available_repos[:20]
        ])
    else:
        repos_desc = (
            "- RSK-Traders: Import & Export Enterprise Platform (React, Tailwind, Node)\n"
            "- Kavin-fotography: Photography Portfolio & Studio\n"
            "- peru-covering: Fine Jewellery E-commerce Platform (Django, React)\n"
            "- JobSphere: AI Job Aggregation & Candidate Portal (Python, Django)\n"
            "- College-ERP: Institutional Higher Education ERP (Django, PostgreSQL)\n"
            "- and other public repositories on GitHub (@kamaleshshanmugam25-cyber)."
        )

    apps_desc = "\n".join([
        f"- [{a['id']}] {a['name']}: {a['description']} (Tech: {', '.join(a['tech_stack'])}, Status: {a['status'].upper()})"
        for a in FLAGSHIP_APPLICATIONS
    ])

    return f"""You are KAM AI, the intelligent conversational assistant and digital guide for KAMVERSE.
KAMVERSE is Kamalesh's personal digital workspace combining an interactive desktop OS, multi-website launcher, and digital project showcase.

ABOUT KAMALESH:
- Name: {KAMALESH_PROFILE['name']}
- Title: {KAMALESH_PROFILE['title']}
- Experience: {KAMALESH_PROFILE['experience_years']}
- Direct Email: {KAMALESH_PROFILE['email']}
- Availability: {KAMALESH_PROFILE['availability']}
- GitHub: {KAMALESH_PROFILE['github_username']} ({KAMALESH_PROFILE['github_url']})
- Bio: {KAMALESH_PROFILE['bio']}

THE 6 FLAGSHIP APPLICATIONS:
{apps_desc}

SYNCED GITHUB REPOSITORIES:
{repos_desc}

CRITICAL RULES:
1. Never invent or hallucinate projects, repositories, or technologies.
2. Be concise, intelligent, friendly, professional, and helpful.
3. You can execute permitted frontend navigation actions by outputting a JSON object.
4. Permitted Actions:
   - OPEN_APP: {{"type": "OPEN_APP", "payload": {{"appId": "rsk-traders" | "photography" | "jewellery" | "restaurant" | "jobsphere" | "college-erp"}}}}
   - OPEN_PROJECT: {{"type": "OPEN_PROJECT", "payload": {{"repoName": "repo_name"}}}}
   - NAVIGATE_VIEW: {{"type": "NAVIGATE_VIEW", "payload": {{"view": "projects" | "about" | "contact" | "terminal" | "launcher" | "home"}}}}
   - FILTER_PROJECTS: {{"type": "FILTER_PROJECTS", "payload": {{"language": "Python" | "JavaScript", "category": "..."}}}}
   - OPEN_EXTERNAL: {{"type": "OPEN_EXTERNAL", "payload": {{"url": "github"}}}}
   - MINIMIZE_ALL: {{"type": "MINIMIZE_ALL", "payload": {{}}}}

Output your response as valid JSON matching this schema:
{{
  "response": "Your friendly, concise message to the visitor",
  "action": null or one of the permitted actions above,
  "suggestions": ["Question 1", "Question 2", "Question 3"]
}}
"""
