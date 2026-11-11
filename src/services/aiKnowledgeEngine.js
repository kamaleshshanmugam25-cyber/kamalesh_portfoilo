/**
 * KAM AI - KNOWLEDGE & INTENT ENGINE
 * 
 * Contains verified ecosystem facts and natural language intent parsing.
 * Provides resilient, zero-latency client-side reasoning and accurate responses
 * without ever inventing fake project details.
 */

import { PROFILE } from '../config/profile';
import { APPLICATIONS } from '../config/applications';
import { GITHUB_USERNAME, GITHUB_PROFILE_URL } from '../config/projects';

/**
 * Generate an intelligent response and navigation action for a user prompt
 * 
 * @param {string} prompt - User message
 * @param {Array} gitHubProjects - Synced GitHub repositories from context
 * @returns {Object} { text: string, action: Object|null, suggestions: Array<string> }
 */
export const queryKnowledgeEngine = (prompt, gitHubProjects = []) => {
  const p = prompt.trim().toLowerCase();

  // 1. GREETINGS & INTRODUCTION
  if (/^(hi|hello|hey|who are you|what is your name|introduce yourself)/i.test(p)) {
    return {
      text: `Hello! I am **KAM AI**, your personal digital guide across the KAMVERSE ecosystem. 

I can help you explore Kamalesh's 8+ years of engineering experience, launch his 6 flagship web applications, search his ${gitHubProjects.length || 13} synced GitHub repositories, or navigate anywhere in this workspace.

What would you like to explore today?`,
      action: null,
      suggestions: [
        'Who is Kamalesh?',
        'Open RSK Traders',
        'Show all projects',
        'Show Python projects',
        'Take me to GitHub'
      ]
    };
  }

  // 2. WHO IS KAMALESH / ABOUT / BIO / EXPERIENCE
  if (/(who is kamalesh|about kamalesh|bio|background|tell me about him|experience|career)/i.test(p)) {
    return {
      text: `**${PROFILE.name}** is a **${PROFILE.title}** with over **${PROFILE.experienceYears}** of experience designing and building enterprise SaaS systems, web platforms, and digital products.

• **Current Status**: ${PROFILE.availability}
• **Philosophy**: Clean architectural boundaries, zero bloat, and pixel-precise design execution.
• **Core Specialties**: React, Tailwind CSS, Python/Django, UI/UX Architecture, and Performance Optimization.

Would you like me to open his full profile window?`,
      action: {
        type: 'NAVIGATE_VIEW',
        payload: { view: 'about' }
      },
      suggestions: [
        'What technologies does he use?',
        'Show all projects',
        'Contact Kamalesh',
        'Open Developer Terminal'
      ]
    };
  }

  // 3. SKILLS / TECH STACK
  if (/(skills|technologies|tech stack|what does he use|languages|tools)/i.test(p)) {
    const categories = PROFILE.skillCategories.map(c => 
      `• **${c.category}**: ${c.skills.map(s => s.name).join(', ')}`
    ).join('\n');

    return {
      text: `Kamalesh's technical mastery covers full-stack web and product engineering:\n\n${categories}\n\nHe specializes in building scalable frontend architectures with React/Tailwind, and robust backend services with Python, Django, and PostgreSQL.`,
      action: {
        type: 'NAVIGATE_VIEW',
        payload: { view: 'about' }
      },
      suggestions: [
        'Show Python projects',
        'Show all projects',
        'Open RSK Traders',
        'Contact Kamalesh'
      ]
    };
  }

  // 4. SPECIFIC 6 APPLICATIONS
  // A. RSK Traders
  if (/(rsk|traders|import|export|bulk trade)/i.test(p)) {
    const app = APPLICATIONS.find(a => a.id === 'rsk-traders');
    return {
      text: `**${app.name}** is a live enterprise international import & export platform:
• **Category**: ${app.category}
• **URL**: [${app.url}](${app.url})
• **Tech Stack**: ${app.techStack.join(', ')}
• **Summary**: ${app.description}

I am opening the RSK Traders browser window for you right now!`,
      action: {
        type: 'OPEN_APP',
        payload: { appId: 'rsk-traders' }
      },
      suggestions: [
        'Show all projects',
        'Open JobSphere',
        'Take me home'
      ]
    };
  }

  // B. Photography
  if (/(photography|studio|photos|camera)/i.test(p)) {
    const app = APPLICATIONS.find(a => a.id === 'photography');
    return {
      text: `**${app.name}** is an upcoming editorial photography studio and client proofing suite:
• **Category**: ${app.category}
• **Tech Stack**: ${app.techStack.join(', ')}
• **Key Capabilities**: High-res masonry gallery, client suites, automated booking.

Opening the Photography website overview window!`,
      action: {
        type: 'OPEN_APP',
        payload: { appId: 'photography' }
      },
      suggestions: [
        'Open Gold Jewellery',
        'Open RSK Traders',
        'Show all projects'
      ]
    };
  }

  // C. Jewellery
  if (/(jewellery|jewelry|gold|bullion|ornaments)/i.test(p)) {
    const app = APPLICATIONS.find(a => a.id === 'jewellery');
    return {
      text: `**${app.name}** is a fine jewellery e-commerce boutique platform:
• **Category**: ${app.category}
• **Tech Stack**: ${app.techStack.join(', ')}
• **Key Capabilities**: Daily gold/diamond bullion tickers, 360° product visualizer, custom order builder.

Opening the Gold Jewellery application window!`,
      action: {
        type: 'OPEN_APP',
        payload: { appId: 'jewellery' }
      },
      suggestions: [
        'Open Restaurant',
        'Open JobSphere',
        'Show all projects'
      ]
    };
  }

  // D. Restaurant
  if (/(restaurant|food|dining|culinary|menu)/i.test(p)) {
    const app = APPLICATIONS.find(a => a.id === 'restaurant');
    return {
      text: `**${app.name}** is an artisanal culinary dining portal:
• **Category**: ${app.category}
• **Tech Stack**: ${app.techStack.join(', ')}
• **Key Capabilities**: Interactive sensory menus, real-time table floorplan booking, contactless payments.

Opening the Restaurant application window!`,
      action: {
        type: 'OPEN_APP',
        payload: { appId: 'restaurant' }
      },
      suggestions: [
        'Open College ERP',
        'Open RSK Traders',
        'Show all projects'
      ]
    };
  }

  // E. JobSphere
  if (/(jobsphere|job|career portal|hiring platform)/i.test(p)) {
    const app = APPLICATIONS.find(a => a.id === 'jobsphere');
    return {
      text: `**${app.name}** is a next-generation tech job aggregation platform:
• **Category**: ${app.category}
• **Tech Stack**: ${app.techStack.join(', ')}
• **Key Capabilities**: AI resume matching, verified compensation bands, live application kanban.

Opening the JobSphere application window!`,
      action: {
        type: 'OPEN_APP',
        payload: { appId: 'jobsphere' }
      },
      suggestions: [
        'Open College ERP',
        'Show Python projects',
        'Show all projects'
      ]
    };
  }

  // F. College ERP
  if (/(college|erp|campus|student|academic)/i.test(p)) {
    const app = APPLICATIONS.find(a => a.id === 'college-erp');
    return {
      text: `**${app.name}** is an enterprise-grade institutional campus management suite:
• **Category**: ${app.category}
• **Tech Stack**: ${app.techStack.join(', ')}
• **Scale**: Built for 10,000+ students with role-based access for students, faculty, and administrators.

Opening the College ERP application window!`,
      action: {
        type: 'OPEN_APP',
        payload: { appId: 'college-erp' }
      },
      suggestions: [
        'Show Python projects',
        'Show all projects',
        'Open RSK Traders'
      ]
    };
  }

  // 5. PYTHON PROJECTS FILTER
  if (/(python projects|show python|python repositories|django projects)/i.test(p)) {
    const pythonRepos = gitHubProjects.filter(r => 
      (r.language && r.language.toLowerCase() === 'python') ||
      (r.topics && r.topics.some(t => t.toLowerCase().includes('python') || t.toLowerCase().includes('django')))
    );

    return {
      text: `Kamalesh has built several Python & Django platforms, including **College ERP**, **JobSphere**, and specialized backend repositories. 

I have navigated to the **Projects Explorer** and applied the **Python** filter for you!`,
      action: {
        type: 'FILTER_PROJECTS',
        payload: { language: 'Python' }
      },
      suggestions: [
        'Show all projects',
        'Open JobSphere',
        'Open College ERP'
      ]
    };
  }

  // 6. JAVASCRIPT / TYPESCRIPT / REACT PROJECTS
  if (/(javascript|react|typescript|frontend projects)/i.test(p)) {
    return {
      text: `Kamalesh extensively uses **React**, **JavaScript**, and **TypeScript** for interactive SaaS dashboards, micro-interactions, and high-performance desktop workspaces like KAMVERSE.

I am opening the Projects Explorer filtered for JavaScript!`,
      action: {
        type: 'FILTER_PROJECTS',
        payload: { language: 'JavaScript' }
      },
      suggestions: [
        'Show all projects',
        'Open RSK Traders',
        'What technologies does he use?'
      ]
    };
  }

  // 7. SHOW ALL PROJECTS / BROWSE REPOSITORIES
  if (/(show all projects|all projects|browse projects|repositories|github repos|projects explorer|explore projects)/i.test(p)) {
    return {
      text: `Opening the **Projects Explorer**! 

Here you can browse all **${gitHubProjects.length || 13} synchronized GitHub repositories** for **@${GITHUB_USERNAME}**, view live README documentation, technology distribution, stars, and launch live demos.`,
      action: {
        type: 'NAVIGATE_VIEW',
        payload: { view: 'projects' }
      },
      suggestions: [
        'Show Python projects',
        'Open RSK Traders',
        'Take me to GitHub'
      ]
    };
  }

  // 8. OPEN GITHUB PROFILE
  if (/(github|git profile|source code|view code|take me to github|open github)/i.test(p)) {
    return {
      text: `Kamalesh's official GitHub profile is **@${GITHUB_USERNAME}** (${GITHUB_PROFILE_URL}).

I am opening his GitHub profile in a secure new tab for you!`,
      action: {
        type: 'OPEN_EXTERNAL',
        payload: { url: 'github' }
      },
      suggestions: [
        'Show all projects',
        'Who is Kamalesh?',
        'Contact Kamalesh'
      ]
    };
  }

  // 9. CONTACT / HIRE
  if (/(contact|hire|email|reach out|get in touch|collaborate|work together)/i.test(p)) {
    return {
      text: `You can reach Kamalesh directly at:
• **Email**: \`${PROFILE.email}\`
• **Availability**: ${PROFILE.availability}
• **LinkedIn**: [Kamalesh on LinkedIn](${PROFILE.linkedin})

Opening the direct Contact & Hire portal for you!`,
      action: {
        type: 'NAVIGATE_VIEW',
        payload: { view: 'contact' }
      },
      suggestions: [
        'Who is Kamalesh?',
        'Show all projects',
        'Open Developer Terminal'
      ]
    };
  }

  // 10. DEVELOPER TERMINAL / CLI
  if (/(terminal|cli|console|command line)/i.test(p)) {
    return {
      text: `Opening the interactive **Developer Terminal**! You can type commands like \`help\`, \`repos\`, \`apps\`, or \`skills\` directly into the terminal CLI.`,
      action: {
        type: 'NAVIGATE_VIEW',
        payload: { view: 'terminal' }
      },
      suggestions: [
        'Show all projects',
        'Take me home',
        'Contact Kamalesh'
      ]
    };
  }

  // 11. HOME / RETURN TO DESKTOP / MINIMIZE
  if (/(home|desktop|minimize all|clear screen|take me home)/i.test(p)) {
    return {
      text: `Minimized all active windows and returned you to the main **KAMVERSE** desktop canvas!`,
      action: {
        type: 'NAVIGATE_VIEW',
        payload: { view: 'home' }
      },
      suggestions: [
        'Open RSK Traders',
        'Show all projects',
        'Open Developer Terminal'
      ]
    };
  }

  // 12. CHECK SPECIFIC GITHUB REPOSITORY MATCH
  const matchingRepo = gitHubProjects.find(r => 
    p.includes(r.name.toLowerCase()) || 
    (r.displayName && p.includes(r.displayName.toLowerCase()))
  );

  if (matchingRepo) {
    return {
      text: `Found repository **${matchingRepo.displayName || matchingRepo.name}**:
• **Category**: ${matchingRepo.category}
• **Language**: ${matchingRepo.language || 'Codebase'}
• **Description**: ${matchingRepo.description || 'Enterprise repository crafted by Kamalesh.'}
• **GitHub Stars**: ${matchingRepo.stars || 0}★ | **Forks**: ${matchingRepo.forks || 0}

Opening the project details and README viewer for you right now!`,
      action: {
        type: 'OPEN_PROJECT',
        payload: { repoName: matchingRepo.name }
      },
      suggestions: [
        'Show all projects',
        'Show Python projects',
        'Take me to GitHub'
      ]
    };
  }

  // 13. DEFAULT HELPFUL FALLBACK
  return {
    text: `I understand you're asking about "${prompt}". 

As Kamalesh's digital guide, I can help you:
1. **Launch Flagship Websites**: Say *"Open RSK Traders"*, *"Open JobSphere"*, etc.
2. **Discover GitHub Projects**: Say *"Show Python projects"* or *"Show all projects"*.
3. **Explore Credentials**: Say *"Who is Kamalesh?"* or *"What technologies does he use?"*.
4. **Get in Touch**: Say *"Contact Kamalesh"* or *"Take me to GitHub"*.

What would you like me to do?`,
    action: null,
    suggestions: [
      'Who is Kamalesh?',
      'Show all projects',
      'Open RSK Traders',
      'Show Python projects',
      'Contact Kamalesh'
    ]
  };
};
