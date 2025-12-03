import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen flex w-full">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-16 relative">
        <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="size-8 bg-slate-900 rounded-full flex items-center justify-center">
                 <span className="material-symbols-outlined text-white text-lg">gavel</span>
            </div>
            <span className="font-bold text-slate-900">Cartório Digital</span>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Acesse o Portal</h1>
            <p className="text-slate-500">Entre com seus dados para gerenciar o cartório ou acessar serviços.</p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
               <label className="text-sm font-semibold text-slate-700">E-mail ou CPF</label>
               <input 
                  type="text" 
                  placeholder="Digite seu e-mail ou CPF" 
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
                    type="password" 
                    placeholder="Digite sua senha" 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-10"
                 />
                 <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">visibility</span>
               </div>
            </div>

            <Link to="/" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors mt-2 text-center">
               Entrar
            </Link>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm">Ou entre com</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex flex-col gap-3">
             <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-blue-600">verified_user</span>
                Acessar com Certificado Digital
             </button>
             <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-slate-600">qr_code_2</span>
                Login com QR Code
             </button>
          </div>
          
          <p className="text-center text-sm text-slate-500 mt-4">
             Não tem uma conta? <a href="#" className="text-primary font-bold hover:underline">Cadastre-se</a>
          </p>
        </div>
        
        <div className="absolute bottom-8 text-center text-xs text-slate-400 w-full">
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
    </div>
  );
}