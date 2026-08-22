import React from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { Layout } from './components/Layout';
import { Onboarding } from './screens/Onboarding';
import { Chat } from './screens/Chat';
import { KnowledgeBase } from './screens/KnowledgeBase';
import { Library } from './screens/Library';
import { CompanyAgents } from './screens/CompanyAgents';
import { Team } from './screens/Team';
import { ModelStore } from './screens/ModelStore';
import { AgentStore } from './screens/AgentStore';
import { Settings } from './screens/Settings';

const ScreenManager = () => {
  const { currentScreen, isOnboarded } = useAppContext();

  if (!isOnboarded) {
    return <Onboarding />;
  }

  switch (currentScreen) {
    case 'chat': return <Chat />;
    case 'knowledgeBase': return <KnowledgeBase />;
    case 'library': return <Library />;
    case 'companyAgents': return <CompanyAgents />;
    case 'team': return <Settings />;
    case 'modelStore': return <ModelStore />;
    case 'agentStore': return <AgentStore />;
    case 'dashboard': return <Settings />;
    case 'settings': return <Settings />;
    default: return <Chat />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <ScreenManager />
      </Layout>
    </AppProvider>
  );
}
