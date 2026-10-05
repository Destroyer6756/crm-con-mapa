import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Zap, Shield, Lock, Mail, User, Building, AlertCircle,
  CheckCircle2, Clock, ArrowRight, Server, Globe, Key, FileText, Check
} from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regReason, setRegReason] = useState('');

  // Status message state
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success' | 'warning'; text: string } | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!email.trim() || !password.trim()) {
      setStatusMsg({ type: 'error', text: 'Por favor, ingresa tu correo y contraseña.' });
      return;
    }

    const res = login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      if (res.message.includes('⏳')) {
        setStatusMsg({ type: 'warning', text: res.message });
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setStatusMsg({ type: 'error', text: 'Todos los campos obligatorios deben completarse.' });
      return;
    }

    const res = register(regName, regEmail, regPassword, regDepartment, regReason);
    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      setIsRegisterMode(false);
      // Reset register form
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegDepartment('');
      setRegReason('');
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-[#070D19]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main Container - Extended for Desktop (PC) & Mobile (Celular) */}
      <div className="w-full max-w-6xl z-10 my-auto animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Section (Branding & System Capabilities - Visible on PC & Mobile) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-xs font-bold text-blue-400 tracking-wide uppercase">
                CloudOps Management Platform
              </span>
            </div>

            {/* Hero Heading */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Control de Infraestructura <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  & Acceso Seguro Cloud
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                Sistema centralizado con autenticación de usuarios, autorización de roles y aprobación previa por el Administrador antes del ingreso.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                { icon: <Shield className="text-purple-400" size={18} />, title: 'Aprobación de Admin', desc: 'Acceso restringido por autorización previa' },
                { icon: <Key className="text-blue-400" size={18} />, title: 'Permisos Granulares', desc: 'Control de módulos por perfil de usuario' },
                { icon: <Server className="text-emerald-400" size={18} />, title: 'Monitoreo Multi-Región', desc: 'Visibilidad total de infraestructura AWS' },
                { icon: <Globe className="text-amber-400" size={18} />, title: 'Gestión de Costos', desc: 'Auditoría en tiempo real de presupuestos' },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="p-3.5 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md flex items-start gap-3 hover:border-blue-500/30 transition-all"
                >
                  <div className="p-2 rounded-xl bg-white/5 flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Sistema Operativo v2.0
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10">
                <Check size={12} className="text-blue-400" />
                Seguridad IAM & VPC
              </span>
            </div>
          </div>

          {/* Right Section: Form Card (Expands on PC, Full Responsive on Celular) */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div
              className="rounded-3xl border p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl"
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Form Title & Tabs */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {isRegisterMode ? 'Solicitar Acceso al Sistema' : 'Iniciar Sesión'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {isRegisterMode
                        ? 'Registra tus datos para evaluación del Administrador'
                        : 'Ingresa tus credenciales autorizadas'}
                    </p>
                  </div>
                </div>

                {/* Mode Switcher Tabs */}
                <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(false); setStatusMsg(null); }}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                      !isRegisterMode
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsRegisterMode(true); setStatusMsg(null); }}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                      isRegisterMode
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Solicitar Acceso
                  </button>
                </div>
              </div>

              {/* Status Message Banners */}
              {statusMsg && (
                <div
                  className={`p-4 rounded-2xl mb-6 text-xs leading-relaxed flex items-start gap-3 border ${
                    statusMsg.type === 'error'
                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                      : statusMsg.type === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {statusMsg.type === 'error' && <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />}
                  {statusMsg.type === 'warning' && <Clock size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />}
                  {statusMsg.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />}
                  <div>{statusMsg.text}</div>
                </div>
              )}

              {/* FORM: INICIAR SESIÓN */}
              {!isRegisterMode ? (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@cloudops.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-sm outline-none focus:border-blue-500 transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-sm outline-none focus:border-blue-500 transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 mt-2"
                  >
                    Ingresar al Sistema <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                /* FORM: SOLICITAR ACCESO */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nombre Completo *
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Juan Pérez"
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Área / Departamento
                      </label>
                      <div className="relative">
                        <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          value={regDepartment}
                          onChange={(e) => setRegDepartment(e.target.value)}
                          placeholder="Ej: DevOps, IT, Finanzas"
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="juan.perez@cloudops.com"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Contraseña Deseada *
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Motivo de Solicitud de Acceso
                    </label>
                    <div className="relative">
                      <FileText size={16} className="absolute left-3.5 top-3 text-slate-500" />
                      <textarea
                        rows={2.5}
                        value={regReason}
                        onChange={(e) => setRegReason(e.target.value)}
                        placeholder="Describe brevemente las funciones que realizarás en la plataforma..."
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-xs text-blue-300 leading-relaxed flex items-start gap-2.5">
                    <Clock size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <b>Control de Aprobación:</b> Al enviar tu solicitud, el Administrador del sistema la evaluará en su panel. Recibirás acceso tan pronto sea aprobada.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 mt-2"
                  >
                    Enviar Solicitud al Administrador <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Global Footer info */}
        <p className="text-center text-xs text-slate-500 mt-8">
          CloudOps Dashboard &copy; 2026 — Sistema de Autorización y Permisos Cloud
        </p>
      </div>
    </div>
  );
};

export default Login;
