import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Pet } from '../../types';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Dog,
  Cat,
  PawPrint,
} from 'lucide-react';

export const PetProfilesModal: React.FC = () => {
  const {
    pets,
    addPet,
    updatePet,
    deletePet,
    isPetProfilesModalOpen,
    setIsPetProfilesModalOpen,
    appointments,
    setActiveTab,
    setSelectedPetForBooking,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState('2');
  const [weightKg, setWeightKg] = useState('5.0');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [vaccines, setVaccines] = useState('');

  if (!isPetProfilesModalOpen) return null;

  const resetForm = () => {
    setName('');
    setSpecies('dog');
    setBreed('');
    setAgeYears('2');
    setWeightKg('5.0');
    setMedicalHistory('');
    setAllergies('');
    setChronicConditions('');
    setVaccines('');
    setEditingPetId(null);
    setIsEditing(false);
  };

  const handleStartCreate = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleStartEdit = (pet: Pet) => {
    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed);
    setAgeYears(String(pet.ageYears));
    setWeightKg(String(pet.weightKg));
    setMedicalHistory(pet.medicalHistory || '');
    setAllergies(pet.detailedHistory?.allergies || '');
    setChronicConditions(pet.detailedHistory?.chronicConditions || '');
    setVaccines(pet.detailedHistory?.vaccines || '');
    setEditingPetId(pet.id);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !breed.trim()) return;

    const petPayload: Omit<Pet, 'id'> = {
      name: name.trim(),
      species,
      breed: breed.trim(),
      ageYears: parseFloat(ageYears) || 1,
      weightKg: parseFloat(weightKg) || 3.0,
      photoEmoji: species === 'dog' ? 'P' : species === 'cat' ? 'G' : 'M',
      medicalHistory: medicalHistory.trim() || 'Sin antecedentes médicos relevantes.',
      detailedHistory: {
        allergies: allergies.trim() || undefined,
        chronicConditions: chronicConditions.trim() || undefined,
        vaccines: vaccines.trim() || undefined,
        generalNotes: medicalHistory.trim() || undefined,
      },
    };

    if (editingPetId) {
      updatePet(editingPetId, petPayload);
    } else {
      addPet(petPayload);
    }

    resetForm();
  };

  const handleBookForPet = (petId: string) => {
    setSelectedPetForBooking(petId);
    setIsPetProfilesModalOpen(false);
    setActiveTab('booking');
  };

  const getSpeciesIcon = (s: 'dog' | 'cat' | 'other') => {
    if (s === 'dog') return Dog;
    if (s === 'cat') return Cat;
    return PawPrint;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] shadow-lg border border-neutral-200 flex flex-col overflow-hidden">
        <div className="p-4 bg-white border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {isEditing ? (editingPetId ? 'Editar mascota' : 'Nueva mascota') : 'Perfiles de mascotas'}
            </h2>
            <p className="text-xs text-neutral-500">
              {isEditing ? 'Datos básicos e historial médico' : `${pets.length} registradas`}
            </p>
          </div>

          <button
            onClick={() => {
              if (isEditing) {
                resetForm();
              } else {
                setIsPetProfilesModalOpen(false);
              }
            }}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-xl border border-neutral-200">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Max"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Especie *
                  </label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  >
                    <option value="dog">Perro</option>
                    <option value="cat">Gato</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Raza *
                  </label>
                  <input
                    type="text"
                    required
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="Ej: Beagle"
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Edad (años)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={ageYears}
                    onChange={(e) => setAgeYears(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    min="0.2"
                    max="100"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 space-y-2.5">
                <p className="text-xs font-semibold text-neutral-800">
                  Historial médico básico
                </p>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Resumen clínico
                  </label>
                  <textarea
                    rows={2}
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    placeholder="Antecedentes, cirugías o observaciones"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Alergias
                    </label>
                    <input
                      type="text"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="Ninguna"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Condición crónica
                    </label>
                    <input
                      type="text"
                      value={chronicConditions}
                      onChange={(e) => setChronicConditions(e.target.value)}
                      placeholder="Ninguna"
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Vacunas
                  </label>
                  <input
                    type="text"
                    value={vaccines}
                    onChange={(e) => setVaccines(e.target.value)}
                    placeholder="Ej: Quíntuple, Antirrábica"
                    className="w-full px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors cursor-pointer"
                >
                  {editingPetId ? 'Guardar cambios' : 'Crear perfil'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">Mascotas registradas</span>
                <button
                  onClick={handleStartCreate}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva mascota</span>
                </button>
              </div>

              {pets.map((pet) => {
                const petAppointments = appointments.filter(
                  (a) => a.petId === pet.id && a.status === 'confirmed'
                );
                const SpeciesIcon = getSpeciesIcon(pet.species);

                return (
                  <div
                    key={pet.id}
                    className="bg-white rounded-xl p-4 border border-neutral-200 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
                          <SpeciesIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
                            {pet.name}
                          </h4>
                          <p className="text-xs text-neutral-500 leading-tight mt-0.5 tabular-nums">
                            {pet.breed} · {pet.ageYears} años · {pet.weightKg} kg
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(pet)}
                          className="p-1.5 text-neutral-400 hover:text-teal-700 rounded-lg transition-colors cursor-pointer"
                          title="Editar perfil"
                          aria-label="Editar perfil"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {pets.length > 1 && (
                          <button
                            onClick={() => deletePet(pet.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar perfil"
                            aria-label="Eliminar perfil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-600 space-y-1">
                      <p className="text-[11px] text-neutral-700 leading-relaxed">
                        {pet.medicalHistory}
                      </p>
                      {pet.detailedHistory?.allergies && (
                        <p className="text-[11px] text-amber-800 font-medium">
                          Alergias: {pet.detailedHistory.allergies}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-[11px] text-neutral-500 tabular-nums">
                        {petAppointments.length === 1
                          ? '1 cita activa'
                          : `${petAppointments.length} citas activas`}
                      </span>

                      <button
                        onClick={() => handleBookForPet(pet.id)}
                        className="flex items-center gap-0.5 text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
                      >
                        <span>Agendar cita</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
