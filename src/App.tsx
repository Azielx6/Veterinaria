/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Snackbar } from './components/common/Snackbar';
import { LoginActivity } from './components/auth/LoginActivity';
import { TopAppBar } from './components/layout/TopAppBar';
import { BottomNavigationView } from './components/layout/BottomNavigationView';
import { HomeFragment } from './components/modules/HomeFragment';
import { BookingFragment } from './components/modules/BookingFragment';
import { CalendarFragment } from './components/modules/CalendarFragment';
import { PetProfilesModal } from './components/modules/PetProfilesModal';

const MainScreen: React.FC = () => {
  const { isAuthenticated, activeTab } = useApp();

  if (!isAuthenticated) {
    return <LoginActivity />;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-neutral-50">
      {/* Top App Bar */}
      <TopAppBar />

      {/* Fragment Container View */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && <HomeFragment />}
        {activeTab === 'booking' && <BookingFragment />}
        {activeTab === 'calendar' && <CalendarFragment />}
      </main>

      {/* Bottom Navigation View */}
      <BottomNavigationView />

      {/* Modals & Dialogs */}
      <PetProfilesModal />
      <Snackbar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-neutral-100 flex justify-center">
        <div className="w-full max-w-md min-h-screen bg-neutral-50 flex flex-col">
          <MainScreen />
        </div>
      </div>
    </AppProvider>
  );
}
