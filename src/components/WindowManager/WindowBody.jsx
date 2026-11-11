import React from 'react';
import { InternalBrowser } from '../Browser/InternalBrowser';
import { ProjectsShowcase } from '../Views/ProjectsShowcase';
import { AboutMeModal } from '../Views/AboutMeModal';
import { ContactModal } from '../Views/ContactModal';
import { DeveloperTerminal } from '../Views/DeveloperTerminal';

export const WindowBody = ({ windowItem }) => {
  const { type, metadata } = windowItem;

  switch (type) {
    case 'projects':
      return <ProjectsShowcase />;
    case 'about':
      return <AboutMeModal />;
    case 'contact':
      return <ContactModal />;
    case 'terminal':
      return <DeveloperTerminal />;
    case 'app':
    default:
      return <InternalBrowser app={metadata} />;
  }
};
