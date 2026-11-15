import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Pet, VetService, Appointment, ServiceCategory } from '../types';
import { INITIAL_USER, INITIAL_PETS, INITIAL_SERVICES, INITIAL_APPOINTMENTS } from '../data/seedData';

export type TabType = 'home' | 'booking' | 'calendar';

export interface SnackbarMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Auth (RF-01, RF-02, RNF-05)
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Navigation (RNF-02)
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Services (RF-03, RF-10)
  services: VetService[];
  preselectedServiceId: string | null;
  startBookingWithService: (serviceId: string) => void;

  // Pets (Pet Profiles Feature)
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id'>) => Pet;
  updatePet: (id: string, updated: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  selectedPetForBooking: string | null;
  setSelectedPetForBooking: (petId: string | null) => void;
  isPetProfilesModalOpen: boolean;
  setIsPetProfilesModalOpen: (open: boolean) => void;

  // Appointments (RF-04, RF-05, RF-06, RF-07, RF-08)
  appointments: Appointment[];
  addAppointment: (data: {
    petId: string;
    serviceId: string;
    serviceCategory: ServiceCategory;
    date: string;
    time: string;
    notes?: string;
  }) => Promise<{ success: boolean; appointment?: Appointment }>;
  cancelAppointment: (id: string) => void;

  // UI state & Feedback
  snackbar: SnackbarMessage | null;
  showSnackbar: (message: string, type?: 'success' | 'error' | 'info') => void;
  closeSnackbar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'mmp_auth_user',
  APPOINTMENTS: 'mmp_appointments',
  PETS: 'mmp_pets',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  // Pets state
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PETS);
      return saved ? JSON.parse(saved) : INITIAL_PETS;
    } catch {
      return INITIAL_PETS;
    }
  });

  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // Services catalog (static verified list)
  const [services] = useState<VetService[]>(INITIAL_SERVICES);

  // UI feedbacks
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  // Sync pets to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
    } catch (e) {
      console.warn('Error saving pets to local storage', e);
    }
  }, [pets]);

  // Sync appointments to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Error saving appointments to local storage', e);
    }
  }, [appointments]);

  // Sync user to local storage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn('Error saving user to local storage', e);
    }
  }, [currentUser]);

  // Snackbar helper
  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setSnackbar({ id, message, type });
  };

  const closeSnackbar = () => {
    setSnackbar(null);
  };

  // Auth: Login (RF-01, RF-02, RNF-04, RNF-05)
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate non-blocking async network call (250ms)
    await new Promise((resolve) => setTimeout(resolve, 250));

    // RF-02: Field validation
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail && !trimmedPassword) {
      showSnackbar('Por favor ingresa tu correo y contraseña.', 'error');
      return { success: false, error: 'Por favor ingresa tu correo y contraseña.' };
    }

    if (!trimmedEmail) {
      showSnackbar('El correo electrónico es obligatorio.', 'error');
      return { success: false, error: 'El correo electrónico es obligatorio.' };
    }

    if (!trimmedPassword) {
      showSnackbar('La contraseña es obligatoria.', 'error');
      return { success: false, error: 'La contraseña es obligatoria.' };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showSnackbar('Ingresa un formato de correo válido (ej: tutor@ejemplo.com).', 'error');
      return { success: false, error: 'Ingresa un formato de correo válido.' };
    }

    // Check password minimum length
    if (trimmedPassword.length < 4) {
      showSnackbar('La contraseña debe tener al menos 4 caracteres.', 'error');
      return { success: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
    }

    // Demo credentials or accept valid user
    const newUser: User = {
      id: trimmedEmail === INITIAL_USER.email ? INITIAL_USER.id : `usr_${Date.now()}`,
      name: trimmedEmail === INITIAL_USER.email ? INITIAL_USER.name : trimmedEmail.split('@')[0],
      email: trimmedEmail,
      phone: trimmedEmail === INITIAL_USER.email ? INITIAL_USER.phone : '+51 900 123 456',
      role: 'client',
    };

    setCurrentUser(newUser);
    showSnackbar(`¡Bienvenido(a) a Mi Mejor Patita, ${newUser.name}!`, 'success');
    return { success: true };
  };

  // Auth: Logout
  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    showSnackbar('Has cerrado sesión correctamente.', 'info');
  };

  // Quick jump from catalog to booking
  const startBookingWithService = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setActiveTab('booking');
  };

  // Pet Profiles modal & preselection
  const [isPetProfilesModalOpen, setIsPetProfilesModalOpen] = useState<boolean>(false);
  const [selectedPetForBooking, setSelectedPetForBooking] = useState<string | null>(null);

  // Add pet
  const addPet = (petData: Omit<Pet, 'id'>): Pet => {
    const newPet: Pet = {
      ...petData,
      id: `pet_${Date.now()}`,
    };
    setPets((prev) => [newPet, ...prev]);
    showSnackbar(`¡Perfil de ${newPet.name} creado exitosamente!`, 'success');
    return newPet;
  };

  // Update pet
  const updatePet = (id: string, updated: Partial<Pet>) => {
    setPets((prev) =>
      prev.map((pet) => (pet.id === id ? { ...pet, ...updated } : pet))
    );
    showSnackbar('Perfil de mascota actualizado.', 'success');
  };

  // Delete pet
  const deletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
    showSnackbar('Perfil de mascota eliminado.', 'info');
  };

  // Add appointment (RF-05)
  const addAppointment = async (data: {
    petId: string;
    serviceId: string;
    serviceCategory: ServiceCategory;
    date: string;
    time: string;
    notes?: string;
  }): Promise<{ success: boolean; appointment?: Appointment }> => {
    // Simulate async DB insert (150ms)
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (!currentUser) {
      showSnackbar('Debes iniciar sesión para agendar una cita.', 'error');
      return { success: false };
    }

    const newAppointment: Appointment = {
      id: `apt_${Date.now()}`,
      userId: currentUser.id,
      petId: data.petId,
      serviceId: data.serviceId,
      serviceCategory: data.serviceCategory,
      date: data.date,
      time: data.time,
      notes: data.notes?.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    showSnackbar('¡Cita registrada y confirmada exitosamente!', 'success');
    return { success: true, appointment: newAppointment };
  };

  // Cancel appointment
  const cancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showSnackbar('La cita ha sido cancelada correctamente.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        activeTab,
        setActiveTab,
        services,
        preselectedServiceId,
        startBookingWithService,
        pets,
        addPet,
        updatePet,
        deletePet,
        selectedPetForBooking,
        setSelectedPetForBooking,
        isPetProfilesModalOpen,
        setIsPetProfilesModalOpen,
        appointments,
        addAppointment,
        cancelAppointment,
        snackbar,
        showSnackbar,
        closeSnackbar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
