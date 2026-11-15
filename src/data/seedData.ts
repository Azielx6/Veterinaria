import { VetService, Pet, Appointment, ClinicInfo, User } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_001',
  name: 'Carolina Méndez',
  email: 'tutor@ejemplo.com',
  phone: '+51 987 654 321',
  role: 'client',
};

export const CLINIC_INFO: ClinicInfo = {
  name: 'Mi Mejor Patita',
  tagline: 'Centro Veterinario Integral & Estética Animal',
  bio: 'En Mi Mejor Patita cuidamos a tus engreídos con dedicación profesional, tecnología médica avanzada e instalaciones pensadas para su confort y bienestar.',
  address: 'Av. Las Palmeras 482, San Isidro',
  neighborhood: 'Sector Financiero',
  city: 'Lima, Perú',
  phone: '(01) 456-7890',
  emergencyPhone: '+51 912 345 678',
  email: 'contacto@mimejorpatita.com',
  hours: {
    weekdays: 'Lunes a Viernes: 08:30 AM - 07:30 PM',
    saturdays: 'Sábados: 09:00 AM - 05:00 PM',
    emergencies: 'Urgencias 24/7 con previa llamada',
  },
  rating: 4.9,
  totalReviews: 328,
};

export const INITIAL_SERVICES: VetService[] = [
  {
    id: 'srv_bath',
    category: 'bath',
    name: 'Baño',
    shortDescription: 'Servicio integral de baño, higiene, secado y cepillado profesional para tu mascota.',
    fullDescription: 'Baño completo con agua temperada a 36°C, shampoo especial neutro para mascotas, secado con toalla y turbina silenciosa, limpieza de oídos y cepillado.',
    durationMinutes: 45,
    estimatedPrice: 45,
    iconName: 'Droplets',
    tag: 'Higiene & Confort',
    benefits: ['Agua temperada antiestrés', 'Shampoo neutro para mascotas', 'Secado tibio y cepillado'],
  },
  {
    id: 'srv_medical',
    category: 'medical',
    name: 'Cita Médica',
    shortDescription: 'Examen clínico general y diagnóstico veterinario integral para tu mascota.',
    fullDescription: 'Consulta médica completa con evaluación de peso, auscultación cardiopulmonar, revisión de ojos, oídos y ganglios, diagnóstico y prescripción veterinaria.',
    durationMinutes: 30,
    estimatedPrice: 50,
    iconName: 'Stethoscope',
    tag: 'Salud Veterinaria',
    benefits: ['Evaluación clínica completa', 'Control de constantes vitales', 'Receta médica y recomendaciones'],
  },
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet_001',
    name: 'Luna',
    species: 'dog',
    breed: 'Caniche Toy',
    ageYears: 3,
    weightKg: 4.2,
    photoEmoji: '🐩',
    medicalHistory: 'Piel reactiva a químicos fuertes. Esquema de vacunas 2026 completo. Esterilizada en 2024.',
    detailedHistory: {
      allergies: 'Sensibilidad cutánea a detergentes artificiales',
      chronicConditions: 'Dermatitis atópica estacional',
      vaccines: 'Quíntuple y Antirrábica vigentes hasta Noviembre 2026',
      generalNotes: 'Tolera muy bien las consultas si se le ofrecen premios de pollo.',
    },
  },
  {
    id: 'pet_002',
    name: 'Rocky',
    species: 'dog',
    breed: 'Golden Retriever',
    ageYears: 4,
    weightKg: 29.5,
    photoEmoji: '🐕',
    medicalHistory: 'Chequeo articular semestral favorable. Desparasitación interna al día. Ninguna alergia conocida.',
    detailedHistory: {
      allergies: 'Ninguna conocida',
      chronicConditions: 'Monitoreo de cadera preventiva (displasia descartada)',
      vaccines: 'Vacunación anual séxtuple al día',
      generalNotes: 'Muy sociable y paciente en el baño y corte.',
    },
  },
  {
    id: 'pet_003',
    name: 'Milo',
    species: 'cat',
    breed: 'Gato Siamés',
    ageYears: 2,
    weightKg: 4.1,
    photoEmoji: '🐈',
    medicalHistory: 'Vacuna contra la leucemia felina y triple felina aplicadas. Control de bolas de pelo con malta.',
    detailedHistory: {
      allergies: 'Sensibilidad a ruidos estrepitosos (estrés acústico)',
      chronicConditions: 'Ninguna',
      vaccines: 'Triple felina y Rabia vigentes',
      generalNotes: 'Requiere transportadora oscura y toalla tibia para secado.',
    },
  },
];

// Helper to get formatted date string: YYYY-MM-DD
export function getRelativeDateString(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_001',
    userId: 'usr_001',
    petId: 'pet_001',
    serviceId: 'srv_bath',
    serviceCategory: 'bath',
    date: getRelativeDateString(1), // Tomorrow
    time: '10:30',
    notes: 'Baño con shampoo neutro, piel sensible.',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt_002',
    userId: 'usr_001',
    petId: 'pet_002',
    serviceId: 'srv_medical',
    serviceCategory: 'medical',
    date: getRelativeDateString(3), // In 3 days
    time: '15:00',
    notes: 'Chequeo médico de rutina y control general.',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];
