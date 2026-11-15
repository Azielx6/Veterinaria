import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CLINIC_INFO } from '../../data/seedData';
import {
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  Droplets,
  Stethoscope,
  Plus,
  Dog,
  Cat,
  PawPrint,
} from 'lucide-react';

export const HomeFragment: React.FC = () => {
  const {
    services,
    startBookingWithService,
    setActiveTab,
    pets,
    addPet,
    setIsPetProfilesModalOpen,
  } = useApp();
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('2');
  const [petWeight, setPetWeight] = useState('5.0');

  const getSpeciesIcon = (species: 'dog' | 'cat' | 'other') => {
    if (species === 'dog') return Dog;
    if (species === 'cat') return Cat;
    return PawPrint;
  };

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim() || !petBreed.trim()) return;

    addPet({
      name: petName.trim(),
      species: petSpecies,
      breed: petBreed.trim(),
      ageYears: parseFloat(petAge) || 1,
      weightKg: parseFloat(petWeight) || 3.0,
      photoEmoji: petSpecies === 'dog' ? 'P' : petSpecies === 'cat' ? 'G' : 'M',
      medicalHistory: 'Sin antecedentes médicos registrados.',
    });

    setPetName('');
    setPetBreed('');
    setIsAddPetModalOpen(false);
  };

  return (
    <div className="flex-1 pb-6 px-4 space-y-5">
      {/* Banner de Clínica */}
      <section className="rounded-2xl bg-teal-800 text-white p-5 mt-3">
        <h2 className="text-lg font-bold tracking-tight">
          {CLINIC_INFO.name}
        </h2>
        <p className="text-xs text-teal-100 mt-1.5 leading-relaxed">
          {CLINIC_INFO.bio}
        </p>

        <div className="mt-4 pt-3 border-t border-teal-700 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('booking')}
            className="px-4 py-2 rounded-xl bg-white text-teal-900 font-semibold text-xs hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Agendar cita
          </button>

          <a
            href={`tel:${CLINIC_INFO.phone}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-900/60 hover:bg-teal-900 text-white text-xs font-medium border border-teal-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Llamar</span>
          </a>
        </div>
      </section>

      {/* Mis Mascotas */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">
            Mis mascotas ({pets.length})
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPetProfilesModalOpen(true)}
              className="text-xs font-medium text-teal-700 hover:underline cursor-pointer"
            >
              Ver perfiles
            </button>
            <button
              onClick={() => setIsAddPetModalOpen(true)}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-neutral-200/70 text-neutral-800 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4">
          {pets.map((pet) => {
            const SpeciesIcon = getSpeciesIcon(pet.species);
            return (
              <button
                key={pet.id}
                onClick={() => setIsPetProfilesModalOpen(true)}
                className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-neutral-200 shrink-0 min-w-[180px] text-left hover:border-teal-600 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                  <SpeciesIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate">{pet.name}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{pet.breed}</p>
                  <p className="text-[11px] text-neutral-400 tabular-nums">
                    {pet.ageYears} años · {pet.weightKg} kg
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Servicios */}
      <section className="space-y-2.5">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Servicios</h3>
          <p className="text-xs text-neutral-500">Elige el tipo de atención que necesitas</p>
        </div>

        <div className="space-y-2.5">
          {services.map((service) => {
            const isBath = service.category === 'bath';
            const Icon = isBath ? Droplets : Stethoscope;

            return (
              <div
                key={service.id}
                className="bg-white rounded-xl p-4 border border-neutral-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 text-teal-800 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-neutral-900">
                        {service.name}
                      </h4>
                      <span className="text-xs font-semibold text-neutral-900 tabular-nums">
                        S/. {service.estimatedPrice.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {service.shortDescription}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-100">
                      <span className="flex items-center gap-1 text-[11px] text-neutral-500 tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        {service.durationMinutes} min
                      </span>

                      <button
                        onClick={() => startBookingWithService(service.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-teal-900 cursor-pointer"
                      >
                        <span>Agendar</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ubicación y Horarios */}
      <section className="bg-white rounded-xl p-4 border border-neutral-200 space-y-3">
        <h3 className="text-xs font-semibold text-neutral-500">
          Ubicación y horarios
        </h3>

        <div className="flex items-start gap-2.5 text-xs text-neutral-600">
          <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-neutral-800">{CLINIC_INFO.address}</p>
            <p className="text-[11px] text-neutral-500">{CLINIC_INFO.neighborhood}, {CLINIC_INFO.city}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-neutral-600 pt-2.5 border-t border-neutral-100">
          <Clock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-[11px]">
            <p className="text-neutral-700">{CLINIC_INFO.hours.weekdays}</p>
            <p className="text-neutral-500">{CLINIC_INFO.hours.saturdays}</p>
            <p className="text-teal-800 font-medium">{CLINIC_INFO.hours.emergencies}</p>
          </div>
        </div>
      </section>

      {/* Modal: Registrar Nueva Mascota */}
      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-lg border border-neutral-200">
            <h3 className="text-base font-semibold text-neutral-900">Registrar mascota</h3>
            <p className="text-xs text-neutral-500 mb-4">Completa los datos básicos</p>

            <form onSubmit={handleSavePet} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Ej: Chester"
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Especie</label>
                  <select
                    value={petSpecies}
                    onChange={(e) => setPetSpecies(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  >
                    <option value="dog">Perro</option>
                    <option value="cat">Gato</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Raza</label>
                  <input
                    type="text"
                    required
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    placeholder="Ej: Mestizo"
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Edad (años)</label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.1"
                    value={petWeight}
                    onChange={(e) => setPetWeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPetModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
