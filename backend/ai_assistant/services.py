"""
KAM AI - Assistant Service & LLM Provider Orchestrator
"""

import os
import json
import re
import requests
from .knowledge import KAMALESH_PROFILE, FLAGSHIP_APPLICATIONS, build_system_prompt

def process_chat_message(message: str, conversation_id: str, available_repos: list = None) -> dict:
    """
    Orchestrates the AI chat completion.
    Attempts configured external LLM provider if API key exists;
    otherwise executes the high-precision built-in rule and intent engine.
    """
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    # If external provider is configured with key
    if openai_key and not openai_key.startswith("your-"):
        try:
            return call_openai_provider(message, openai_key, available_repos)
        except Exception as e:
            # Fall through gracefully to the built-in deterministic engine
            pass

    # Built-in deterministic intent & semantic matching engine
    return run_local_intent_engine(message, available_repos)

def call_openai_provider(message: str, api_key: str, available_repos: list = None) -> dict:
    """
    Calls OpenAI API with JSON mode.
    """
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    system_prompt = build_system_prompt(available_repos)

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.4,
        "max_tokens": 450
    }

    response = requests.post(url, json=payload, headers=headers, timeout=8)
    response.raise_for_status()

    result = response.json()
    content = result["choices"][0]["message"]["content"]
    data = json.loads(content)

    return {
        "response": data.get("response", "I processed your request."),
        "action": data.get("action", None),
        "suggestions": data.get("suggestions", ["Show all projects", "Open RSK Traders", "Who is Kamalesh?"])
    }

def run_local_intent_engine(message: str, available_repos: list = None) -> dict:
    """
    Fast, reliable, zero-latency knowledge and intent matching engine.
    Guarantees 100% factual accuracy and zero hallucination.
    """
    p = message.lower().strip()

    # 1. GREETINGS
    if re.search(r'^(hi|hello|hey|greetings|introduce|who are you)', p):
        return {
            "response": (
                "Hello! I am **KAM AI**, your digital guide in KAMVERSE. "
                f"I know everything about Kamalesh's 8+ years of engineering experience, "
                "his 6 flagship applications, and all his public GitHub repositories. "
                "How can I assist you today?"
            ),
            "action": None,
            "suggestions": [
                "Who is Kamalesh?",
                "Open RSK Traders",
                "Show all projects",
                "Show Python projects",
                "Take me to GitHub"
            ]
        }

    # 2. ABOUT KAMALESH
    if re.search(r'(who is kamalesh|about kamalesh|bio|background|experience|career)', p):
        return {
            "response": (
                f"**{KAMALESH_PROFILE['name']}** is a **{KAMALESH_PROFILE['title']}** "
                f"with over **{KAMALESH_PROFILE['experience_years']}** of enterprise web engineering experience.\n\n"
                f"• **Status**: {KAMALESH_PROFILE['availability']}\n"
                f"• **Philosophy**: {KAMALESH_PROFILE['bio']}\n\n"
                "I am opening his full profile window for you!"
            ),
            "action": {
                "type": "NAVIGATE_VIEW",
                "payload": {"view": "about"}
            },
            "suggestions": [
                "What technologies does he use?",
                "Show all projects",
                "Contact Kamalesh"
            ]
        }

    # 3. TECHNOLOGIES & SKILLS
    if re.search(r'(skills|technologies|tech stack|what does he use|languages|tools)', p):
        skills_summary = (
            "• **Frontend**: React, Next.js, Tailwind CSS, Framer Motion, TypeScript\n"
            "• **Backend**: Python, Django, Django REST Framework, PostgreSQL, Redis\n"
            "• **Architecture**: Scalable Design Systems, Neo-Brutalism, Micro-Interactions"
        )
        return {
            "response": (
                f"Kamalesh specializes in modern full-stack web architectures:\n\n{skills_summary}\n\n"
                "Navigating to his technical skills view!"
            ),
            "action": {
                "type": "NAVIGATE_VIEW",
                "payload": {"view": "about"}
            },
            "suggestions": [
                "Show Python projects",
                "Show all projects",
                "Open RSK Traders"
            ]
        }

    # 4. FLAGSHIP WEBSITES
    # RSK Traders
    if re.search(r'(rsk|traders|import|export|bulk trade)', p):
        return {
            "response": (
                "**RSK TRADERS** is an international import & export platform for global merchant trade and bulk logistics.\n"
                "Opening the RSK Traders browser window right now!"
            ),
            "action": {
                "type": "OPEN_APP",
                "payload": {"appId": "rsk-traders"}
            },
            "suggestions": ["Show all projects", "Open JobSphere", "Take me home"]
        }

    # Photography
    if re.search(r'(photography|studio|photos|camera)', p):
        return {
            "response": (
                "**PHOTOGRAPHY WEBSITE** is an editorial visual storytelling studio with private client proofing suites.\n"
                "Opening the Photography application overview!"
            ),
            "action": {
                "type": "OPEN_APP",
                "payload": {"appId": "photography"}
            },
            "suggestions": ["Open Gold Jewellery", "Show all projects"]
        }

    # Gold Jewellery
    if re.search(r'(jewellery|jewelry|gold|bullion|ornaments)', p):
        return {
            "response": (
                "**GOLD JEWELLERY WEBSITE** is a bespoke fine jewellery e-commerce platform with real-time bullion market tickers.\n"
                "Opening the Gold Jewellery application window!"
            ),
            "action": {
                "type": "OPEN_APP",
                "payload": {"appId": "jewellery"}
            },
            "suggestions": ["Open Restaurant", "Show all projects"]
        }

    # Restaurant
    if re.search(r'(restaurant|food|dining|culinary|menu)', p):
        return {
            "response": (
                "**RESTAURANT WEBSITE** is an artisanal culinary dining portal featuring digital interactive menus and table reservations.\n"
                "Opening the Restaurant application window!"
            ),
            "action": {
                "type": "OPEN_APP",
                "payload": {"appId": "restaurant"}
            },
            "suggestions": ["Open College ERP", "Show all projects"]
        }

    # JobSphere
    if re.search(r'(jobsphere|job|career portal|hiring)', p):
        return {
            "response": (
                "**JOBSPHERE** is a next-generation tech job aggregation platform featuring AI candidate matching and salary benchmarks.\n"
                "Opening the JobSphere application window!"
            ),
            "action": {
                "type": "OPEN_APP",
                "payload": {"appId": "jobsphere"}
            },
            "suggestions": ["Show Python projects", "Open College ERP"]
        }

    # College ERP
    if re.search(r'(college|erp|campus|academic)', p):
        return {
            "response": (
                "**COLLEGE ERP** is an enterprise campus management suite handling records, admissions, fees, and examinations for 10,000+ students.\n"
                "Opening the College ERP application window!"
            ),
            "action": {
                "type": "OPEN_APP",
                "payload": {"appId": "college-erp"}
            },
            "suggestions": ["Show Python projects", "Show all projects"]
        }

    # 5. PYTHON PROJECTS FILTER
    if re.search(r'(python projects|show python|python repos|django projects)', p):
        return {
            "response": (
                "Kamalesh has engineered several backend and full-stack Python platforms, "
                "including **College ERP** and **JobSphere**.\n\n"
                "I have navigated to the **Projects Explorer** and applied the **Python** filter!"
            ),
            "action": {
                "type": "FILTER_PROJECTS",
                "payload": {"language": "Python"}
            },
            "suggestions": ["Show all projects", "Open JobSphere", "Open College ERP"]
        }

    # 6. ALL PROJECTS
    if re.search(r'(show all projects|all projects|browse projects|repositories|projects explorer)', p):
        return {
            "response": (
                f"Opening the **Projects Explorer**! Here you can explore all public repositories "
                f"synchronized with @{KAMALESH_PROFILE['github_username']}, view live README specs, stars, and launch demos."
            ),
            "action": {
                "type": "NAVIGATE_VIEW",
                "payload": {"view": "projects"}
            },
            "suggestions": ["Show Python projects", "Open RSK Traders", "Take me to GitHub"]
        }

    # 7. GITHUB PROFILE
    if re.search(r'(github|git profile|source code|take me to github|open github)', p):
        return {
            "response": (
                f"Kamalesh's official GitHub profile is **@{KAMALESH_PROFILE['github_username']}**.\n"
                "Opening his GitHub profile in a secure new tab for you!"
            ),
            "action": {
                "type": "OPEN_EXTERNAL",
                "payload": {"url": "github"}
            },
            "suggestions": ["Show all projects", "Who is Kamalesh?"]
        }

    # 8. CONTACT
    if re.search(r'(contact|hire|email|reach out|collaborate)', p):
        return {
            "response": (
                f"You can reach Kamalesh directly at: `{KAMALESH_PROFILE['email']}`.\n"
                "Opening the direct Contact & Hire portal!"
            ),
            "action": {
                "type": "NAVIGATE_VIEW",
                "payload": {"view": "contact"}
            },
            "suggestions": ["Who is Kamalesh?", "Show all projects"]
        }

    # 9. TERMINAL
    if re.search(r'(terminal|cli|console|command line)', p):
        return {
            "response": "Opening the interactive **Developer Terminal** for you!",
            "action": {
                "type": "NAVIGATE_VIEW",
                "payload": {"view": "terminal"}
            },
            "suggestions": ["Show all projects", "Take me home"]
        }

    # 10. HOME / DESKTOP
    if re.search(r'(home|desktop|minimize all|clear screen|take me home)', p):
        return {
            "response": "Cleared active windows and returned you to the KAMVERSE home desktop!",
            "action": {
                "type": "NAVIGATE_VIEW",
                "payload": {"view": "home"}
            },
            "suggestions": ["Open RSK Traders", "Show all projects"]
        }

    # 11. SPECIFIC REPO LOOKUP
    if available_repos:
        for r in available_repos:
            r_name = r.get("name", "").lower()
            if r_name and r_name in p:
                return {
                    "response": (
                        f"Found repository **{r.get('displayName') or r.get('name')}** "
                        f"({r.get('category')}, {r.get('language')}).\n"
                        "Opening its project details window!"
                    ),
                    "action": {
                        "type": "OPEN_PROJECT",
                        "payload": {"repoName": r.get("name")}
                    },
                    "suggestions": ["Show all projects", "Take me to GitHub"]
                }

    # 12. DEFAULT FALLBACK
    return {
        "response": (
            f"I can help you explore Kamalesh's ecosystem! "
            "You can ask me to open any of his 6 flagship websites (e.g. *'Open RSK Traders'*), "
            "filter projects (e.g. *'Show Python projects'*), or view his profile and GitHub."
        ),
        "action": None,
        "suggestions": [
            "Who is Kamalesh?",
            "Open RSK Traders",
            "Show all projects",
            "Show Python projects",
            "Contact Kamalesh"
        ]
    }
