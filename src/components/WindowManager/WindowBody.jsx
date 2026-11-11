import React from 'react';
import { InternalBrowser } from '../Browser/InternalBrowser';
import { ProjectsShowcase } from '../Views/ProjectsShowcase';
import { AboutMeModal } from '../Views/AboutMeModal';
import { ContactModal } from '../Views/ContactModal';
import { DeveloperTerminal } from '../Views/DeveloperTerminal';
import { ProjectDetailsModal } from '../Views/ProjectDetailsModal';

export const WindowBody = ({ windowItem, onClose }) => {
  const { type, metadata } = windowItem;

  switch (type) {
    case 'projects':
      return <ProjectsShowcase onClose={onClose} />;
    case 'about':
      return <AboutMeModal onClose={onClose} />;
    case 'contact':
      return <ContactModal onClose={onClose} />;
    case 'terminal':
      return <DeveloperTerminal onClose={onClose} />;
    case 'project-details':
      return <ProjectDetailsModal project={metadata} onClose={onClose} />;
    case 'app':
    default:
      return <InternalBrowser app={metadata} onClose={onClose} />;
  }
};
