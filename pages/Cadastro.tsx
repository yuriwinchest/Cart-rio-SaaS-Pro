
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Preencha todos os campos obrigatórios.');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem.');
      }

      if (formData.password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('app_users')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Este e-mail já está cadastrado.');
      }

      // Insert new user
      const { error: insertError } = await supabase
        .from('app_users')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            password: formData.password, // In production, hash this!
            role: 'Atendente', // Default role
            status: 'Ativo'
          }
        ]);

      if (insertError) throw insertError;

      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');

    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 relative">
        <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2">
            <div className="size-8 bg-slate-900 rounded-full flex items-center justify-center">
                 <span className="material-symbols-outlined text-white text-lg">gavel</span>
            </div>
            <span className="font-bold text-slate-900">Cartório Digital</span>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-6 mt-12 md:mt-0">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Criar Conta</h1>
            <p className="text-slate-500">Preencha os dados abaixo para se cadastrar no sistema.</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
               <label className="text-sm font-semibold text-slate-700">Nome Completo</label>
               <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Seu nome" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               />
            </div>

            <div className="flex flex-col gap-1.5">
               <label className="text-sm font-semibold text-slate-700">E-mail</label>
               <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="seu@email.com" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               />
            </div>
            
            <div className="flex flex-col gap-1.5">
               <label className="text-sm font-semibold text-slate-700">Senha</label>
               <div className="relative">
                 <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Crie uma senha" 
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-10"
                 />
                 <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                 >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                 </button>
               </div>
            </div>

            <div className="flex flex-col gap-1.5">
               <label className="text-sm font-semibold text-slate-700">Confirmar Senha</label>
               <div className="relative">
                 <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    placeholder="Repita a senha" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-10"
                 />
                 <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                 >
                    <span className="material-symbols-outlined text-xl">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                 </button>
               </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors mt-2 text-center flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
               {loading ? (
                 <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
               ) : (
                 'Cadastrar'
               )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
             Já tem uma conta? <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline">Fazer Login</button>
          </p>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block w-1/2 bg-slate-900 relative overflow-hidden">
        <img 
           src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop" 
           alt="Office meeting" 
           className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-20 left-16 max-w-md text-white">
           <h2 className="text-4xl font-bold mb-4">Junte-se à revolução digital.</h2>
           <p className="text-slate-300 text-lg">Crie sua conta e comece a otimizar a gestão do seu cartório hoje mesmo.</p>
        </div>
      </div>
    </div>
  );
}
