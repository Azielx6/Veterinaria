import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USER } from '../../data/seedData';
import { Mail, Lock, Eye, EyeOff, PawPrint } from 'lucide-react';

export const LoginActivity: React.FC = () => {
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = 'Ingresa tu correo electrónico';
    if (!password.trim()) errors.password = 'Ingresa tu contraseña';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
    }

    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  const handleUseDemoAccount = () => {
    setEmail(INITIAL_USER.email);
    setPassword('clave123');
    setFieldErrors({});
  };

  return (
    <div className="flex-1 flex flex-col justify-center p-6 bg-neutral-50 min-h-full">
      <div className="mb-8 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-teal-700 text-white flex items-center justify-center">
          <PawPrint className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Mi Mejor Patita
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Clínica Veterinaria · Ingresa a tu cuenta
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-neutral-200">
        <h2 className="text-base font-semibold text-neutral-900 mb-4">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5" htmlFor="email-input">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="correo@ejemplo.com"
                className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.email
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-neutral-300 focus:ring-teal-600/20 focus:border-teal-700'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <span className="text-xs text-red-600 mt-1 block">
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5" htmlFor="password-input">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.password
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-neutral-300 focus:ring-teal-600/20 focus:border-teal-700'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="text-xs text-red-600 mt-1 block">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Ingresar</span>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-neutral-100 text-center">
          <button
            type="button"
            onClick={handleUseDemoAccount}
            className="text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
          >
            Autocompletar usuario de prueba ({INITIAL_USER.email})
          </button>
        </div>
      </div>
    </div>
  );
};
