import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import { Home, CalendarPlus, Calendar } from 'lucide-react';

export const BottomNavigationView: React.FC = () => {
  const { activeTab, setActiveTab, appointments } = useApp();

  const activeAppointmentsCount = appointments.filter((a) => a.status === 'confirmed').length;

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'booking', label: 'Reservar', icon: CalendarPlus },
    { id: 'calendar', label: 'Mis Citas', icon: Calendar },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Navegación principal"
      className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200"
    >
      <div className="grid grid-cols-3 max-w-md mx-auto h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-colors cursor-pointer ${
                isActive ? 'text-teal-800' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div
                className={`relative px-4 py-1 rounded-full transition-colors flex items-center justify-center ${
                  isActive ? 'bg-teal-50 text-teal-800' : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />

                {tab.id === 'calendar' && activeAppointmentsCount > 0 && (
                  <span className="absolute -top-0.5 right-1 min-w-[16px] h-4 px-1 rounded-full bg-teal-700 text-[10px] font-semibold text-white flex items-center justify-center tabular-nums">
                    {activeAppointmentsCount}
                  </span>
                )}
              </div>

              <span className={`text-[11px] mt-0.5 ${isActive ? 'font-semibold text-teal-900' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
