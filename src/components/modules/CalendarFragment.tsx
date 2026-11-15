import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarX2,
  Plus,
  Dog,
  Cat,
  PawPrint,
} from 'lucide-react';

export const CalendarFragment: React.FC = () => {
  const { appointments, services, pets, cancelAppointment, setActiveTab } = useApp();

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => new Date());
  const [selectedDayFilter, setSelectedDayFilter] = useState<string | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const formatDateIso = (d: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  const appointmentDatesInMonth = new Set(
    appointments
      .filter((a) => a.status === 'confirmed')
      .map((a) => a.date)
  );

  const handlePrevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));

  const displayedAppointments = appointments
    .filter((appointment) => {
      if (appointment.status !== 'confirmed') return false;
      if (selectedDayFilter) {
        return appointment.date === selectedDayFilter;
      }
      return true;
    })
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const handleConfirmCancel = () => {
    if (appointmentToDelete) {
      cancelAppointment(appointmentToDelete);
      setAppointmentToDelete(null);
    }
  };

  const getSpeciesIcon = (species?: 'dog' | 'cat' | 'other') => {
    if (species === 'dog') return Dog;
    if (species === 'cat') return Cat;
    return PawPrint;
  };

  return (
    <div className="flex-1 pb-6 px-4 space-y-4">
      <div className="pt-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Mis citas</h2>
          <p className="text-xs text-neutral-500">
            Calendario y turnos programados
          </p>
        </div>

        <button
          onClick={() => setActiveTab('booking')}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva</span>
        </button>
      </div>

      {/* Calendario */}
      <section className="bg-white rounded-xl p-4 border border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-neutral-900">
            {monthNames[month]} {year}
          </h3>

          <div className="flex items-center gap-1">
            {selectedDayFilter && (
              <button
                onClick={() => setSelectedDayFilter(null)}
                className="text-xs font-medium text-teal-700 hover:underline mr-2 cursor-pointer"
              >
                Ver todas
              </button>
            )}
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-neutral-400 mb-1.5">
          <span>Dom</span>
          <span>Lun</span>
          <span>Mar</span>
          <span>Mié</span>
          <span>Jue</span>
          <span>Vie</span>
          <span>Sáb</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`cal-empty-${i}`} className="h-9" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const iso = formatDateIso(dayNum);
            const hasAppointments = appointmentDatesInMonth.has(iso);
            const isSelected = selectedDayFilter === iso;

            return (
              <button
                key={`cal-day-${dayNum}`}
                type="button"
                onClick={() => setSelectedDayFilter(isSelected ? null : iso)}
                className={`relative h-9 w-9 mx-auto rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-colors tabular-nums cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-semibold'
                    : hasAppointments
                    ? 'bg-teal-50 text-teal-900 font-semibold hover:bg-teal-100'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span>{dayNum}</span>
                {hasAppointments && (
                  <span
                    className={`w-1 h-1 rounded-full mt-0.5 ${
                      isSelected ? 'bg-teal-300' : 'bg-teal-700'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {selectedDayFilter && (
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Filtrando día: {selectedDayFilter}</span>
            <button
              onClick={() => setSelectedDayFilter(null)}
              className="text-red-600 font-medium hover:underline cursor-pointer"
            >
              Quitar filtro
            </button>
          </div>
        )}
      </section>

      {/* Listado de Citas */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-500">
            Citas programadas ({displayedAppointments.length})
          </h3>
        </div>

        {displayedAppointments.length === 0 ? (
          <div className="bg-white rounded-xl p-6 border border-neutral-200 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center">
              <CalendarX2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-800">
                Aún no has agendado citas
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                {selectedDayFilter
                  ? `No tienes citas para el ${selectedDayFilter}.`
                  : 'Agenda un baño o consulta médica para tu mascota.'}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('booking')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agendar cita</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayedAppointments.map((appointment) => {
              const service = services.find((s) => s.id === appointment.serviceId);
              const pet = pets.find((p) => p.id === appointment.petId);
              const isBath = appointment.serviceCategory === 'bath';
              const SpeciesIcon = getSpeciesIcon(pet?.species);

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl p-4 border border-neutral-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                        <SpeciesIcon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-semibold text-teal-800">
                            {service?.name || (isBath ? 'Baño' : 'Cita Médica')}
                          </span>
                          <span className="text-neutral-400">·</span>
                          <span className="text-neutral-700 font-medium truncate">
                            {pet?.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1.5 tabular-nums">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3.5 h-3.5 text-neutral-400" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                            {appointment.time} hrs
                          </span>
                        </div>

                        {appointment.notes && (
                          <p className="text-[11px] text-neutral-500 mt-2 pt-2 border-t border-neutral-100">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setAppointmentToDelete(appointment.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Cancelar cita"
                      aria-label="Cancelar cita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {appointmentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-lg border border-neutral-200 text-center">
            <h3 className="text-base font-semibold text-neutral-900">
              ¿Cancelar esta cita?
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              El turno quedará libre en la agenda.
            </p>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setAppointmentToDelete(null)}
                className="flex-1 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
