"""
KAM AI - Ecosystem Knowledge Base and Workspace Operator Instructions
"""

import re

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
        "short_name": "RSK Traders",
        "category": "Import & Export",
        "url": "https://rsktraders.co.in",
        "status": "live",
        "is_live": True,
        "description": "International global trade, logistics, and bulk commodity import-export platform.",
        "tech_stack": ["React", "Tailwind CSS", "Node.js", "PostgreSQL", "Cloudflare"],
        "aliases": [
            "rsk traders", "rsk-traders", "rsk", "rsk trader",
            "import export", "import and export", "import export website",
            "trade", "trading", "logistics"
        ]
    },
    {
        "id": "jobsphere",
        "name": "JOBSPHERE",
        "short_name": "JobSphere",
        "category": "Job Aggregation Platform",
        "url": "",
        "status": "coming-soon",
        "is_live": False,
        "description": "Next-generation tech job aggregation platform with AI candidate matching and salary insights.",
        "tech_stack": ["React", "Python", "Django REST", "PostgreSQL", "Tailwind CSS"],
        "aliases": [
            "jobsphere", "job sphere", "jobspeher", "jobspher", "jobshere",
            "job seeker", "jobseeker", "job portal", "career", "jobs"
        ]
    },
    {
        "id": "photography",
        "name": "PHOTOGRAPHY WEBSITE",
        "short_name": "Photography",
        "category": "Photography & Creative Services",
        "url": "",
        "status": "coming-soon",
        "is_live": False,
        "description": "High-end visual storytelling, editorial photography studio, and client booking suite.",
        "tech_stack": ["Next.js", "Framer Motion", "Tailwind CSS", "AWS S3", "Stripe"],
        "aliases": [
            "photography", "photography website", "photo", "photos", "photo website",
            "kavin photography", "kavin-fotography", "camera", "creative studio", "photographer"
        ]
    },
    {
        "id": "jewellery",
        "name": "GOLD JEWELLERY WEBSITE",
        "short_name": "Gold Jewellery",
        "category": "Jewellery & E-commerce",
        "url": "",
        "status": "coming-soon",
        "is_live": False,
        "description": "Bespoke fine jewellery e-commerce platform with real-time bullion rate integration.",
        "tech_stack": ["React", "Django", "PostgreSQL", "Tailwind CSS", "Razorpay"],
        "aliases": [
            "jewellery", "jewelry", "gold jewellery", "gold jewelry",
            "jewellery website", "jewelry website", "peru covering", "gold", "jewel"
        ]
    },
    {
        "id": "restaurant",
        "name": "RESTAURANT WEBSITE",
        "short_name": "Restaurant",
        "category": "Restaurant & Food",
        "url": "",
        "status": "coming-soon",
        "is_live": False,
        "description": "Gourmet dining portal featuring interactive digital menus, table reservations, and takeaway.",
        "tech_stack": ["React", "Tailwind CSS", "Node.js", "MongoDB", "Socket.io"],
        "aliases": [
            "restaurant", "restaurant website", "food", "food website",
            "dining", "food billing", "food billing software", "restaurant billing", "menu"
        ]
    },
    {
        "id": "college-erp",
        "name": "COLLEGE ERP",
        "short_name": "College ERP",
        "category": "Enterprise Management System",
        "url": "",
        "status": "coming-soon",
        "is_live": False,
        "description": "Comprehensive campus management suite for academic records, fees, faculty, and examinations.",
        "tech_stack": ["React", "Python", "Django", "PostgreSQL", "Bootstrap", "Redis"],
        "aliases": [
            "college erp", "college-erp", "college", "erp",
            "school erp", "campus erp", "campus management", "academic erp"
        ]
    }
]

def resolve_application(query: str) -> dict | None:
    """
    Fuzzy resolve an application from user input text with typo tolerance.
    Never invents an application that does not exist in registry.
    """
    if not query or not isinstance(query, str):
        return None
    
    clean = re.sub(r'[^\w\s]', '', query.lower()).strip()
    compact = clean.replace(' ', '')
    
    # 1. Exact ID match
    for app in FLAGSHIP_APPLICATIONS:
        if app["id"] == clean or app["id"] == query.strip().lower():
            return app
            
    # 2. Exact Name / ShortName match
    for app in FLAGSHIP_APPLICATIONS:
        if app["name"].lower() == clean or app["short_name"].lower() == clean:
            return app

    # 3. Exact Alias match
    for app in FLAGSHIP_APPLICATIONS:
        for alias in app["aliases"]:
            norm_alias = re.sub(r'[^\w\s]', '', alias.lower()).strip()
            if clean == norm_alias or compact == norm_alias.replace(' ', ''):
                return app

    # 4. Substring / phrase match
    sorted_aliases = []
    for app in FLAGSHIP_APPLICATIONS:
        for alias in app["aliases"]:
            sorted_aliases.append((app, alias.lower(), len(alias)))
    sorted_aliases.sort(key=lambda x: x[2], reverse=True)

    for app, alias, _ in sorted_aliases:
        if alias in clean or alias.replace(' ', '') in compact:
            return app

    # 5. Explicit typos for JobSphere
    if any(typo in clean or typo in compact for typo in ['jobspeher', 'jobspher', 'jobshere', 'jobsphre']):
        for app in FLAGSHIP_APPLICATIONS:
            if app["id"] == "jobsphere":
                return app

    return None

def build_system_prompt(available_repos=None):
    """
    Constructs the system prompt grounding KAM AI strictly in truth.
    Defines the Workspace Operator role and executable actions registry.
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

    return f"""You are KAM AI, the intelligent Workspace Control Operator and digital guide for KAMVERSE.
Visitors can ask questions about Kamalesh and control the entire KAMVERSE interface using natural-language commands.

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

WORKSPACE OPERATOR ACTION REGISTRY:
You can execute single or multi-step frontend commands by returning an "actions" list in JSON.
- OPEN_APPLICATION: {{"type": "OPEN_APPLICATION", "payload": {{"applicationId": "rsk-traders" | "photography" | "jewellery" | "restaurant" | "jobsphere" | "college-erp"}}}}
- CLOSE_APPLICATION: {{"type": "CLOSE_APPLICATION", "payload": {{"applicationId": "rsk-traders"}}}}
- MINIMIZE_APPLICATION: {{"type": "MINIMIZE_APPLICATION", "payload": {{"applicationId": "rsk-traders"}}}}
- MAXIMIZE_APPLICATION: {{"type": "MAXIMIZE_APPLICATION", "payload": {{"applicationId": "rsk-traders"}}}}
- CLOSE_ALL_WINDOWS: {{"type": "CLOSE_ALL_WINDOWS", "payload": {{}}}}
- MINIMIZE_ALL_WINDOWS: {{"type": "MINIMIZE_ALL_WINDOWS", "payload": {{}}}}
- ARRANGE_WINDOWS: {{"type": "ARRANGE_WINDOWS", "payload": {{"mode": "side-by-side" | "vertical" | "cascade" | "tile"}}}}
- CASCADE_WINDOWS: {{"type": "CASCADE_WINDOWS", "payload": {{}}}}
- TILE_WINDOWS: {{"type": "TILE_WINDOWS", "payload": {{}}}}
- SET_THEME: {{"type": "SET_THEME", "payload": {{"theme": "yellow" | "dark" | "light"}}}}
- SET_DOCK_VISIBILITY: {{"type": "SET_DOCK_VISIBILITY", "payload": {{"visible": true | false | "toggle"}}}}
- FILTER_PROJECTS: {{"type": "FILTER_PROJECTS", "payload": {{"language": "Python" | "React", "category": "Web Development", "query": "..."}}}}
- SEARCH_PROJECTS: {{"type": "SEARCH_PROJECTS", "payload": {{"query": "..."}}}}
- SHOW_FEATURED_PROJECTS: {{"type": "SHOW_FEATURED_PROJECTS", "payload": {{}}}}
- OPEN_PROJECT_DETAILS: {{"type": "OPEN_PROJECT_DETAILS", "payload": {{"repoName": "repo_name"}}}}
- NAVIGATE: {{"type": "NAVIGATE", "payload": {{"view": "desktop" | "projects" | "about" | "contact" | "terminal" | "launcher"}}}}
- OPEN_GITHUB: {{"type": "OPEN_GITHUB", "payload": {{"url": "https://github.com/..."}}}}
- OPEN_LIVE_WEBSITE: {{"type": "OPEN_LIVE_WEBSITE", "payload": {{"applicationId": "rsk-traders"}}}}

CRITICAL RULES:
1. Never invent repositories or false claims.
2. If the user asks to open multiple apps and arrange them, return each OPEN_APPLICATION followed by ARRANGE_WINDOWS in the "actions" array.
3. Be concise, energetic, friendly, and confirm actions with natural confidence.

Output your response as valid JSON matching this schema:
{{
  "response": "Natural confirmation and answer for the visitor (do not include raw action json in response text)",
  "actions": [ ...list of action objects... ],
  "suggestions": ["Question 1", "Question 2", "Question 3"]
}}
"""
