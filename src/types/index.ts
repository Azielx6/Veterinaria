export type ServiceCategory = 'bath' | 'medical';

export interface VetService {
  id: string;
  category: ServiceCategory;
  name: string;
  shortDescription: string;
  fullDescription: string;
  durationMinutes: number;
  estimatedPrice: number;
  iconName: string;
  tag: string;
  benefits: string[];
}

export interface PetMedicalHistory {
  allergies?: string;
  chronicConditions?: string;
  vaccines?: string;
  generalNotes?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  ageYears: number;
  weightKg: number;
  photoEmoji: string;
  medicalHistory: string; // Resumen del historial médico básico
  detailedHistory?: PetMedicalHistory;
}

export interface Appointment {
  id: string;
  userId: string;
  petId: string;
  serviceId: string;
  serviceCategory: ServiceCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'admin';
}

export interface ClinicInfo {
  name: string;
  tagline: string;
  bio: string;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  hours: {
    weekdays: string;
    saturdays: string;
    emergencies: string;
  };
  rating: number;
  totalReviews: number;
}
