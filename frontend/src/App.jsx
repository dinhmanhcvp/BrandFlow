import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import ScreenUpload from './components/ScreenUpload';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-[#0B1437] font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header onNewProjectClick={() => setCurrentView('upload')} />
        <main className="flex-1 overflow-y-auto w-full">
          {currentView === 'dashboard' ? (
            <DashboardOverview />
          ) : (
            <ScreenUpload onGenerate={() => setCurrentView('dashboard')} />
          )}
        </main>
      </div>
    </div>
  );
}
