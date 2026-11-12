"""
KAM AI - Assistant Service & Conversational Workspace Operator Engine
"""

import os
import json
import re
import requests
from .knowledge import KAMALESH_PROFILE, FLAGSHIP_APPLICATIONS, build_system_prompt, resolve_application

INTENT_TYPES = {
    "GREETING": "GREETING",
    "GENERAL_CONVERSATION": "GENERAL_CONVERSATION",
    "IDENTITY_QUESTION": "IDENTITY_QUESTION",
    "CAPABILITY_QUESTION": "CAPABILITY_QUESTION",
    "PROJECT_QUESTION": "PROJECT_QUESTION",
    "WORKSPACE_COMMAND": "WORKSPACE_COMMAND",
    "GITHUB_QUESTION": "GITHUB_QUESTION",
    "HELP_REQUEST": "HELP_REQUEST",
    "UNKNOWN": "UNKNOWN"
}

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

    clean_msg = data.get("message") or data.get("response") or "I processed your request."
    actions = data.get("actions", [])
    if not actions and data.get("action"):
        actions = [data.get("action")]

    return {
        "message": clean_msg,
        "response": clean_msg,
        "text": clean_msg,
        "actions": actions,
        "action": actions[0] if actions else None,
        "suggestions": data.get("suggestions", ["Show my projects", "Open RSK Traders", "Who is Kamalesh?"])
    }

def classify_intent(prompt: str) -> tuple[str, str]:
    """
    Accurately classifies user message into one of 9 categories before generating answers.
    Normal conversations must not be interpreted as commands.
    """
    p = re.sub(r'[?!.,;]', '', prompt.lower().strip())

    # 1. GREETING
    greeting_exact = {'hi', 'hello', 'hey', 'heya', 'howdy', 'hola', 'yo', 'sup', 'greetings', 'hi chat', 'hello chat', 'hey chat'}
    greeting_phrases = ['good morning', 'good afternoon', 'good evening', 'hi there', 'hello there', 'hey kam', 'hi chat', 'hello chat', 'hey chat']
    if p in greeting_exact or any(p == phrase or p.startswith(phrase + ' ') for phrase in greeting_phrases):
        return INTENT_TYPES["GREETING"], "DEFAULT"

    # 2. IDENTITY QUESTION
    if any(k in p for k in ['are you there', 'you there', 'u there']):
        return INTENT_TYPES["IDENTITY_QUESTION"], "PRESENCE"
    if any(k in p for k in ['your name', 'who are you', 'what are you called', 'what is your name', 'whats your name']):
        return INTENT_TYPES["IDENTITY_QUESTION"], "NAME"
    if any(k in p for k in ['who created you', 'who made you', 'who built you', 'who developed you', 'your creator']):
        return INTENT_TYPES["IDENTITY_QUESTION"], "CREATOR"
    if any(k in p for k in ['are you intelligent', 'are you smart', 'how smart are you', 'are you an ai', 'are you ai']):
        return INTENT_TYPES["IDENTITY_QUESTION"], "INTELLIGENCE"
    if any(k in p for k in ['tell me about yourself', 'about yourself', 'introduce yourself', 'describe yourself']):
        return INTENT_TYPES["IDENTITY_QUESTION"], "SELF_INTRO"
    if any(k in p for k in ['who is kamalesh', 'about kamalesh', 'tell me about kamalesh', 'who is the developer']):
        return INTENT_TYPES["IDENTITY_QUESTION"], "ABOUT_KAMALESH"

    # 3. CAPABILITY QUESTION
    if any(k in p for k in ['what can you do', 'what are your capabilities', 'what do you do', 'what can i ask you', 'how can you help', 'what can you help me with']):
        return INTENT_TYPES["CAPABILITY_QUESTION"], "DEFAULT"

    # 4. GENERAL CONVERSATION
    if p in {'thank you', 'thanks', 'thanks a lot', 'thank u', 'thx'} or p.startswith('thank you') or p.startswith('thanks') or 'appreciate it' in p:
        return INTENT_TYPES["GENERAL_CONVERSATION"], "GRATITUDE"
    if p in {'how are you', 'how are you doing', 'hows it going', "what's up"}:
        return INTENT_TYPES["GENERAL_CONVERSATION"], "STATUS_CHECK"
    if p in {'goodbye', 'bye', 'see you', 'cya'}:
        return INTENT_TYPES["GENERAL_CONVERSATION"], "FAREWELL"
    if p in {'cool', 'awesome', 'nice', 'great', 'perfect', 'good', 'sweet', 'ok', 'okay'}:
        return INTENT_TYPES["GENERAL_CONVERSATION"], "AFFIRMATION"

    # Tech explanations
    if any(k in p for k in ['what is react', 'explain react', 'tell me about react']):
        return INTENT_TYPES["GENERAL_CONVERSATION"], "EXPLAIN_REACT"
    if any(k in p for k in ['what is python', 'explain python', 'tell me about python']):
        return INTENT_TYPES["GENERAL_CONVERSATION"], "EXPLAIN_PYTHON"
    if any(k in p for k in ['what is django', 'explain django', 'tell me about django']):
        return INTENT_TYPES["GENERAL_CONVERSATION"], "EXPLAIN_DJANGO"
    if any(k in p for k in ['what is tailwind', 'explain tailwind']):
        return INTENT_TYPES["GENERAL_CONVERSATION"], "EXPLAIN_TAILWIND"

    # 5. WORKSPACE COMMANDS
    if ('open' in p or 'launch' in p) and ('side by side' in p or 'side-by-side' in p or 'and arrange' in p or 'together' in p or ('and' in p and ('side' in p or 'arrange' in p))):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "MULTI_OPEN_ARRANGE"
    if 'side by side' in p or 'side-by-side' in p or ('arrange' in p and 'window' in p):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "ARRANGE_SIDE_BY_SIDE"
    if 'cascade' in p:
        return INTENT_TYPES["WORKSPACE_COMMAND"], "CASCADE"
    if 'tile' in p or ('grid' in p and 'window' in p):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "TILE"
    if any(k in p for k in ['close all', 'close everything', 'shut all']):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "CLOSE_ALL"
    if any(k in p for k in ['minimize all', 'clear screen']):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "MINIMIZE_ALL"
    if any(k in p for k in ['go back to desktop', 'go to desktop', 'show desktop', 'return to desktop', 'back to desktop']):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "NAV_DESKTOP"

    # 3D Universe
    if 'reset the universe' in p or 'reset universe' in p:
        return INTENT_TYPES["WORKSPACE_COMMAND"], "RESET_UNIVERSE"
    if any(k in p for k in ['python projects', 'show python', 'show my python']):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "HIGHLIGHT_PYTHON"
    if any(k in p for k in ['react projects', 'show react', 'filter by react']):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "FILTER_REACT"
    if 'featured projects' in p:
        return INTENT_TYPES["WORKSPACE_COMMAND"], "FILTER_FEATURED"

    # Specific App Window Commands
    if p.endswith(' tab') or p.startswith(('switch to ', 'bring ', 'focus ', 'go to ')):
        clean_target = p.replace(' tab', '').replace('switch to ', '').replace('bring ', '').replace('focus ', '').replace('go to ', '').replace(' to front', '').replace(' window', '')
        if resolve_application(clean_target) or resolve_application(p):
            return INTENT_TYPES["WORKSPACE_COMMAND"], "SWITCH_APP"

    if p.startswith(('restore ', 'unminimize ')):
        clean_target = p.replace('restore ', '').replace('unminimize ', '').replace(' window', '')
        if resolve_application(clean_target) or resolve_application(p):
            return INTENT_TYPES["WORKSPACE_COMMAND"], "RESTORE_APP"

    if p.startswith(('close ', 'exit ')):
        clean_target = p.replace('close ', '').replace('exit ', '').replace(' window', '')
        if resolve_application(clean_target) or resolve_application(p):
            return INTENT_TYPES["WORKSPACE_COMMAND"], "CLOSE_APP"

    if p.startswith('minimize '):
        clean_target = p.replace('minimize ', '').replace(' window', '')
        if resolve_application(clean_target) or resolve_application(p):
            return INTENT_TYPES["WORKSPACE_COMMAND"], "MINIMIZE_APP"

    if p.startswith('maximize ') or 'full screen' in p:
        clean_target = p.replace('maximize ', '').replace('make ', '').replace(' full screen', '').replace(' window', '')
        if resolve_application(clean_target) or resolve_application(p):
            return INTENT_TYPES["WORKSPACE_COMMAND"], "MAXIMIZE_APP"

    if p.startswith('show ') and not p.startswith('show my projects') and not p.startswith('show projects'):
        clean_target = p.replace('show ', '').replace(' planet', '').replace(' website', '')
        if resolve_application(clean_target):
            return INTENT_TYPES["WORKSPACE_COMMAND"], "FOCUS_PLANET"

    if p.startswith(('open ', 'launch ', 'start ', 'view ', 'show my ')):
        clean_target = p.replace('open ', '').replace('launch ', '').replace('start ', '').replace('view ', '').replace('show my ', '').replace(' website', '')
        if resolve_application(clean_target) or resolve_application(p):
            return INTENT_TYPES["WORKSPACE_COMMAND"], "OPEN_APP"

    if any(k in p for k in ['dark mode', 'dark theme', 'midnight theme']):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "THEME_DARK"
    if any(k in p for k in ['light mode', 'light theme', 'bright mode', 'white theme']):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "THEME_LIGHT"
    if any(k in p for k in ['yellow theme', 'neo-brutalist theme', 'reset theme']):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "THEME_YELLOW"

    if 'hide dock' in p or 'remove dock' in p:
        return INTENT_TYPES["WORKSPACE_COMMAND"], "DOCK_HIDE"
    if 'show dock' in p or 'unhide dock' in p:
        return INTENT_TYPES["WORKSPACE_COMMAND"], "DOCK_SHOW"

    if p in {'show my projects', 'show projects', 'show all projects', 'open projects', 'open project explorer'} or 'show my projects' in p or 'browse projects' in p:
        return INTENT_TYPES["WORKSPACE_COMMAND"], "OPEN_PROJECTS"

    if any(k in p for k in ['open terminal', 'launch terminal']) or p == 'terminal':
        return INTENT_TYPES["WORKSPACE_COMMAND"], "NAV_TERMINAL"
    if any(k in p for k in ['open contact', 'contact page', 'hire page']) or p == 'contact':
        return INTENT_TYPES["WORKSPACE_COMMAND"], "NAV_CONTACT"
    if any(k in p for k in ['open about', 'about page']):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "NAV_ABOUT"
    if any(k in p for k in ['open activity', 'activity center', 'show activity', 'latest commits', 'show commits', 'heatmap']):
        return INTENT_TYPES["WORKSPACE_COMMAND"], "NAV_ACTIVITY"

    # 6. GITHUB
    if any(k in p for k in ['open github', 'take me to github', 'visit github']) or p == 'github':
        return INTENT_TYPES["GITHUB_QUESTION"], "OPEN_GITHUB"
    if any(k in p for k in ['github profile', 'his github', 'github account']):
        return INTENT_TYPES["GITHUB_QUESTION"], "INFO_GITHUB"

    # 7. PROJECT QUESTIONS
    if any(k in p for k in ['what is rsk', 'tell me about rsk', 'what is jobsphere', 'what is college erp', 'skills', 'technologies', 'tech stack']):
        return INTENT_TYPES["PROJECT_QUESTION"], "DEFAULT"

    # 8. HELP
    if p in {'help', 'help me'} or 'how to use' in p or 'what commands' in p:
        return INTENT_TYPES["HELP_REQUEST"], "DEFAULT"

    return INTENT_TYPES["UNKNOWN"], "DEFAULT"

def run_local_intent_engine(message: str, available_repos: list = None) -> dict:
    """
    Intelligent Workspace Operator intent matching and conversational generation.
    """
    p = message.lower().strip()
    intent, sub_intent = classify_intent(message)
    actions = []
    response_msg = ""
    suggestions = []

    # 1. GREETING
    if intent == INTENT_TYPES["GREETING"]:
        response_msg = "Hey! 👋 Welcome back. What are we working on today?"
        suggestions = ["Open RSK Traders", "Show my projects", "What can you do?", "Who is Kamalesh?"]

    # 2. IDENTITY QUESTION
    elif intent == INTENT_TYPES["IDENTITY_QUESTION"]:
        if sub_intent == "PRESENCE":
            response_msg = "Always ready! What would you like me to do?"
            suggestions = ["What can you do?", "Open RSK Traders", "Show my projects"]
        elif sub_intent == "NAME":
            response_msg = "I'm KAM AI, your personal AI assistant inside KAMVERSE! ⚡"
            suggestions = ["What can you do?", "Who created you?", "Show my projects"]
        elif sub_intent == "CREATOR":
            response_msg = "I was created for Kamalesh's KAMVERSE digital workspace."
            suggestions = ["Who is Kamalesh?", "What can you do?", "Show my projects"]
        elif sub_intent == "INTELLIGENCE":
            response_msg = "I'm designed to understand your requests, assist with your projects and control your KAMVERSE workspace."
            suggestions = ["What can you do?", "Open RSK Traders", "Show my projects"]
        elif sub_intent == "SELF_INTRO":
            response_msg = "I'm KAM AI, your personal assistant and workspace operator inside KAMVERSE. I was created for Kamalesh to help visitors explore projects, discuss technologies, and control this interactive digital workspace using natural language."
            suggestions = ["What can you do?", "Show my projects", "Who is Kamalesh?"]
        elif sub_intent == "ABOUT_KAMALESH":
            response_msg = f"Kamalesh is a Senior UI/UX Designer, Creative Frontend Architect and Full-Stack Developer with {KAMALESH_PROFILE['experience_years']} of enterprise experience building modern digital ecosystems."
            suggestions = ["What technologies does he use?", "Show my projects", "Contact Kamalesh"]

    # 3. CAPABILITY QUESTION
    elif intent == INTENT_TYPES["CAPABILITY_QUESTION"]:
        response_msg = "I can open applications, manage windows, search your projects, explore GitHub activity and customize your workspace."
        suggestions = ["Open RSK Traders", "Show my projects", "Open RSK Traders and JobSphere side-by-side", "Enable dark mode"]

    # 4. GENERAL CONVERSATION
    elif intent == INTENT_TYPES["GENERAL_CONVERSATION"]:
        if sub_intent == "GRATITUDE":
            response_msg = "You're welcome! Happy to help."
            suggestions = ["Show my projects", "What can you do?", "Open RSK Traders"]
        elif sub_intent == "STATUS_CHECK":
            response_msg = "I'm running smoothly at 100% and ready to assist! How are things with you?"
            suggestions = ["What can you do?", "Show my projects", "Open RSK Traders"]
        elif sub_intent == "FAREWELL":
            response_msg = "Goodbye! Feel free to summon me anytime you need assistance in KAMVERSE. 👋"
            suggestions = ["Hi", "Open RSK Traders", "Show my projects"]
        elif sub_intent == "AFFIRMATION":
            response_msg = "Glad to hear! Let me know what you'd like to explore next."
            suggestions = ["Show my projects", "Open RSK Traders", "Tile windows"]
        elif sub_intent == "EXPLAIN_REACT":
            response_msg = "React is an open-source JavaScript library developed by Meta for building dynamic, interactive user interfaces using reusable components and declarative state. It forms the core foundation of KAMVERSE and Kamalesh's frontend architecture!"
            suggestions = ["What is Python?", "Show my projects", "What technologies does he use?"]
        elif sub_intent == "EXPLAIN_PYTHON":
            response_msg = "Python is an intuitive, high-level programming language renowned for its clean syntax, versatility, and rich ecosystem across backend web development, AI, automation, and data engineering."
            suggestions = ["Show Python projects", "What is Django?", "Open JobSphere"]
        elif sub_intent == "EXPLAIN_DJANGO":
            response_msg = "Django is a high-level Python web framework designed for rapid development and clean, pragmatic architecture. Kamalesh leverages Django and Django REST Framework for robust, scalable backend platforms like College ERP."
            suggestions = ["Show Python projects", "Open College ERP", "What is React?"]
        elif sub_intent == "EXPLAIN_TAILWIND":
            response_msg = "Tailwind CSS is a utility-first CSS framework that allows engineers to compose beautiful, responsive custom designs directly in HTML. It powers KAMVERSE's crisp Neo-Brutalist design tokens!"
            suggestions = ["Show my projects", "What is React?", "Open RSK Traders"]

    # 5. WORKSPACE COMMANDS
    elif intent == INTENT_TYPES["WORKSPACE_COMMAND"]:
        if sub_intent == "MULTI_OPEN_ARRANGE":
            apps = []
            if any(k in p for k in ['rsk', 'trader']): apps.append(('rsk-traders', 'RSK Traders'))
            if any(k in p for k in ['job', 'sphere', 'jobspeher', 'jobspher', 'jobshere']): apps.append(('jobsphere', 'JobSphere'))
            if any(k in p for k in ['photo', 'camera']): apps.append(('photography', 'Photography'))
            if any(k in p for k in ['jewel', 'gold']): apps.append(('jewellery', 'Gold Jewellery'))
            if any(k in p for k in ['restaurant', 'food']): apps.append(('restaurant', 'Restaurant'))
            if any(k in p for k in ['erp', 'college']): apps.append(('college-erp', 'College ERP'))
            if any(k in p for k in ['trichy', 'preneur']): apps.append(('trichy-preneurs', 'TrichyPreneurs'))

            if len(apps) >= 2:
                for app_id, _ in apps:
                    actions.append({"type": "OPEN_APPLICATION", "value": app_id, "payload": {"applicationId": app_id}})
                actions.append({"type": "ARRANGE_WINDOWS", "value": "side-by-side", "payload": {"mode": "side-by-side", "applications": [a[0] for a in apps]}})
                response_msg = f"Opened {apps[0][1]} and {apps[1][1]} side-by-side."
                suggestions = ["Tile windows", "Close all windows", "Show my projects"]
            else:
                response_msg = "Please specify two applications to arrange side by side (e.g. RSK Traders and JobSphere)."
                suggestions = ["Open RSK Traders and JobSphere side-by-side", "Show my projects"]

        elif sub_intent == "OPEN_APP":
            app = resolve_application(p)
            target_id = app["id"] if app else "rsk-traders"
            target_name = app["short_name"] if app else "RSK Traders"
            actions.append({"type": "OPEN_APPLICATION", "value": target_id, "payload": {"applicationId": target_id}})
            response_msg = f"Opening your {target_name} project."
            suggestions = ["Tile windows", "Show my projects", "Close all windows"]

        elif sub_intent == "CLOSE_APP":
            app = resolve_application(p)
            target_id = app["id"] if app else "rsk-traders"
            target_name = app["short_name"] if app else "RSK Traders"
            actions.append({"type": "CLOSE_APPLICATION", "value": target_id, "payload": {"applicationId": target_id}})
            response_msg = f"{target_name} has been closed successfully."
            suggestions = ["Show my projects", "Open RSK Traders", "Close all windows"]

        elif sub_intent == "SWITCH_APP":
            app = resolve_application(p)
            target_id = app["id"] if app else "rsk-traders"
            target_name = app["short_name"] if app else "RSK Traders"
            actions.append({"type": "SWITCH_APPLICATION", "value": target_id, "payload": {"applicationId": target_id}})
            response_msg = f"Switching to your {target_name} window."
            suggestions = ["Maximize window", "Minimize window", "Show my projects"]

        elif sub_intent == "MINIMIZE_APP":
            app = resolve_application(p)
            target_id = app["id"] if app else "jobsphere"
            target_name = app["short_name"] if app else "JobSphere"
            actions.append({"type": "MINIMIZE_APPLICATION", "value": target_id, "payload": {"applicationId": target_id}})
            response_msg = f"Minimized {target_name} window."
            suggestions = [f"Restore {target_name}", "Show desktop", "Close all windows"]

        elif sub_intent == "RESTORE_APP":
            app = resolve_application(p)
            target_id = app["id"] if app else "jobsphere"
            target_name = app["short_name"] if app else "JobSphere"
            actions.append({"type": "RESTORE_APPLICATION", "value": target_id, "payload": {"applicationId": target_id}})
            response_msg = f"Restored {target_name} window."
            suggestions = [f"Maximize {target_name}", "Minimize {target_name}"]

        elif sub_intent == "MAXIMIZE_APP":
            app = resolve_application(p)
            target_id = app["id"] if app else "rsk-traders"
            target_name = app["short_name"] if app else "RSK Traders"
            actions.append({"type": "MAXIMIZE_APPLICATION", "value": target_id, "payload": {"applicationId": target_id}})
            response_msg = f"Maximized {target_name} window."
            suggestions = ["Restore window", "Close window", "Show desktop"]

        elif sub_intent == "FOCUS_PLANET":
            app = resolve_application(p)
            target_id = app["id"] if app else "jobsphere"
            target_name = app["short_name"] if app else "JobSphere"
            actions.append({"type": "FOCUS_PLANET", "value": target_id, "payload": {"planetId": target_id}})
            response_msg = f"Navigating 3D camera to {target_name} planet."
            suggestions = ["Reset the universe", f"Open {target_name}", "Go back to desktop"]

        elif sub_intent == "HIGHLIGHT_PYTHON":
            actions.append({"type": "HIGHLIGHT_TECH_PLANETS", "value": "Python", "payload": {"tech": "Python"}})
            response_msg = "Highlighting Python project planets in the 3D Universe."
            suggestions = ["Show JobSphere", "Open College ERP", "Reset the universe"]

        elif sub_intent == "RESET_UNIVERSE":
            actions.append({"type": "RESET_UNIVERSE", "value": "reset", "payload": {}})
            response_msg = "Reset 3D camera to cosmic orbital view."
            suggestions = ["Show JobSphere", "Show RSK Traders", "Go back to desktop"]

        elif sub_intent == "NAV_DESKTOP":
            actions.append({"type": "NAVIGATE", "value": "desktop", "payload": {"view": "desktop"}})
            response_msg = "Returned to the KAMVERSE desktop canvas."
            suggestions = ["Open RSK Traders", "Show my projects", "3D Universe"]

        elif sub_intent == "OPEN_PROJECTS":
            actions.append({"type": "NAVIGATE", "value": "projects", "payload": {"view": "projects"}})
            response_msg = "Opening your Projects Explorer! You can explore all public repositories and live projects."
            suggestions = ["Show Python projects", "Open RSK Traders", "Open Live Activity Center"]

        elif sub_intent == "ARRANGE_SIDE_BY_SIDE":
            actions.append({"type": "ARRANGE_WINDOWS", "value": "side-by-side", "payload": {"mode": "side-by-side"}})
            response_msg = "Arranged your active workspace windows side by side in split columns."
            suggestions = ["Tile windows", "Cascade windows", "Close all windows"]

        elif sub_intent == "CASCADE":
            actions.append({"type": "CASCADE_WINDOWS", "value": "cascade", "payload": {}})
            response_msg = "Cascaded all open windows with diagonal progressive stacking."
            suggestions = ["Tile windows", "Arrange side by side", "Show desktop"]

        elif sub_intent == "TILE":
            actions.append({"type": "TILE_WINDOWS", "value": "tile", "payload": {}})
            response_msg = "Tiled all active windows into a balanced desktop grid."
            suggestions = ["Arrange side by side", "Cascade windows", "Close all windows"]

        elif sub_intent == "CLOSE_ALL":
            actions.append({"type": "CLOSE_ALL_WINDOWS", "value": "all", "payload": {}})
            response_msg = "Closed all active windows and cleared your workspace."
            suggestions = ["Open RSK Traders", "Show my projects", "Who is Kamalesh?"]

        elif sub_intent == "MINIMIZE_ALL":
            actions.append({"type": "MINIMIZE_ALL_WINDOWS", "value": "all", "payload": {}})
            response_msg = "Minimized all windows down to the KAMVERSE desktop canvas."
            suggestions = ["Show my projects", "Open RSK Traders", "Tile windows"]

        elif sub_intent == "THEME_DARK":
            actions.append({"type": "SET_THEME", "value": "dark", "payload": {"theme": "dark"}})
            response_msg = "Activated the Midnight Dark theme (#151515). High-contrast dark visuals are now active."
            suggestions = ["Switch to yellow theme", "Switch to light theme", "Open RSK Traders"]

        elif sub_intent == "THEME_LIGHT":
            actions.append({"type": "SET_THEME", "value": "light", "payload": {"theme": "light"}})
            response_msg = "Activated the Clean Light theme (#F5F5F0) for daytime clarity."
            suggestions = ["Switch to yellow theme", "Enable dark mode", "Show my projects"]

        elif sub_intent == "THEME_YELLOW":
            actions.append({"type": "SET_THEME", "value": "yellow", "payload": {"theme": "yellow"}})
            response_msg = "Restored the signature Neo-Brutalist Yellow theme (#F5F04E)."
            suggestions = ["Enable dark mode", "Show my projects", "Open RSK Traders"]

        elif sub_intent == "FILTER_PYTHON":
            actions.append({"type": "FILTER_PROJECTS", "value": "Python", "payload": {"language": "Python"}})
            response_msg = "Navigated to Projects Explorer and applied the Python filter!"
            suggestions = ["Show my projects", "Open JobSphere", "Open College ERP"]

        elif sub_intent == "NAV_ACTIVITY":
            actions.append({"type": "NAVIGATE", "value": "activity", "payload": {"view": "activity"}})
            response_msg = "Opening the Live GitHub Activity Center. You can review latest commits, the 52-week contribution heatmap, and repository metrics in real-time!"
            suggestions = ["Show my projects", "Open RSK Traders", "Who is Kamalesh?"]

    # 6. GITHUB QUESTIONS
    elif intent == INTENT_TYPES["GITHUB_QUESTION"]:
        if sub_intent == "OPEN_GITHUB":
            actions.append({"type": "OPEN_GITHUB", "value": GITHUB_PROFILE_URL, "payload": {"url": GITHUB_PROFILE_URL}})
            response_msg = f"Opening Kamalesh's official GitHub profile (@{GITHUB_USERNAME}) in a secure new tab."
            suggestions = ["Show my projects", "Open Live Activity Center", "Who is Kamalesh?"]
        else:
            response_msg = f"Kamalesh's official GitHub account is @{GITHUB_USERNAME}. Would you like me to open his profile or the Live Activity Center?"
            suggestions = ["Open Live Activity Center", "Open GitHub", "Show my projects"]

    # 7. HELP / UNKNOWN FALLBACK
    else:
        response_msg = "I'm ready to assist you! You can chat with me, ask about Kamalesh's projects, or ask me to open and arrange workspace applications."
        suggestions = ["What can you do?", "Open RSK Traders", "Show my projects", "Who is Kamalesh?"]

    return {
        "message": response_msg,
        "response": response_msg,
        "text": response_msg,
        "actions": actions,
        "action": actions[0] if actions else None,
        "suggestions": suggestions
    }
