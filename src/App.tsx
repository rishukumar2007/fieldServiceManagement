import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { WorkOrdersPage } from './components/workorders/WorkOrdersPage';
import { 
  CustomersPage, SitesPage, TechniciansPage, PartsPage, 
  ReportsPage, UsersPage, SlaPage, SettingsPage 
} from './components/pages/OtherPages';
import { LoginPage } from './components/auth/LoginPage';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { isAuthenticated, activeTab } = useData();
  const [sidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'work-orders':
        return <WorkOrdersPage />;
      case 'customers':
        return <CustomersPage />;
      case 'sites':
        return <SitesPage />;
      case 'technicians':
        return <TechniciansPage />;
      case 'parts':
        return <PartsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'users':
        return <UsersPage />;
      case 'sla':
        return <SlaPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen max-h-screen w-full bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="flex-1 md:pl-64 flex flex-col h-screen max-h-screen min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
}

export default App;
