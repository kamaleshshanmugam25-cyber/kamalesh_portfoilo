/**
 * KAM AI - WORKSPACE OPERATOR & CONVERSATIONAL INTELLIGENCE ENGINE
 * 
 * Identity:
 * - Name: KAM AI
 * - Role: Personal AI Assistant and Workspace Operator
 * - Platform: KAMVERSE
 * - Creator: Kamalesh
 * - Personality: Friendly, intelligent, professional, confident and conversational.
 * 
 * Features:
 * - 9-Category Intelligent Intent Classification
 * - Direct conversational responses (never outputs raw lists of commands for normal conversation)
 * - Structured actions array with strict validation
 * - Technical topic explanations (React, Python, Django, Tailwind, Neo-Brutalism)
 * - Multi-turn conversation context awareness
 */

import { PROFILE } from '../config/profile.js';
import { APPLICATIONS } from '../config/applications.js';
import { GITHUB_USERNAME, GITHUB_PROFILE_URL } from '../config/projects.js';
import { resolveApplication } from '../config/applicationRegistry.js';

export const INTENT_TYPES = {
  GREETING: 'GREETING',
  GENERAL_CONVERSATION: 'GENERAL_CONVERSATION',
  IDENTITY_QUESTION: 'IDENTITY_QUESTION',
  CAPABILITY_QUESTION: 'CAPABILITY_QUESTION',
  PROJECT_QUESTION: 'PROJECT_QUESTION',
  WORKSPACE_COMMAND: 'WORKSPACE_COMMAND',
  GITHUB_QUESTION: 'GITHUB_QUESTION',
  HELP_REQUEST: 'HELP_REQUEST',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Intelligent Intent Classifier
 * Accurately categorizes visitor queries before generating responses.
 * Ensures normal conversational turns are NEVER misinterpreted as workspace commands.
 * 
 * @param {string} rawPrompt - User message text
 * @param {Array} history - Previous conversation messages
 * @returns {Object} { intent: string, subIntent?: string, entities?: Object }
 */
export const classifyIntent = (rawPrompt = '', history = []) => {
  const p = rawPrompt.trim().toLowerCase().replace(/[?!.,;]/g, '');

  // 1. GREETING
  const greetingExact = ['hi', 'hello', 'hey', 'heya', 'howdy', 'hola', 'yo', 'sup', 'greetings', 'hi chat', 'hello chat', 'hey chat'];
  const greetingPhrases = ['good morning', 'good afternoon', 'good evening', 'hi there', 'hello there', 'hey kam', 'hi chat', 'hello chat', 'hey chat'];
  if (greetingExact.includes(p) || greetingPhrases.some(phrase => p === phrase || p.startsWith(phrase + ' '))) {
    return { intent: INTENT_TYPES.GREETING };
  }

  // 2. IDENTITY QUESTION
  if (p.includes('are you there') || p === 'you there' || p === 'u there') {
    return { intent: INTENT_TYPES.IDENTITY_QUESTION, subIntent: 'PRESENCE' };
  }

  if (
    p.includes('your name') || 
    p === 'who are you' || 
    p.includes('what are you called') || 
    p.includes('what is your name') || 
    p.includes('whats your name')
  ) {
    return { intent: INTENT_TYPES.IDENTITY_QUESTION, subIntent: 'NAME' };
  }

  if (
    p.includes('who created you') || 
    p.includes('who made you') || 
    p.includes('who built you') || 
    p.includes('who developed you') || 
    p.includes('your creator') || 
    p.includes('who is your creator')
  ) {
    return { intent: INTENT_TYPES.IDENTITY_QUESTION, subIntent: 'CREATOR' };
  }

  if (
    p.includes('are you intelligent') || 
    p.includes('are you smart') || 
    p.includes('how smart are you') || 
    p.includes('are you an ai') || 
    p.includes('are you ai')
  ) {
    return { intent: INTENT_TYPES.IDENTITY_QUESTION, subIntent: 'INTELLIGENCE' };
  }

  if (
    p.includes('tell me about yourself') || 
    p.includes('about yourself') || 
    p.includes('introduce yourself') || 
    p.includes('describe yourself')
  ) {
    return { intent: INTENT_TYPES.IDENTITY_QUESTION, subIntent: 'SELF_INTRO' };
  }

  if (
    p.includes('who is kamalesh') || 
    p.includes('about kamalesh') || 
    p.includes('tell me about kamalesh') || 
    p.includes('who is the developer')
  ) {
    return { intent: INTENT_TYPES.IDENTITY_QUESTION, subIntent: 'ABOUT_KAMALESH' };
  }

  // 3. CAPABILITY QUESTION
  if (
    p.includes('what can you do') || 
    p.includes('what are your capabilities') || 
    p.includes('what do you do') || 
    p.includes('what can i ask you') || 
    p.includes('how can you help') || 
    p.includes('what can you help me with') || 
    p.includes('your features')
  ) {
    return { intent: INTENT_TYPES.CAPABILITY_QUESTION };
  }

  // 4. GENERAL CONVERSATION (Thank you, small talk, tech explanations)
  if (
    p === 'thank you' || 
    p === 'thanks' || 
    p === 'thanks a lot' || 
    p === 'thank u' || 
    p === 'thx' || 
    p.startsWith('thank you') || 
    p.startsWith('thanks') || 
    p.includes('appreciate it')
  ) {
    return { intent: INTENT_TYPES.GENERAL_CONVERSATION, subIntent: 'GRATITUDE' };
  }

  if (p === 'how are you' || p === 'how are you doing' || p === 'hows it going' || p === "what's up") {
    return { intent: INTENT_TYPES.GENERAL_CONVERSATION, subIntent: 'STATUS_CHECK' };
  }

  if (p === 'goodbye' || p === 'bye' || p === 'see you' || p === 'cya') {
    return { intent: INTENT_TYPES.GENERAL_CONVERSATION, subIntent: 'FAREWELL' };
  }

  if (['cool', 'awesome', 'nice', 'great', 'perfect', 'good', 'sweet', 'ok', 'okay'].includes(p)) {
    return { intent: INTENT_TYPES.GENERAL_CONVERSATION, subIntent: 'AFFIRMATION' };
  }

  // Technical explanation questions
  if (p.includes('what is react') || p.includes('explain react') || p.includes('tell me about react')) {
    return { intent: INTENT_TYPES.GENERAL_CONVERSATION, subIntent: 'EXPLAIN_REACT' };
  }
  if (p.includes('what is python') || p.includes('explain python') || p.includes('tell me about python')) {
    return { intent: INTENT_TYPES.GENERAL_CONVERSATION, subIntent: 'EXPLAIN_PYTHON' };
  }
  if (p.includes('what is django') || p.includes('explain django') || p.includes('tell me about django')) {
    return { intent: INTENT_TYPES.GENERAL_CONVERSATION, subIntent: 'EXPLAIN_DJANGO' };
  }
  if (p.includes('what is tailwind') || p.includes('explain tailwind')) {
    return { intent: INTENT_TYPES.GENERAL_CONVERSATION, subIntent: 'EXPLAIN_TAILWIND' };
  }
  if (p.includes('what is neo brutalism') || p.includes('explain neo brutalism') || p.includes('neo-brutalism')) {
    return { intent: INTENT_TYPES.GENERAL_CONVERSATION, subIntent: 'EXPLAIN_NEO_BRUTALISM' };
  }

  // 5. WORKSPACE COMMANDS
  // Local Runtime Engine Fleet Commands
  if (p.includes('start all') || p.includes('boot all') || p.includes('run all projects') || p.includes('launch all')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'START_ALL_APPS' };
  }
  if (p.includes('stop all') || p.includes('kill all') || p.includes('shut down all')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'STOP_ALL_APPS' };
  }
  if (p.includes('restart all') || p.includes('reboot all')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'RESTART_ALL_APPS' };
  }
  if (p.includes('runtime manager') || p.includes('running apps') || p.includes('which projects are running') || p.includes('show fleet') || p === 'runtime') {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'NAV_RUNTIME' };
  }
  if (p.startsWith('logs ') || p.includes('show logs') || p.includes('view logs')) {
    const clean = p.replace('show logs for ', '').replace('show logs of ', '').replace('logs for ', '').replace('logs of ', '').replace('logs ', '').replace('view logs ', '');
    if (resolveApplication(clean) || resolveApplication(p)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'SHOW_APP_LOGS' };
    }
  }
  if (p.startsWith('start ') || p.startsWith('run ') || p.startsWith('boot ')) {
    const clean = p.replace('start ', '').replace('run ', '').replace('boot ', '').replace(' project', '').replace(' app', '');
    if (resolveApplication(clean)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'START_LOCAL_APP' };
    }
  }
  if (p.startsWith('stop ') || p.startsWith('kill ') || p.startsWith('halt ')) {
    const clean = p.replace('stop ', '').replace('kill ', '').replace('halt ', '').replace(' project', '').replace(' app', '');
    if (resolveApplication(clean)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'STOP_LOCAL_APP' };
    }
  }
  if (p.startsWith('restart ') || p.startsWith('reboot ')) {
    const clean = p.replace('restart ', '').replace('reboot ', '').replace(' project', '').replace(' app', '');
    if (resolveApplication(clean)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'RESTART_LOCAL_APP' };
    }
  }

  // Multi-step commands (open X and Y side by side)
  if ((p.includes('open') || p.includes('launch')) && (p.includes('side by side') || p.includes('side-by-side') || p.includes('and arrange') || p.includes('together') || (p.includes('and') && (p.includes('side') || p.includes('arrange'))))) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'MULTI_OPEN_ARRANGE' };
  }

  // Window arrangement
  if (p.includes('side by side') || p.includes('side-by-side') || (p.includes('arrange') && p.includes('windows'))) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'ARRANGE_SIDE_BY_SIDE' };
  }
  if (p.includes('cascade')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'CASCADE' };
  }
  if (p.includes('tile') || (p.includes('grid') && p.includes('window'))) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'TILE' };
  }
  if (p.includes('close all') || p.includes('close everything') || p.includes('shut all')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'CLOSE_ALL' };
  }
  if (p.includes('minimize all') || p.includes('clear screen')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'MINIMIZE_ALL' };
  }
  if (p.includes('go back to desktop') || p.includes('go to desktop') || p.includes('back to desktop') || p.includes('show desktop') || p.includes('return to desktop')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'NAV_DESKTOP' };
  }

  // 3D Universe
  if (p.includes('reset the universe') || p.includes('reset universe')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'RESET_UNIVERSE' };
  }
  if (p.includes('python projects') || p.includes('show python') || p.includes('show my python')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'HIGHLIGHT_PYTHON' };
  }
  if (p.includes('react projects') || p.includes('show react') || p.includes('filter by react')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'FILTER_REACT' };
  }
  if (p.includes('featured projects')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'FILTER_FEATURED' };
  }

  // App Switch / Tab Commands
  if (p.endsWith(' tab') || p.startsWith('switch to ') || p.startsWith('bring ') || p.startsWith('focus ') || p.startsWith('go to ')) {
    const clean = p.replace(' tab', '').replace('switch to ', '').replace('bring ', '').replace('focus ', '').replace('go to ', '').replace(' to front', '').replace(' window', '');
    if (resolveApplication(clean) || resolveApplication(p)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'SWITCH_APP' };
    }
  }

  // Restore Window
  if (p.startsWith('restore ') || p.startsWith('unminimize ')) {
    const clean = p.replace('restore ', '').replace('unminimize ', '').replace(' window', '');
    if (resolveApplication(clean) || resolveApplication(p)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'RESTORE_APP' };
    }
  }

  // Close Application
  if (p.startsWith('close ') || p.startsWith('exit ')) {
    const clean = p.replace('close ', '').replace('exit ', '').replace(' window', '');
    if (resolveApplication(clean) || resolveApplication(p)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'CLOSE_APP' };
    }
  }

  // Minimize Application
  if (p.startsWith('minimize ')) {
    const clean = p.replace('minimize ', '').replace(' window', '');
    if (resolveApplication(clean) || resolveApplication(p)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'MINIMIZE_APP' };
    }
  }

  // Maximize Application
  if (p.startsWith('maximize ') || p.includes('full screen')) {
    const clean = p.replace('maximize ', '').replace('make ', '').replace(' full screen', '').replace(' window', '');
    if (resolveApplication(clean) || resolveApplication(p)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'MAXIMIZE_APP' };
    }
  }

  // 3D Universe focus planet
  if (p.startsWith('show ') && !p.startsWith('show my projects') && !p.startsWith('show projects')) {
    const clean = p.replace('show ', '').replace(' planet', '').replace(' website', '');
    if (resolveApplication(clean)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'FOCUS_PLANET' };
    }
  }

  // Open Application
  if (p.startsWith('open ') || p.startsWith('launch ') || p.startsWith('start ') || p.startsWith('view ') || p.startsWith('show my ')) {
    const clean = p.replace('open ', '').replace('launch ', '').replace('start ', '').replace('view ', '').replace('show my ', '').replace(' website', '');
    if (resolveApplication(clean) || resolveApplication(p)) {
      return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'OPEN_APP' };
    }
  }

  // Project Filters (e.g. show python projects)
  if (p.includes('python projects') || p.includes('show python') || p.includes('filter by python')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'FILTER_PYTHON' };
  }
  if (p.includes('react projects') || p.includes('show react') || p.includes('filter by react')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'FILTER_REACT' };
  }
  if (p.includes('featured projects')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'FILTER_FEATURED' };
  }

  // Navigation commands
  if (p.includes('open terminal') || p.includes('launch terminal') || p === 'terminal') {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'NAV_TERMINAL' };
  }
  if (p.includes('open contact') || p.includes('contact page') || p.includes('hire page') || p === 'contact') {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'NAV_CONTACT' };
  }
  if (p.includes('open about') || p.includes('about page')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'NAV_ABOUT' };
  }
  if (p.includes('open activity') || p.includes('activity center') || p.includes('show activity') || p.includes('latest commits') || p.includes('show commits') || p.includes('heatmap')) {
    return { intent: INTENT_TYPES.WORKSPACE_COMMAND, subIntent: 'NAV_ACTIVITY' };
  }

  // 6. GITHUB QUESTIONS & ACTIONS
  if (p.includes('open github') || p.includes('take me to github') || p.includes('visit github') || p === 'github') {
    return { intent: INTENT_TYPES.GITHUB_QUESTION, subIntent: 'OPEN_GITHUB' };
  }
  if (p.includes('github profile') || p.includes('his github') || p.includes('github account')) {
    return { intent: INTENT_TYPES.GITHUB_QUESTION, subIntent: 'INFO_GITHUB' };
  }

  // 7. PROJECT QUESTIONS (Inquiries without command)
  if (
    p.includes('what is rsk') || 
    p.includes('tell me about rsk') || 
    p.includes('what is jobsphere') || 
    p.includes('what is college erp') || 
    p.includes('skills') || 
    p.includes('technologies') || 
    p.includes('tech stack') || 
    p.includes('what does he use')
  ) {
    return { intent: INTENT_TYPES.PROJECT_QUESTION };
  }

  // 8. HELP REQUEST
  if (p === 'help' || p === 'help me' || p.includes('how to use') || p.includes('what commands')) {
    return { intent: INTENT_TYPES.HELP_REQUEST };
  }

  // 9. UNKNOWN
  return { intent: INTENT_TYPES.UNKNOWN };
};

/**
 * Generate an intelligent response and navigation actions for a user prompt
 * 
 * @param {string} prompt - User message
 * @param {Array} gitHubProjects - Synced GitHub repositories from context
 * @param {Array} history - Previous conversation messages
 * @returns {Object} { message: string, text: string, response: string, actions: Array<Object>, action: Object|null, suggestions: Array<string> }
 */
export const queryKnowledgeEngine = (prompt = '', gitHubProjects = [], history = []) => {
  const p = prompt.trim();
  const lower = p.toLowerCase();
  const actions = [];
  let message = '';
  let suggestions = [];

  // Step 1: Classify user intent
  const { intent, subIntent } = classifyIntent(prompt, history);

  // Step 2: Route by intent category
  switch (intent) {

    // ============================================================
    // 1. GREETING
    // ============================================================
    case INTENT_TYPES.GREETING: {
      message = "Hey! 👋 Welcome back. What are we working on today?";
      suggestions = [
        'Open RSK Traders',
        'Show my projects',
        'What can you do?',
        'Who is Kamalesh?'
      ];
      break;
    }

    // ============================================================
    // 2. IDENTITY QUESTIONS
    // ============================================================
    case INTENT_TYPES.IDENTITY_QUESTION: {
      if (subIntent === 'PRESENCE') {
        message = "Always ready! What would you like me to do?";
        suggestions = ['What can you do?', 'Open RSK Traders', 'Show my projects'];
      } else if (subIntent === 'NAME') {
        message = "I'm KAM AI, your personal AI assistant inside KAMVERSE! ⚡";
        suggestions = ['What can you do?', 'Who created you?', 'Show my projects'];
      } else if (subIntent === 'CREATOR') {
        message = "I was created for Kamalesh's KAMVERSE digital workspace.";
        suggestions = ['Who is Kamalesh?', 'What can you do?', 'Show my projects'];
      } else if (subIntent === 'INTELLIGENCE') {
        message = "I'm designed to understand your requests, assist with your projects and control your KAMVERSE workspace.";
        suggestions = ['What can you do?', 'Open RSK Traders', 'Show my projects'];
      } else if (subIntent === 'SELF_INTRO') {
        message = "I'm KAM AI, your personal assistant and workspace operator inside KAMVERSE. I was created for Kamalesh to help visitors explore projects, discuss technologies, and control this interactive digital workspace using natural language.";
        suggestions = ['What can you do?', 'Show my projects', 'Who is Kamalesh?'];
      } else if (subIntent === 'ABOUT_KAMALESH') {
        message = `Kamalesh is a Senior UI/UX Designer, Creative Frontend Architect and Full-Stack Developer with 8+ years of enterprise experience building modern digital ecosystems.`;
        suggestions = ['What technologies does he use?', 'Show my projects', 'Contact Kamalesh'];
      }
      break;
    }

    // ============================================================
    // 3. CAPABILITY QUESTIONS
    // ============================================================
    case INTENT_TYPES.CAPABILITY_QUESTION: {
      message = "I can open applications, manage windows, search your projects, explore GitHub activity and customize your workspace.";
      suggestions = [
        'Open RSK Traders',
        'Show my projects',
        'Open RSK Traders and JobSphere side-by-side',
        'Enable dark mode'
      ];
      break;
    }

    // ============================================================
    // 4. GENERAL CONVERSATION (Thank you, small talk, technical topics)
    // ============================================================
    case INTENT_TYPES.GENERAL_CONVERSATION: {
      if (subIntent === 'GRATITUDE') {
        message = "You're welcome! Happy to help.";
        suggestions = ['Show my projects', 'What can you do?', 'Open RSK Traders'];
      } else if (subIntent === 'STATUS_CHECK') {
        message = "I'm running smoothly at 100% and ready to assist! How are things with you?";
        suggestions = ['What can you do?', 'Show my projects', 'Open RSK Traders'];
      } else if (subIntent === 'FAREWELL') {
        message = "Goodbye! Feel free to summon me anytime you need assistance in KAMVERSE. 👋";
        suggestions = ['Hi', 'Open RSK Traders', 'Show my projects'];
      } else if (subIntent === 'AFFIRMATION') {
        message = "Glad to hear! Let me know what you'd like to explore next.";
        suggestions = ['Show my projects', 'Open RSK Traders', 'Tile windows'];
      } else if (subIntent === 'EXPLAIN_REACT') {
        message = "React is an open-source JavaScript library developed by Meta for building dynamic, interactive user interfaces using reusable components and declarative state. It forms the core foundation of KAMVERSE and Kamalesh's frontend architecture!";
        suggestions = ['What is Python?', 'Show my projects', 'What technologies does he use?'];
      } else if (subIntent === 'EXPLAIN_PYTHON') {
        message = "Python is an intuitive, high-level programming language renowned for its clean syntax, versatility, and rich ecosystem across backend web development, AI, automation, and data engineering.";
        suggestions = ['Show Python projects', 'What is Django?', 'Open JobSphere'];
      } else if (subIntent === 'EXPLAIN_DJANGO') {
        message = "Django is a high-level Python web framework designed for rapid development and clean, pragmatic architecture. Kamalesh leverages Django and Django REST Framework for robust, scalable backend platforms like College ERP.";
        suggestions = ['Show Python projects', 'Open College ERP', 'What is React?'];
      } else if (subIntent === 'EXPLAIN_TAILWIND') {
        message = "Tailwind CSS is a utility-first CSS framework that allows engineers to compose beautiful, responsive custom designs directly in HTML without writing repetitive stylesheets. It powers KAMVERSE's crisp Neo-Brutalist design tokens!";
        suggestions = ['What is Neo-Brutalism?', 'Show my projects', 'What is React?'];
      } else if (subIntent === 'EXPLAIN_NEO_BRUTALISM') {
        message = "Neo-Brutalism is a bold modern design aesthetic characterized by vibrant saturated colors (like our signature #F5F04E yellow), thick black borders (#151515), hard offset drop shadows, and expressive typography that stand out against conventional muted UI design.";
        suggestions = ['Switch to dark theme', 'Open RSK Traders', 'Show my projects'];
      }
      break;
    }

    // ============================================================
    // 5. PROJECT QUESTIONS (Inquiries without command)
    // ============================================================
    case INTENT_TYPES.PROJECT_QUESTION: {
      if (lower.includes('rsk') || lower.includes('traders')) {
        message = "RSK TRADERS is an international import & export enterprise platform engineered by Kamalesh for global trade, commodity logistics, and supply chain operations. Would you like me to open it?";
        suggestions = ['Open RSK Traders', 'Show my projects', 'What technologies does he use?'];
      } else if (lower.includes('jobsphere')) {
        message = "JobSphere is a modern tech job aggregation platform featuring AI candidate matching, salary analytics, and applicant tracking. Engineered with React and Django.";
        suggestions = ['Open JobSphere', 'Show Python projects', 'Show my projects'];
      } else if (lower.includes('college') || lower.includes('erp')) {
        message = "College ERP is an institutional campus management system handling student records, faculty modules, fee processing, and examinations for over 10,000 users.";
        suggestions = ['Open College ERP', 'Show Python projects', 'Show my projects'];
      } else if (lower.includes('skills') || lower.includes('technologies') || lower.includes('tech stack')) {
        message = "Kamalesh's core stack includes React, Tailwind CSS, JavaScript (ESNext), Python, Django, Django REST Framework, PostgreSQL, and scalable design systems. I can open his skills view if you'd like!";
        suggestions = ['Open About page', 'Show my projects', 'Show Python projects'];
      } else {
        message = "Kamalesh has engineered 6 flagship applications and 13 public repositories spanning enterprise systems, e-commerce, and SaaS platforms.";
        suggestions = ['Show my projects', 'Open RSK Traders', 'What can you do?'];
      }
      break;
    }

    // ============================================================
    // 6. WORKSPACE COMMANDS
    // ============================================================
    case INTENT_TYPES.WORKSPACE_COMMAND: {
      if (subIntent === 'START_ALL_APPS') {
        actions.push({ type: 'START_ALL_APPLICATIONS' });
        message = "Starting all enabled local applications sequentially...";
        suggestions = ['Stop all projects', 'Runtime Manager', 'Which projects are running?'];
      } else if (subIntent === 'STOP_ALL_APPS') {
        actions.push({ type: 'STOP_ALL_APPLICATIONS' });
        message = "Stopping all managed development applications...";
        suggestions = ['Start all projects', 'Runtime Manager', 'Show my projects'];
      } else if (subIntent === 'RESTART_ALL_APPS') {
        actions.push({ type: 'RESTART_ALL_APPLICATIONS' });
        message = "Restarting all managed development applications...";
        suggestions = ['Runtime Manager', 'Close all windows'];
      } else if (subIntent === 'NAV_RUNTIME') {
        actions.push({ type: 'OPEN_RUNTIME_MANAGER' });
        message = "Opening the Local Application Runtime Engine dashboard.";
        suggestions = ['Start all projects', 'Stop all projects', 'Show my projects'];
      } else if (subIntent === 'SHOW_APP_LOGS') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'rsk-traders';
        const targetName = app ? app.shortName : 'RSK Traders';
        actions.push({
          type: 'SHOW_APPLICATION_LOGS',
          value: targetId,
          payload: { applicationId: targetId }
        });
        message = `Opening live execution logs for ${targetName}.`;
        suggestions = [`Start ${targetName}`, `Stop ${targetName}`, 'Runtime Manager'];
      } else if (subIntent === 'START_LOCAL_APP') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'rsk-traders';
        const targetName = app ? app.shortName : 'RSK Traders';
        actions.push({
          type: 'START_LOCAL_APPLICATION',
          value: targetId,
          payload: { applicationId: targetId }
        });
        message = `Starting ${targetName} development server on port ${app ? app.port : 5174}...`;
        suggestions = [`Show logs for ${targetName}`, `Stop ${targetName}`, 'Runtime Manager'];
      } else if (subIntent === 'STOP_LOCAL_APP') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'rsk-traders';
        const targetName = app ? app.shortName : 'RSK Traders';
        actions.push({
          type: 'STOP_LOCAL_APPLICATION',
          value: targetId,
          payload: { applicationId: targetId }
        });
        message = `Stopping managed process for ${targetName}.`;
        suggestions = [`Start ${targetName}`, 'Runtime Manager', 'Show my projects'];
      } else if (subIntent === 'RESTART_LOCAL_APP') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'rsk-traders';
        const targetName = app ? app.shortName : 'RSK Traders';
        actions.push({
          type: 'RESTART_LOCAL_APPLICATION',
          value: targetId,
          payload: { applicationId: targetId }
        });
        message = `Restarting ${targetName} process...`;
        suggestions = [`Show logs for ${targetName}`, 'Runtime Manager'];
      } else if (subIntent === 'MULTI_OPEN_ARRANGE') {
        const appsToOpen = [];
        if (lower.includes('rsk') || lower.includes('trader')) appsToOpen.push({ id: 'rsk-traders', name: 'RSK Traders' });
        if (lower.includes('job') || lower.includes('sphere') || lower.includes('jobspeher') || lower.includes('jobspher') || lower.includes('jobshere')) appsToOpen.push({ id: 'jobsphere', name: 'JobSphere' });
        if (lower.includes('photo') || lower.includes('camera')) appsToOpen.push({ id: 'photography', name: 'Photography' });
        if (lower.includes('jewel') || lower.includes('gold')) appsToOpen.push({ id: 'jewellery', name: 'Gold Jewellery' });
        if (lower.includes('restaurant') || lower.includes('food')) appsToOpen.push({ id: 'restaurant', name: 'Restaurant' });
        if (lower.includes('erp') || lower.includes('college')) appsToOpen.push({ id: 'college-erp', name: 'College ERP' });

        if (appsToOpen.length >= 2) {
          appsToOpen.forEach(app => {
            actions.push({
              type: 'OPEN_APPLICATION',
              value: app.id,
              payload: { applicationId: app.id }
            });
          });
          actions.push({
            type: 'ARRANGE_WINDOWS',
            value: 'side-by-side',
            payload: { mode: 'side-by-side', applications: appsToOpen.map(a => a.id) }
          });
          message = `Opened ${appsToOpen.map(a => a.name).join(' and ')} side-by-side.`;
          suggestions = ['Tile windows', 'Close all windows', 'Show my projects'];
        } else {
          message = "Please specify at least two applications to arrange side by side (e.g. RSK Traders and JobSphere).";
          suggestions = ['Open RSK Traders and JobSphere side-by-side', 'Show my projects'];
        }
      } else if (subIntent === 'OPEN_APP') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'rsk-traders';
        const targetName = app ? app.shortName : 'RSK Traders';

        actions.push({
          type: 'OPEN_APPLICATION',
          value: targetId,
          payload: { applicationId: targetId }
        });
        message = `Opening your ${targetName} project.`;
        suggestions = ['Tile windows', 'Show my projects', 'Close all windows'];
      } else if (subIntent === 'CLOSE_APP') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'rsk-traders';
        const targetName = app ? app.shortName : 'RSK Traders';

        actions.push({
          type: 'CLOSE_APPLICATION',
          value: targetId,
          payload: { applicationId: targetId }
        });
        message = `${targetName} has been closed successfully.`;
        suggestions = ['Show my projects', 'Open RSK Traders', 'Close all windows'];
      } else if (subIntent === 'SWITCH_APP') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'rsk-traders';
        const targetName = app ? app.shortName : 'RSK Traders';

        actions.push({
          type: 'SWITCH_APPLICATION',
          value: targetId,
          payload: { applicationId: targetId }
        });
        message = `Switching to your ${targetName} window.`;
        suggestions = ['Maximize window', 'Minimize window', 'Show my projects'];
      } else if (subIntent === 'MINIMIZE_APP') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'jobsphere';
        const targetName = app ? app.shortName : 'JobSphere';

        actions.push({
          type: 'MINIMIZE_APPLICATION',
          value: targetId,
          payload: { applicationId: targetId }
        });
        message = `Minimized ${targetName} window.`;
        suggestions = [`Restore ${targetName}`, 'Show desktop', 'Close all windows'];
      } else if (subIntent === 'RESTORE_APP') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'jobsphere';
        const targetName = app ? app.shortName : 'JobSphere';

        actions.push({
          type: 'RESTORE_APPLICATION',
          value: targetId,
          payload: { applicationId: targetId }
        });
        message = `Restored ${targetName} window.`;
        suggestions = [`Maximize ${targetName}`, `Minimize ${targetName}`];
      } else if (subIntent === 'MAXIMIZE_APP') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'rsk-traders';
        const targetName = app ? app.shortName : 'RSK Traders';

        actions.push({
          type: 'MAXIMIZE_APPLICATION',
          value: targetId,
          payload: { applicationId: targetId }
        });
        message = `Maximized ${targetName} window.`;
        suggestions = ['Restore window', 'Close window', 'Show desktop'];
      } else if (subIntent === 'FOCUS_PLANET') {
        const app = resolveApplication(lower);
        const targetId = app ? app.id : 'jobsphere';
        const targetName = app ? app.shortName : 'JobSphere';

        actions.push({
          type: 'FOCUS_PLANET',
          value: targetId,
          payload: { planetId: targetId }
        });
        message = `Navigating 3D camera to ${targetName} planet.`;
        suggestions = ['Reset the universe', `Open ${targetName}`, 'Go back to desktop'];
      } else if (subIntent === 'HIGHLIGHT_PYTHON') {
        actions.push({
          type: 'HIGHLIGHT_TECH_PLANETS',
          value: 'Python',
          payload: { tech: 'Python' }
        });
        message = 'Highlighting Python project planets in the 3D Universe.';
        suggestions = ['Show JobSphere', 'Open College ERP', 'Reset the universe'];
      } else if (subIntent === 'RESET_UNIVERSE') {
        actions.push({
          type: 'RESET_UNIVERSE',
          value: 'reset',
          payload: {}
        });
        message = 'Reset 3D camera to cosmic orbital view.';
        suggestions = ['Show JobSphere', 'Show RSK Traders', 'Go back to desktop'];
      } else if (subIntent === 'NAV_DESKTOP') {
        actions.push({
          type: 'NAVIGATE',
          value: 'desktop',
          payload: { view: 'desktop' }
        });
        message = 'Returned to the KAMVERSE desktop canvas.';
        suggestions = ['Open RSK Traders', 'Show my projects', '3D Universe'];
      } else if (subIntent === 'OPEN_PROJECTS') {
        actions.push({
          type: 'NAVIGATE',
          value: 'projects',
          payload: { view: 'projects' }
        });
        message = `Opening your Projects Explorer! You can explore all ${gitHubProjects.length || 13} public repositories and live projects.`;
        suggestions = ['Show Python projects', 'Open RSK Traders', 'Open Live Activity Center'];
      } else if (subIntent === 'ARRANGE_SIDE_BY_SIDE') {
        actions.push({
          type: 'ARRANGE_WINDOWS',
          value: 'side-by-side',
          payload: { mode: 'side-by-side' }
        });
        message = "Arranged your active workspace windows side by side in split columns.";
        suggestions = ['Tile windows', 'Cascade windows', 'Close all windows'];
      } else if (subIntent === 'CASCADE') {
        actions.push({
          type: 'CASCADE_WINDOWS',
          value: 'cascade',
          payload: {}
        });
        message = "Cascaded all open windows with diagonal progressive stacking.";
        suggestions = ['Tile windows', 'Arrange side by side', 'Show desktop'];
      } else if (subIntent === 'TILE') {
        actions.push({
          type: 'TILE_WINDOWS',
          value: 'tile',
          payload: {}
        });
        message = "Tiled all active windows into a balanced desktop grid.";
        suggestions = ['Arrange side by side', 'Cascade windows', 'Close all windows'];
      } else if (subIntent === 'CLOSE_ALL') {
        actions.push({ type: 'CLOSE_ALL_WINDOWS', value: 'all', payload: {} });
        message = "Closed all active windows and cleared your workspace.";
        suggestions = ['Open RSK Traders', 'Show my projects', 'Who is Kamalesh?'];
      } else if (subIntent === 'MINIMIZE_ALL') {
        actions.push({ type: 'MINIMIZE_ALL_WINDOWS', value: 'all', payload: {} });
        message = "Minimized all windows down to the KAMVERSE desktop canvas.";
        suggestions = ['Show my projects', 'Open RSK Traders', 'Tile windows'];
      } else if (subIntent === 'THEME_DARK') {
        actions.push({ type: 'SET_THEME', value: 'dark', payload: { theme: 'dark' } });
        message = "Activated the Midnight Dark theme (#151515). High-contrast dark visuals are now active.";
        suggestions = ['Switch to yellow theme', 'Switch to light theme', 'Open RSK Traders'];
      } else if (subIntent === 'THEME_LIGHT') {
        actions.push({ type: 'SET_THEME', value: 'light', payload: { theme: 'light' } });
        message = "Activated the Clean Light theme (#F5F5F0) for daytime clarity.";
        suggestions = ['Switch to yellow theme', 'Enable dark mode', 'Show my projects'];
      } else if (subIntent === 'THEME_YELLOW') {
        actions.push({ type: 'SET_THEME', value: 'yellow', payload: { theme: 'yellow' } });
        message = "Restored the signature Neo-Brutalist Yellow theme (#F5F04E).";
        suggestions = ['Enable dark mode', 'Show my projects', 'Open RSK Traders'];
      } else if (subIntent === 'DOCK_HIDE') {
        actions.push({ type: 'SET_DOCK_VISIBILITY', value: false, payload: { visible: false } });
        message = "Hidden the bottom macOS dock to give you maximum canvas space.";
        suggestions = ['Show dock', 'Open RSK Traders', 'Show my projects'];
      } else if (subIntent === 'DOCK_SHOW') {
        actions.push({ type: 'SET_DOCK_VISIBILITY', value: true, payload: { visible: true } });
        message = "Bottom macOS dock is now visible.";
        suggestions = ['Hide dock', 'Show my projects', 'Tile windows'];
      } else if (subIntent === 'FILTER_PYTHON') {
        actions.push({ type: 'FILTER_PROJECTS', value: 'Python', payload: { language: 'Python' } });
        message = "Navigated to Projects Explorer and applied the Python filter!";
        suggestions = ['Show my projects', 'Open JobSphere', 'Open College ERP'];
      } else if (subIntent === 'FILTER_REACT') {
        actions.push({ type: 'FILTER_PROJECTS', value: 'JavaScript', payload: { language: 'JavaScript' } });
        message = "Navigated to Projects Explorer with the React / JavaScript filter applied!";
        suggestions = ['Show my projects', 'Open RSK Traders', 'Show Python projects'];
      } else if (subIntent === 'FILTER_FEATURED') {
        actions.push({ type: 'SHOW_FEATURED_PROJECTS', value: 'featured', payload: { featuredOnly: true } });
        message = "Showing Kamalesh's featured flagship applications in the Projects Explorer!";
        suggestions = ['Show my projects', 'Open RSK Traders', 'Show Python projects'];
      } else if (subIntent === 'NAV_TERMINAL') {
        actions.push({ type: 'NAVIGATE', value: 'terminal', payload: { view: 'terminal' } });
        message = "Opening the interactive Developer Terminal for you!";
        suggestions = ['Show my projects', 'Take me home', 'Tile windows'];
      } else if (subIntent === 'NAV_CONTACT') {
        actions.push({ type: 'NAVIGATE', value: 'contact', payload: { view: 'contact' } });
        message = `Opening the Contact portal. You can reach Kamalesh at ${PROFILE.email}.`;
        suggestions = ['Who is Kamalesh?', 'Show my projects', 'Open RSK Traders'];
      } else if (subIntent === 'NAV_ABOUT') {
        actions.push({ type: 'NAVIGATE', value: 'about', payload: { view: 'about' } });
        message = "Opening About Kamalesh profile window.";
        suggestions = ['What technologies does he use?', 'Show my projects', 'Contact Kamalesh'];
      } else if (subIntent === 'NAV_ACTIVITY') {
        actions.push({ type: 'NAVIGATE', value: 'activity', payload: { view: 'activity' } });
        message = "Opening the Live GitHub Activity Center. You can review latest commits, the 52-week contribution heatmap, and repository metrics in real-time!";
        suggestions = ['Show my projects', 'Open RSK Traders', 'Who is Kamalesh?'];
      }
      break;
    }

    // ============================================================
    // 7. GITHUB QUESTIONS & ACTIONS
    // ============================================================
    case INTENT_TYPES.GITHUB_QUESTION: {
      if (subIntent === 'OPEN_GITHUB') {
        actions.push({
          type: 'OPEN_GITHUB',
          value: GITHUB_PROFILE_URL,
          payload: { url: GITHUB_PROFILE_URL }
        });
        message = `Opening Kamalesh's official GitHub profile (@${GITHUB_USERNAME}) in a secure new tab.`;
        suggestions = ['Show my projects', 'Open Live Activity Center', 'Who is Kamalesh?'];
      } else {
        message = `Kamalesh's GitHub username is @${GITHUB_USERNAME}. He has ${gitHubProjects.length || 13} public repositories synchronized in KAMVERSE. Would you like me to open his GitHub profile or the Live Activity Center?`;
        suggestions = ['Open Live Activity Center', 'Open GitHub', 'Show my projects'];
      }
      break;
    }

    // ============================================================
    // 8. HELP REQUEST
    // ============================================================
    case INTENT_TYPES.HELP_REQUEST: {
      message = "You can chat with me normally, ask about Kamalesh's experience and technologies, or command me to control the workspace:\n\n• Open applications (e.g. *'Open RSK Traders'*)\n• Multi-window arrange (*'Open RSK Traders and Photography side by side'*)\n• Window layouts (*'Tile windows'*, *'Cascade windows'*, *'Close all'*)\n• Themes (*'Enable dark mode'*, *'Yellow theme'*)\n• Exploration (*'Show my projects'*, *'Show latest commits'*)\n\nWhat would you like to do?";
      suggestions = ['Open RSK Traders', 'Show my projects', 'Who is Kamalesh?'];
      break;
    }

    // ============================================================
    // 9. UNKNOWN
    // ============================================================
    case INTENT_TYPES.UNKNOWN:
    default: {
      message = "I'm not completely sure about that. You can chat with me, ask about Kamalesh's projects, or ask me to open and arrange workspace applications!";
      suggestions = [
        'What can you do?',
        'Open RSK Traders',
        'Show my projects',
        'Who is Kamalesh?'
      ];
      break;
    }
  }

  return {
    intent,
    message,
    text: message, // Backward compatibility
    response: message, // Backward compatibility
    actions,
    action: actions[0] || null, // Backward compatibility
    suggestions
  };
};
