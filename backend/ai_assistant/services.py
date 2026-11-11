"""
KAM AI - Assistant Service & Workspace Operator Intent Engine
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
    otherwise executes the high-precision built-in Workspace Operator engine.
    """
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    if openai_key and not openai_key.startswith("your-"):
        try:
            return call_openai_provider(message, openai_key, available_repos)
        except Exception:
            pass

    return run_local_intent_engine(message, available_repos)

def call_openai_provider(message: str, api_key: str, available_repos: list = None) -> dict:
    """
    Calls OpenAI API with JSON mode for structured workspace execution.
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

    actions = data.get("actions", [])
    if not actions and data.get("action"):
        actions = [data.get("action")]

    return {
        "response": data.get("response", "I processed your request."),
        "actions": actions,
        "action": actions[0] if actions else None,
        "suggestions": data.get("suggestions", ["Show all projects", "Open RSK Traders", "Who is Kamalesh?"])
    }

def run_local_intent_engine(message: str, available_repos: list = None) -> dict:
    """
    Fast, reliable, zero-latency Workspace Operator intent matching engine.
    Supports single and multi-step actions across windows, applications, themes, dock and projects.
    """
    p = message.lower().strip()
    actions = []

    # ============================================================
    # 1. MULTI-STEP INTENTS (e.g., Open A, open B, and arrange...)
    # ============================================================
    if (("open" in p or "launch" in p) and ("and arrange" in p or "side by side" in p or "together" in p)):
        apps_to_open = []
        if any(k in p for k in ["rsk", "import", "trade"]):
            apps_to_open.append("rsk-traders")
        if any(k in p for k in ["photo", "camera", "studio"]):
            apps_to_open.append("photography")
        if any(k in p for k in ["jewel", "gold", "bullion"]):
            apps_to_open.append("jewellery")
        if any(k in p for k in ["restaurant", "food", "dining"]):
            apps_to_open.append("restaurant")
        if any(k in p for k in ["job", "career", "sphere"]):
            apps_to_open.append("jobsphere")
        if any(k in p for k in ["erp", "college", "campus"]):
            apps_to_open.append("college-erp")

        if len(apps_to_open) >= 2:
            for app_id in apps_to_open:
                actions.append({
                    "type": "OPEN_APPLICATION",
                    "payload": {"applicationId": app_id}
                })
            actions.append({
                "type": "ARRANGE_WINDOWS",
                "payload": {"mode": "side-by-side"}
            })

            return {
                "response": "Opened both applications and arranged them side by side on your screen. You can interact with both workspaces simultaneously!",
                "actions": actions,
                "action": actions[0],
                "suggestions": ["Tile windows", "Close all windows", "Show all projects"]
            }

    # ============================================================
    # 2. WINDOW ARRANGE, CASCADE, TILE COMMANDS
    # ============================================================
    if ("arrange" in p and "side by side" in p) or "side by side" in p or "split screen" in p:
        actions.append({"type": "ARRANGE_WINDOWS", "payload": {"mode": "side-by-side"}})
        return {
            "response": "Arranged your active workspace windows side by side in split columns.",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Cascade windows", "Tile windows", "Close all windows"]
        }

    if "cascade" in p:
        actions.append({"type": "CASCADE_WINDOWS", "payload": {}})
        return {
            "response": "Cascaded your active windows with diagonal progressive stacking.",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Tile windows", "Arrange side by side", "Minimize all"]
        }

    if "tile" in p or "grid" in p:
        actions.append({"type": "TILE_WINDOWS", "payload": {}})
        return {
            "response": "Tiled all active windows into a balanced desktop grid.",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Cascade windows", "Arrange side by side", "Close all windows"]
        }

    if any(k in p for k in ["close all", "close everything", "shut all"]):
        actions.append({"type": "CLOSE_ALL_WINDOWS", "payload": {}})
        return {
            "response": "Closed all active windows and cleared your workspace.",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Open RSK Traders", "Show all projects", "Who is Kamalesh?"]
        }

    if any(k in p for k in ["minimize all", "clear screen", "show desktop", "go to desktop"]):
        actions.append({"type": "MINIMIZE_ALL_WINDOWS", "payload": {}})
        return {
            "response": "Minimized all windows down to the KAMVERSE desktop canvas.",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Open RSK Traders", "Show all projects", "Tile windows"]
        }

    # ============================================================
    # 3. THEME COMMANDS
    # ============================================================
    if any(k in p for k in ["dark mode", "dark theme", "midnight theme", "black theme"]):
        actions.append({"type": "SET_THEME", "payload": {"theme": "dark"}})
        return {
            "response": "Activated the Midnight Dark theme (#151515). High-contrast dark visuals are now active.",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Switch to yellow theme", "Switch to light theme", "Open RSK Traders"]
        }

    if any(k in p for k in ["light mode", "light theme", "bright mode", "white theme"]):
        actions.append({"type": "SET_THEME", "payload": {"theme": "light"}})
        return {
            "response": "Activated the Clean Light theme (#F5F5F0) for daytime clarity.",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Switch to yellow theme", "Enable dark mode", "Show all projects"]
        }

    if any(k in p for k in ["yellow theme", "neo-brutalist theme", "default theme", "reset theme"]):
        actions.append({"type": "SET_THEME", "payload": {"theme": "yellow"}})
        return {
            "response": "Restored the signature Neo-Brutalist Yellow theme (#F5F04E).",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Enable dark mode", "Show all projects", "Open RSK Traders"]
        }

    # ============================================================
    # 4. DOCK COMMANDS
    # ============================================================
    if "hide dock" in p or "remove dock" in p:
        actions.append({"type": "SET_DOCK_VISIBILITY", "payload": {"visible": False}})
        return {
            "response": "Hidden the bottom macOS dock to give you maximum canvas space.",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show dock", "Open RSK Traders", "Show all projects"]
        }

    if "show dock" in p or "unhide dock" in p or "bring back dock" in p:
        actions.append({"type": "SET_DOCK_VISIBILITY", "payload": {"visible": True}})
        return {
            "response": "Bottom macOS dock is now visible.",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Hide dock", "Tile windows", "Show all projects"]
        }

    # ============================================================
    # 5. GREETINGS
    # ============================================================
    if re.search(r'^(hi|hello|hey|greetings|introduce|who are you)', p):
        return {
            "response": (
                "Hello! I am **KAM AI**, your Workspace Operator in KAMVERSE. ⚡\n\n"
                f"I know everything about Kamalesh's {KAMALESH_PROFILE['experience_years']} of engineering experience, "
                "his 6 flagship applications, and his public GitHub profile. "
                "You can also command me to arrange windows, toggle themes, and launch workspaces!\n\n"
                "How can I configure your workspace today?"
            ),
            "actions": [],
            "action": None,
            "suggestions": [
                "Open RSK Traders and Photography side-by-side",
                "Show Python projects",
                "Enable dark mode",
                "Who is Kamalesh?",
                "Tile windows in grid"
            ]
        }

    # ============================================================
    # 6. ABOUT KAMALESH
    # ============================================================
    if re.search(r'(who is kamalesh|about kamalesh|bio|background|experience|career)', p):
        actions.append({"type": "NAVIGATE", "payload": {"view": "about"}})
        return {
            "response": (
                f"**{KAMALESH_PROFILE['name']}** is a **{KAMALESH_PROFILE['title']}** "
                f"with over **{KAMALESH_PROFILE['experience_years']}** of enterprise web engineering experience.\n\n"
                f"• **Status**: {KAMALESH_PROFILE['availability']}\n"
                f"• **Philosophy**: {KAMALESH_PROFILE['bio']}\n\n"
                "I am opening his full profile window for you!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": [
                "What technologies does he use?",
                "Show all projects",
                "Contact Kamalesh"
            ]
        }

    # ============================================================
    # 7. TECHNOLOGIES & SKILLS
    # ============================================================
    if re.search(r'(skills|technologies|tech stack|what does he use|languages|tools)', p):
        skills_summary = (
            "• **Frontend**: React, Next.js, Tailwind CSS, Framer Motion, TypeScript\n"
            "• **Backend**: Python, Django, Django REST Framework, PostgreSQL, Redis\n"
            "• **Architecture**: Scalable Design Systems, Neo-Brutalism, Micro-Interactions"
        )
        actions.append({"type": "NAVIGATE", "payload": {"view": "about"}})
        return {
            "response": (
                f"Kamalesh specializes in modern full-stack web architectures:\n\n{skills_summary}\n\n"
                "Navigating to his technical skills view!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": [
                "Show Python projects",
                "Show all projects",
                "Open RSK Traders"
            ]
        }

    # ============================================================
    # 8. FLAGSHIP WEBSITES
    # ============================================================
    if re.search(r'(rsk|traders|import|export|bulk trade)', p):
        actions.append({"type": "OPEN_APPLICATION", "payload": {"applicationId": "rsk-traders"}})
        return {
            "response": (
                "**RSK TRADERS** is an international import & export platform for global merchant trade and bulk logistics.\n"
                "Opening the RSK Traders application window right now!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show all projects", "Open JobSphere", "Tile windows"]
        }

    if re.search(r'(photography|studio|photos|camera)', p):
        actions.append({"type": "OPEN_APPLICATION", "payload": {"applicationId": "photography"}})
        return {
            "response": (
                "**PHOTOGRAPHY WEBSITE** is an editorial visual storytelling studio with private client proofing suites.\n"
                "Opening the Photography application overview!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Open Gold Jewellery", "Show all projects", "Arrange side by side"]
        }

    if re.search(r'(jewellery|jewelry|gold|bullion|ornaments)', p):
        actions.append({"type": "OPEN_APPLICATION", "payload": {"applicationId": "jewellery"}})
        return {
            "response": (
                "**GOLD JEWELLERY WEBSITE** is a bespoke fine jewellery e-commerce platform with real-time bullion market tickers.\n"
                "Opening the Gold Jewellery application window!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Open Restaurant", "Show all projects"]
        }

    if re.search(r'(restaurant|food|dining|culinary|menu)', p):
        actions.append({"type": "OPEN_APPLICATION", "payload": {"applicationId": "restaurant"}})
        return {
            "response": (
                "**RESTAURANT WEBSITE** is an artisanal culinary dining portal featuring digital interactive menus and table reservations.\n"
                "Opening the Restaurant application window!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Open College ERP", "Show all projects"]
        }

    if re.search(r'(jobsphere|job|career portal|hiring)', p):
        actions.append({"type": "OPEN_APPLICATION", "payload": {"applicationId": "jobsphere"}})
        return {
            "response": (
                "**JOBSPHERE** is a next-generation tech job aggregation platform featuring AI candidate matching and salary benchmarks.\n"
                "Opening the JobSphere application window!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show Python projects", "Open College ERP"]
        }

    if re.search(r'(college|erp|campus|academic)', p):
        actions.append({"type": "OPEN_APPLICATION", "payload": {"applicationId": "college-erp"}})
        return {
            "response": (
                "**COLLEGE ERP** is an enterprise campus management suite handling records, admissions, fees, and examinations for 10,000+ students.\n"
                "Opening the College ERP application window!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show Python projects", "Show all projects"]
        }

    # ============================================================
    # 9. PROJECT FILTERS
    # ============================================================
    if re.search(r'(python projects|show python|python repos|django projects)', p):
        actions.append({"type": "FILTER_PROJECTS", "payload": {"language": "Python"}})
        return {
            "response": (
                "Kamalesh has engineered several backend and full-stack Python platforms, "
                "including **College ERP** and **JobSphere**.\n\n"
                "I have opened the **Projects Explorer** and applied the **Python** filter!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show React projects", "Show all projects", "Open JobSphere"]
        }

    if re.search(r'(react projects|show react|frontend projects|javascript projects)', p):
        actions.append({"type": "FILTER_PROJECTS", "payload": {"language": "JavaScript"}})
        return {
            "response": "Navigated to Projects Explorer with the React / JavaScript filter applied!",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show Python projects", "Show all projects", "Open RSK Traders"]
        }

    if re.search(r'(featured projects|show featured|highlighted)', p):
        actions.append({"type": "SHOW_FEATURED_PROJECTS", "payload": {}})
        return {
            "response": "Showing Kamalesh's featured flagship applications in the Projects Explorer!",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show all projects", "Show Python projects"]
        }

    if re.search(r'(show all projects|all projects|browse projects|repositories|projects explorer)', p):
        actions.append({"type": "NAVIGATE", "payload": {"view": "projects"}})
        return {
            "response": (
                f"Opening the **Projects Explorer**! Here you can explore all public repositories "
                f"synchronized with @{KAMALESH_PROFILE['github_username']}, view live README specs, stars, and launch demos."
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show Python projects", "Open RSK Traders", "Take me to GitHub"]
        }

    # ============================================================
    # 10. GITHUB PROFILE
    # ============================================================
    if re.search(r'(github|git profile|source code|take me to github|open github)', p):
        actions.append({"type": "OPEN_GITHUB", "payload": {"url": KAMALESH_PROFILE["github_url"]}})
        return {
            "response": (
                f"Kamalesh's official GitHub profile is **@{KAMALESH_PROFILE['github_username']}**.\n"
                "Opening his GitHub profile in a secure tab for you!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show all projects", "Who is Kamalesh?"]
        }

    # ============================================================
    # 11. CONTACT & HIRE
    # ============================================================
    if re.search(r'(contact|hire|email|reach out|collaborate)', p):
        actions.append({"type": "NAVIGATE", "payload": {"view": "contact"}})
        return {
            "response": (
                f"You can reach Kamalesh directly at: `{KAMALESH_PROFILE['email']}`.\n"
                "Opening the direct Contact & Hire portal!"
            ),
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Who is Kamalesh?", "Show all projects"]
        }

    # ============================================================
    # 12. TERMINAL & LAUNCHER
    # ============================================================
    if re.search(r'(terminal|cli|console|command line)', p):
        actions.append({"type": "NAVIGATE", "payload": {"view": "terminal"}})
        return {
            "response": "Opening the interactive **Developer Terminal** for you!",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show all projects", "Tile windows"]
        }

    if re.search(r'(launcher|spotlight|command palette)', p):
        actions.append({"type": "NAVIGATE", "payload": {"view": "launcher"}})
        return {
            "response": "Opening the Application Launcher & Command Palette!",
            "actions": actions,
            "action": actions[0],
            "suggestions": ["Show all projects", "Who is Kamalesh?"]
        }

    # ============================================================
    # 13. SPECIFIC REPO LOOKUP
    # ============================================================
    if available_repos:
        for r in available_repos:
            r_name = r.get("name", "").lower()
            if r_name and r_name in p:
                actions.append({
                    "type": "OPEN_PROJECT_DETAILS",
                    "payload": {"repoName": r.get("name")}
                })
                return {
                    "response": (
                        f"Found repository **{r.get('displayName') or r.get('name')}** "
                        f"({r.get('category')}, {r.get('language')}).\n"
                        "Opening its project details window!"
                    ),
                    "actions": actions,
                    "action": actions[0],
                    "suggestions": ["Show all projects", "Take me to GitHub"]
                }

    # ============================================================
    # 14. DEFAULT FALLBACK
    # ============================================================
    return {
        "response": (
            "I am ready to control the workspace! You can command me to open apps (e.g. *'Open RSK Traders and Photography side by side'*), "
            "manage windows (*'Tile windows'*, *'Cascade windows'*, *'Close all'*), "
            "change themes (*'Dark mode'*, *'Light theme'*), or explore GitHub projects (*'Show Python projects'*)."
        ),
        "actions": [],
        "action": None,
        "suggestions": [
            "Open RSK Traders and Photography side-by-side",
            "Tile windows in grid",
            "Enable dark mode",
            "Show Python projects",
            "Who is Kamalesh?"
        ]
    }
