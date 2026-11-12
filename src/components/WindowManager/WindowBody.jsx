import React from 'react';
import { InternalBrowser } from '../Browser/InternalBrowser';
import { ProjectsShowcase } from '../Views/ProjectsShowcase';
import { AboutMeModal } from '../Views/AboutMeModal';
import { ContactModal } from '../Views/ContactModal';
import { DeveloperTerminal } from '../Views/DeveloperTerminal';
import { ProjectDetailsModal } from '../Views/ProjectDetailsModal';
import { GitHubActivityDashboard } from '../GitHubActivity/GitHubActivityDashboard';
import { RuntimeDashboard } from '../Runtime/RuntimeDashboard';
import { ApplicationLogsModal } from '../Runtime/ApplicationLogsModal';
import { ResumeView } from '../Views/ResumeView';

export const WindowBody = ({ windowItem, onClose }) => {
  const { type, metadata } = windowItem;

  switch (type) {
    case 'resume':
      return <ResumeView onClose={onClose} />;
    case 'runtime':
      return <RuntimeDashboard onClose={onClose} />;
    case 'logs':
      return <ApplicationLogsModal appId={metadata?.appId || metadata?.id} appName={metadata?.name} onClose={onClose} />;
    case 'projects':
      return <ProjectsShowcase onClose={onClose} />;
    case 'github-activity':
      return <GitHubActivityDashboard onClose={onClose} />;
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
