
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validação básica de campos vazios
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos.');
      }

      // 1. Verificar se o usuário existe na tabela app_users e buscar senha
      const { data: user, error: dbError } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (dbError) {
        console.error('Erro de conexão:', dbError);
        throw new Error('Erro ao conectar com o banco de dados.');
      }

      // SE O USUÁRIO NÃO EXISTIR
      if (!user) {
        setLoading(false);
        setShowRegisterModal(true); // Abre o modal avisando que precisa cadastrar
        return;
      }

      // 2. Verificar senha (simulação simples, em produção usaríamos auth.signInWithPassword ou hash)
      // Se a coluna password existir no banco, verificamos. Se não (legado), permitimos (ou falhamos seguro).
      if (user.password && user.password !== password) {
        throw new Error('Senha incorreta.');
      }

      // Verificar status do usuário
      if (user.status !== 'Ativo') {
        throw new Error('Este usuário está inativo. Contate o administrador.');
      }

      // Login bem-sucedido
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Erro ao tentar fazer login.');
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
            <h1 className="text-3xl font-black text-slate-900 mb-2">Acesse o Portal</h1>
            <p className="text-slate-500">Entre com seus dados para gerenciar o cartório ou acessar serviços.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
               <label className="text-sm font-semibold text-slate-700">E-mail</label>
               <input 
                  type="email" 
                  required
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               />
            </div>
            
            <div className="flex flex-col gap-1.5">
               <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700">Senha</label>
                  <a href="#" className="text-sm text-primary font-bold hover:underline">Esqueceu a senha?</a>
               </div>
               <div className="relative">
                 <input 
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Digite sua senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                 'Entrar'
               )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm">Ou entre com</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex flex-col gap-3">
             <button type="button" className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-blue-600">verified_user</span>
                Acessar com Certificado Digital
             </button>
             <button type="button" className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-slate-600">qr_code_2</span>
                Login com QR Code
             </button>
          </div>
          
          <p className="text-center text-sm text-slate-500 mt-4">
             Não tem uma conta? <button onClick={() => navigate('/cadastro')} className="text-primary font-bold hover:underline">Cadastre-se</button>
          </p>
        </div>
        
        <div className="absolute bottom-4 md:bottom-8 text-center text-xs text-slate-400 w-full">
           © 2024 Cartório SaaS. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block w-1/2 bg-slate-900 relative overflow-hidden">
        <img 
           src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop" 
           alt="Lawyer signing documents" 
           className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-20 left-16 max-w-md text-white">
           <h2 className="text-4xl font-bold mb-4">Gestão inteligente para o seu cartório.</h2>
           <p className="text-slate-300 text-lg">Automatize processos, organize documentos e controle as finanças em um único lugar.</p>
        </div>
      </div>

      {/* MODAL DE USUÁRIO NÃO ENCONTRADO */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 flex flex-col items-center text-center">
            <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
               <span className="material-symbols-outlined text-red-600 text-3xl">person_off</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Acesso Negado</h3>
            <p className="text-slate-600 mb-6">
              Este e-mail não consta em nossa base de usuários ativos. <br/>
              <strong>Para fazer login, você precisa estar cadastrado no sistema.</strong>
            </p>
            
            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={() => {
                    navigate('/cadastro');
                    setShowRegisterModal(false);
                }}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Fazer Cadastro Agora
              </button>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Tentar outro E-mail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
