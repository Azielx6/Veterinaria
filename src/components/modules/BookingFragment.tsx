import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory, VetService } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Droplets,
  Stethoscope,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Dog,
  Cat,
  PawPrint,
} from 'lucide-react';

export const BookingFragment: React.FC = () => {
  const {
    services,
    pets,
    preselectedServiceId,
    addAppointment,
    setActiveTab,
    selectedPetForBooking,
    setSelectedPetForBooking,
    setIsPetProfilesModalOpen,
  } = useApp();

  const [selectedPetId, setSelectedPetId] = useState<string>(
    selectedPetForBooking || pets[0]?.id || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('bath');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const [confirmedModal, setConfirmedModal] = useState<{
    service: VetService;
    petName: string;
    date: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    if (selectedPetForBooking) {
      setSelectedPetId(selectedPetForBooking);
      setSelectedPetForBooking(null);
    }
  }, [selectedPetForBooking, setSelectedPetForBooking]);

  useEffect(() => {
    if (preselectedServiceId) {
      const found = services.find((s) => s.id === preselectedServiceId);
      if (found) {
        setSelectedCategory(found.category);
        setSelectedServiceId(found.id);
      }
    } else if (!selectedServiceId) {
      const firstInCategory = services.find((s) => s.category === selectedCategory);
      if (firstInCategory) setSelectedServiceId(firstInCategory.id);
    }
  }, [preselectedServiceId, services, selectedCategory, selectedServiceId]);

  const handleCategoryChange = (cat: ServiceCategory) => {
    setSelectedCategory(cat);
    const firstMatching = services.find((s) => s.category === cat);
    if (firstMatching) {
      setSelectedServiceId(firstMatching.id);
    }
  };

  const activeService = services.find((s) => s.id === selectedServiceId);
  const activePet = pets.find((p) => p.id === selectedPetId);

  const getSpeciesIcon = (species: 'dog' | 'cat' | 'other') => {
    if (species === 'dog') return Dog;
    if (species === 'cat') return Cat;
    return PawPrint;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSelectDay = (dayNumber: number) => {
    const candidate = new Date(year, month, dayNumber);
    candidate.setHours(0, 0, 0, 0);

    if (candidate < today) return;

    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(dayNumber).padStart(2, '0');
    setSelectedDate(`${year}-${monthStr}-${dayStr}`);
    setIsDatePickerOpen(false);

    if (!selectedTime) {
      setIsTimePickerOpen(true);
    }
  };

  const timeSlots = [
    '08:30', '09:15', '10:00', '10:45', '11:30',
    '14:00', '14:45', '15:30', '16:15', '17:00', '17:45',
  ];

  const isFormValid = Boolean(
    selectedPetId &&
    selectedServiceId &&
    selectedDate &&
    selectedTime
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !activeService || !activePet) return;

    setIsSubmitting(true);
    const res = await addAppointment({
      petId: selectedPetId,
      serviceId: selectedServiceId,
      serviceCategory: selectedCategory,
      date: selectedDate,
      time: selectedTime,
      notes,
    });
    setIsSubmitting(false);

    if (res.success) {
      setConfirmedModal({
        service: activeService,
        petName: activePet.name,
        date: selectedDate,
        time: selectedTime,
      });
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
    }
  };

  return (
    <div className="flex-1 pb-6 px-4 space-y-4">
      <div className="pt-3">
        <h2 className="text-lg font-bold text-neutral-900">Reservar cita</h2>
        <p className="text-xs text-neutral-500">
          Selecciona mascota, servicio, fecha y horario
        </p>
      </div>

      <form onSubmit={handleConfirmBooking} className="space-y-4">
        {/* Mascota */}
        <section className="bg-white rounded-xl p-4 border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-900">
              1. Mascota
            </label>
            <button
              type="button"
              onClick={() => setIsPetProfilesModalOpen(true)}
              className="text-xs font-medium text-teal-700 hover:underline cursor-pointer"
            >
              Ver perfiles
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {pets.map((pet) => {
              const isSelected = selectedPetId === pet.id;
              const SpeciesIcon = getSpeciesIcon(pet.species);
              return (
                <button
                  type="button"
                  key={pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-700 text-teal-900'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <SpeciesIcon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-teal-700' : 'text-neutral-500'}`} />
                  <span className="text-xs font-semibold truncate w-full">
                    {pet.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 truncate w-full">
                    {pet.breed}
                  </span>
                </button>
              );
            })}
          </div>

          {activePet && (
            <div className="pt-2.5 border-t border-neutral-100 text-xs text-neutral-600 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span className="font-medium text-neutral-700">Historial de {activePet.name}</span>
                <span className="tabular-nums">{activePet.ageYears} años · {activePet.weightKg} kg</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                {activePet.medicalHistory || 'Sin antecedentes registrados.'}
              </p>
              {activePet.detailedHistory?.allergies && (
                <p className="text-[11px] text-amber-800 font-medium">
                  Alergias: {activePet.detailedHistory.allergies}
                </p>
              )}
            </div>
          )}
        </section>

        {/* Servicio: Baño o Cita Médica */}
        <section className="bg-white rounded-xl p-4 border border-neutral-200 space-y-3">
          <label className="block text-xs font-semibold text-neutral-900">
            2. Servicio
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleCategoryChange('bath')}
              className={`flex flex-col p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                selectedCategory === 'bath'
                  ? 'bg-teal-50 border-teal-700 text-teal-950'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Droplets className={`w-5 h-5 ${selectedCategory === 'bath' ? 'text-teal-700' : 'text-neutral-500'}`} />
                <span className="text-xs font-semibold tabular-nums text-neutral-900">
                  S/. 45.00
                </span>
              </div>
              <p className="text-xs font-semibold text-neutral-900">Baño</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">45 min · Higiene</p>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('medical')}
              className={`flex flex-col p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                selectedCategory === 'medical'
                  ? 'bg-teal-50 border-teal-700 text-teal-950'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Stethoscope className={`w-5 h-5 ${selectedCategory === 'medical' ? 'text-teal-700' : 'text-neutral-500'}`} />
                <span className="text-xs font-semibold tabular-nums text-neutral-900">
                  S/. 50.00
                </span>
              </div>
              <p className="text-xs font-semibold text-neutral-900">Cita Médica</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">30 min · Consulta</p>
            </button>
          </div>
        </section>

        {/* Fecha y Hora */}
        <section className="bg-white rounded-xl p-4 border border-neutral-200 space-y-3">
          <label className="block text-xs font-semibold text-neutral-900">
            3. Fecha y hora
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(true)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                selectedDate
                  ? 'bg-teal-50/50 border-teal-700 text-neutral-900 font-semibold'
                  : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
              }`}
            >
              <CalendarIcon className={`w-4 h-4 ${selectedDate ? 'text-teal-700' : 'text-neutral-400'}`} />
              <div className="min-w-0">
                <span className="text-[10px] text-neutral-400 block font-normal">Fecha</span>
                <span className="text-xs truncate block tabular-nums">
                  {selectedDate ? selectedDate : 'Seleccionar'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsTimePickerOpen(true)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                selectedTime
                  ? 'bg-teal-50/50 border-teal-700 text-neutral-900 font-semibold'
                  : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
              }`}
            >
              <Clock className={`w-4 h-4 ${selectedTime ? 'text-teal-700' : 'text-neutral-400'}`} />
              <div className="min-w-0">
                <span className="text-[10px] text-neutral-400 block font-normal">Hora</span>
                <span className="text-xs truncate block tabular-nums">
                  {selectedTime ? `${selectedTime} hrs` : 'Seleccionar'}
                </span>
              </div>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Notas (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Indicaciones o síntomas relevantes"
              className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 text-neutral-900 placeholder:text-neutral-400"
            />
          </div>
        </section>

        {/* Resumen y Confirmar */}
        <section className="bg-white rounded-xl p-4 border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">Costo estimado</span>
            <span className="text-sm font-bold text-neutral-900 tabular-nums">
              S/. {activeService?.estimatedPrice.toFixed(2) || '0.00'}
            </span>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full h-11 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Confirmar cita</span>
            )}
          </button>
        </section>
      </form>

      {/* Selector de Fecha */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-lg border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-xs font-semibold text-neutral-900">
                Seleccionar fecha
              </h3>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between my-2.5 px-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-neutral-900">
                {monthNames[month]} {year}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-neutral-400 mb-1">
              <span>Do</span>
              <span>Lu</span>
              <span>Ma</span>
              <span>Mi</span>
              <span>Ju</span>
              <span>Vi</span>
              <span>Sá</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateObj = new Date(year, month, dayNum);
                dateObj.setHours(0, 0, 0, 0);
                const isPast = dateObj < today;

                const monthStr = String(month + 1).padStart(2, '0');
                const dayStr = String(dayNum).padStart(2, '0');
                const dateIso = `${year}-${monthStr}-${dayStr}`;
                const isSelected = selectedDate === dateIso;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-8 w-8 mx-auto rounded-full text-xs font-medium flex items-center justify-center transition-colors tabular-nums ${
                      isSelected
                        ? 'bg-teal-700 text-white font-semibold'
                        : isPast
                        ? 'text-neutral-300 cursor-not-allowed'
                        : 'text-neutral-700 hover:bg-neutral-100 cursor-pointer'
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Solo fechas disponibles</span>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(false)}
                className="text-teal-700 font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selector de Hora */}
      {isTimePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-lg border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-xs font-semibold text-neutral-900">
                Seleccionar hora
              </h3>
              <button
                type="button"
                onClick={() => setIsTimePickerOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3 max-h-56 overflow-y-auto">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setSelectedTime(time);
                      setIsTimePickerOpen(false);
                    }}
                    className={`py-2 text-center rounded-xl text-xs font-medium tabular-nums transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white font-semibold'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-neutral-100 text-right">
              <button
                type="button"
                onClick={() => setIsTimePickerOpen(false)}
                className="text-xs text-neutral-500 font-medium px-2 py-1"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación */}
      {confirmedModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-lg border border-neutral-200 text-center">
            <div className="w-11 h-11 mx-auto rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-semibold text-neutral-900">
              Cita confirmada
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Tu turno quedó registrado en Mi Mejor Patita
            </p>

            <div className="my-4 bg-neutral-50 rounded-xl p-3 border border-neutral-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Mascota</span>
                <span className="font-semibold text-neutral-900">{confirmedModal.petName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Servicio</span>
                <span className="font-semibold text-neutral-900">{confirmedModal.service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Fecha</span>
                <span className="font-semibold text-teal-800 tabular-nums">{confirmedModal.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Hora</span>
                <span className="font-semibold text-teal-800 tabular-nums">{confirmedModal.time} hrs</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmedModal(null)}
                className="flex-1 py-2.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                Nueva cita
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmedModal(null);
                  setActiveTab('calendar');
                }}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors cursor-pointer"
              >
                Ver mis citas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
