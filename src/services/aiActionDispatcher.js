/**
 * KAM AI - ACTION DISPATCHER (WRAPPER)
 * 
 * Delegates all actions to the centralized Workspace Controller.
 * Preserved for backwards compatibility.
 */

import { executeSingleAction, executeWorkspaceActions } from './workspaceController';

export const dispatchAIAction = (action, windowManager) => {
  return executeSingleAction(action, windowManager);
};

export const dispatchMultipleAIActions = (actions, windowManager) => {
  return executeWorkspaceActions(actions, windowManager);
};
