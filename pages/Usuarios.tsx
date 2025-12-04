
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../supabaseClient';

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('app_users').select('*');
      if (!error && data) {
        const mappedUsers: User[] = data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: new Date(u.created_at).toLocaleDateString('pt-BR')
        }));
        setUsers(mappedUsers);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
           <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>Administração</span> <span className="material-symbols-outlined text-xs">chevron_right</span> <span className="text-slate-900 font-medium">Usuários</span>
           </div>
           <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Controle de Usuários e Permissões</h1>
           <p className="text-slate-500 mt-1 text-sm md:text-base">Gerencie o acesso e as ações de cada colaborador no sistema.</p>
        </div>
        <button className="w-full md:w-auto bg-primary text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2">
           <span className="material-symbols-outlined text-lg">add</span> Adicionar Novo Usuário
        </button>
      </div>

      <div className="mb-6 border-b border-slate-200 overflow-x-auto">
         <nav className="flex gap-6 text-sm font-medium min-w-max">
            <button className="border-b-2 border-primary text-primary pb-3 whitespace-nowrap">Usuários</button>
            <button className="border-b-2 border-transparent text-slate-500 pb-3 hover:text-slate-800 whitespace-nowrap">Perfis de Permissão</button>
            <button className="border-b-2 border-transparent text-slate-500 pb-3 hover:text-slate-800 whitespace-nowrap">Log de Auditoria</button>
         </nav>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
         <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input type="text" placeholder="Buscar por nome, e-mail ou perfil..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-primary focus:border-primary outline-none" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
               <select className="w-full sm:w-40 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none bg-white">
                  <option>Perfil de Permissão</option>
                  <option>Todos</option>
               </select>
               <select className="w-full sm:w-32 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none bg-white">
                  <option>Status</option>
                  <option>Todos</option>
               </select>
            </div>
         </div>

         <div className="overflow-x-auto">
            {loading ? (
                <div className="p-8 text-center text-slate-500">Carregando usuários...</div>
            ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                  <tr>
                     <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded border-slate-300 text-primary" /></th>
                     <th className="px-6 py-4">Nome do Usuário</th>
                     <th className="px-6 py-4">E-mail</th>
                     <th className="px-6 py-4">Perfil de Permissão</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Data de Criação</th>
                     <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                     <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300 text-primary" /></td>
                        <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                        <td className="px-6 py-4 text-slate-600">{u.email}</td>
                        <td className="px-6 py-4 text-slate-600">{u.role}</td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              u.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                           }`}>
                              <span className={`size-1.5 rounded-full ${u.status === 'Ativo' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                              {u.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">{u.createdAt}</td>
                        <td className="px-6 py-4 text-center">
                           <div className="flex items-center justify-center gap-2 text-slate-400">
                              <button className="hover:text-primary bg-white border border-slate-200 p-1.5 rounded shadow-sm hover:shadow"><span className="material-symbols-outlined text-sm">edit</span></button>
                              <button className="hover:text-red-500 bg-white border border-slate-200 p-1.5 rounded shadow-sm hover:shadow"><span className="material-symbols-outlined text-sm">delete</span></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            )}
         </div>
      </div>
    </div>
  );
}
