import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, PawPrint } from 'lucide-react';

export const TopAppBar: React.FC = () => {
  const { currentUser, logout, setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-20 bg-white px-4 h-14 border-b border-neutral-200 flex items-center justify-between">
      <button
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-2.5 text-left cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center">
          <PawPrint className="w-4 h-4" />
        </div>
        <span className="text-base font-semibold text-neutral-900 tracking-tight">
          Mi Mejor Patita
        </span>
      </button>

      {currentUser && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-600 hidden sm:inline">
            {currentUser.name}
          </span>
          <div
            className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 font-semibold text-xs flex items-center justify-center border border-neutral-200"
            title={currentUser.name}
          >
            {currentUser.name.charAt(0)}
          </div>
          <button
            onClick={logout}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-neutral-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
