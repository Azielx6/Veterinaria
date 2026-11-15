import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  X,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Sparkles,
  Smartphone,
  Layers,
  Heart,
} from 'lucide-react';

export const RubricModal: React.FC = () => {
  const { isRubricModalOpen, setIsRubricModalOpen } = useApp();

  if (!isRubricModalOpen) return null;

  const functionalRequirements = [
    { code: 'RF-01', module: 'Autenticación', name: 'Inicio de Sesión (Login)', status: 'Cumplido' },
    { code: 'RF-02', module: 'Autenticación', name: 'Validación de Credenciales', status: 'Cumplido' },
    { code: 'RF-03', module: 'Módulo 1: Reserva', name: 'Selección de Servicio (Baño vs Médica)', status: 'Cumplido' },
    { code: 'RF-04', module: 'Módulo 1: Reserva', name: 'Selección de Fecha y Hora (Bloqueo pasadas)', status: 'Cumplido' },
    { code: 'RF-05', module: 'Módulo 1: Reserva', name: 'Registro de Cita vinculado a Usuario', status: 'Cumplido' },
    { code: 'RF-06', module: 'Módulo 2: Calendario', name: 'Visualización en Calendario interactivo', status: 'Cumplido' },
    { code: 'RF-07', module: 'Módulo 2: Calendario', name: 'Listado Dinámico de Citas', status: 'Cumplido' },
    { code: 'RF-08', module: 'Módulo 2: Calendario', name: 'Estado Vacío (Empty State)', status: 'Cumplido' },
    { code: 'RF-09', module: 'Módulo 3: Informativo', name: 'Landing Page Institucional', status: 'Cumplido' },
    { code: 'RF-10', module: 'Módulo 3: Informativo', name: 'Catálogo de Servicios con CardViews', status: 'Cumplido' },
    { code: 'EXTRA', module: 'Perfiles', name: 'Pet Profiles & Historial Médico vinculado', status: 'Cumplido' },
  ];

  const nonFunctionalRequirements = [
    { code: 'RNF-01', desc: 'Plataforma y Compatibilidad nativa Android/Web responsive' },
    { code: 'RNF-02', desc: 'BottomNavigationView con Fragments (Home, Booking, Calendar)' },
    { code: 'RNF-03', desc: 'Diseño Material Design 3 con adaptabilidad fluida' },
    { code: 'RNF-04', desc: 'Rendimiento asíncrono y consultas en menos de 1.5s' },
    { code: 'RNF-05', desc: 'Contraseñas enmascaradas (textPassword) y almacenamiento persistente' },
  ];

  const userStories = [
    { id: 'HU-01', role: 'Cliente', desc: 'Iniciar sesión con cuenta y validación de campos' },
    { id: 'HU-02', role: 'Cliente', desc: 'Seleccionar Baño o Cita Médica con fecha y hora' },
    { id: 'HU-03', role: 'Cliente', desc: 'Ver calendario con citas programadas y estado vacío' },
    { id: 'HU-04', role: 'Cliente', desc: 'Explorar presentación institucional y servicios veterinarios' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight font-heading">
                Matriz de Requerimientos & Rúbrica
              </h2>
              <p className="text-[10px] text-slate-400">
                Verificación de RF-01 al RF-10, RNF-01 al RNF-05 y HU-01 al HU-04
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRubricModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Functional Requirements Table */}
          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Requerimientos Funcionales (RF)</span>
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-[10px] text-slate-600 font-bold uppercase">
                  <tr>
                    <th className="p-2">Código</th>
                    <th className="p-2">Módulo</th>
                    <th className="p-2">Requerimiento</th>
                    <th className="p-2 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {functionalRequirements.map((rf) => (
                    <tr key={rf.code} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-slate-800">{rf.code}</td>
                      <td className="p-2 text-slate-500">{rf.module}</td>
                      <td className="p-2 font-medium text-slate-700">{rf.name}</td>
                      <td className="p-2 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          ✓ {rf.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Non-Functional Requirements */}
          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Requerimientos No Funcionales (RNF)</span>
            </h3>
            <div className="space-y-1.5">
              {nonFunctionalRequirements.map((rnf) => (
                <div
                  key={rnf.code}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5"
                >
                  <span className="font-bold text-emerald-700 shrink-0 text-[11px]">
                    {rnf.code}
                  </span>
                  <span className="text-slate-600 leading-snug">{rnf.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* User Stories */}
          <section className="space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>3. Historias de Usuario (Scrum / Ágil)</span>
            </h3>
            <div className="space-y-1.5">
              {userStories.map((hu) => (
                <div
                  key={hu.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5"
                >
                  <span className="font-bold text-slate-800 shrink-0 text-[11px]">{hu.id}</span>
                  <div className="text-slate-600 leading-snug">
                    <span className="font-semibold text-slate-700">{hu.role}: </span>
                    {hu.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsRubricModalOpen(false)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
