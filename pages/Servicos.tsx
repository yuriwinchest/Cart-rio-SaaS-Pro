import React from 'react';
import { Service } from '../types';

const services: Service[] = [
  { id: '1', name: 'Procuração Pública', attribution: 'Tabelionato de Notas', model: 'Modelo Procuração v2', numbering: 'Automática', status: 'Ativo' },
  { id: '2', name: 'Escritura de Compra e Venda', attribution: 'Tabelionato de Notas', model: 'Escritura Padrão', numbering: 'Manual', status: 'Ativo' },
  { id: '3', name: 'Registro de Nascimento', attribution: 'Registro Civil', model: 'Certidão Nascimento 2024', numbering: 'Automática', status: 'Ativo' },
  { id: '4', name: 'Matrícula de Imóvel', attribution: 'Registro de Imóveis', model: 'Matrícula Imobiliária v1.3', numbering: 'Automática', status: 'Inativo' },
];

export default function Servicos() {
  return (
    <div className="flex h-full gap-6">
       {/* Inner Sidebar for Filters (Img 9 style) */}
       <div className="w-64 flex-shrink-0 hidden lg:block">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Atribuições</h3>
          <div className="space-y-1">
             <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
                <span className="material-symbols-outlined text-lg fill">description</span> Tabelionato de Notas
             </button>
             <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100">
                <span className="material-symbols-outlined text-lg">group</span> Registro Civil
             </button>
             <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100">
                <span className="material-symbols-outlined text-lg">home</span> Registro de Imóveis
             </button>
             <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100">
                <span className="material-symbols-outlined text-lg">assignment</span> Títulos e Documentos
             </button>
             <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100">
                <span className="material-symbols-outlined text-lg">warning</span> Protesto
             </button>
          </div>
          <button className="mt-4 w-full border border-primary text-primary font-bold text-sm py-2 rounded-lg hover:bg-primary/5">
             Adicionar Atribuição
          </button>
       </div>

       {/* Main Table Area */}
       <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Serviços e Atos</h1>
             <button className="bg-primary text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">add_circle</span> Novo Serviço/Ato
             </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col">
             <div className="p-4 border-b border-slate-200 flex gap-4">
                <div className="relative flex-1 max-w-md">
                   <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                   <input type="text" placeholder="Buscar por nome do serviço ou ato..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-primary focus:border-primary outline-none" />
                </div>
                <div className="ml-auto flex gap-2">
                   <select className="border border-slate-200 rounded-lg text-sm text-slate-600 px-3 py-2 outline-none">
                      <option>Filtrar por Atribuição</option>
                      <option>Todas</option>
                   </select>
                   <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"><span className="material-symbols-outlined text-lg">download</span></button>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                         <th className="px-6 py-3">Nome do Serviço/Ato</th>
                         <th className="px-6 py-3">Atribuição</th>
                         <th className="px-6 py-3">Modelo Associado</th>
                         <th className="px-6 py-3">Numeração</th>
                         <th className="px-6 py-3">Status Padrão</th>
                         <th className="px-6 py-3 text-right">Ações</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {services.map(s => (
                         <tr key={s.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                            <td className="px-6 py-4 text-slate-600">{s.attribution}</td>
                            <td className="px-6 py-4 text-slate-600">{s.model}</td>
                            <td className="px-6 py-4 text-slate-600">{s.numbering}</td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{s.status}</span>
                                  {/* Toggle Switch Simulation */}
                                  <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${s.status === 'Ativo' ? 'bg-primary' : 'bg-slate-300'}`}>
                                     <div className={`size-3 bg-white rounded-full absolute top-0.5 transition-all ${s.status === 'Ativo' ? 'left-4.5' : 'left-0.5'}`}></div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-2 text-slate-400">
                                  <button className="hover:text-primary"><span className="material-symbols-outlined text-lg">edit</span></button>
                                  <button className="hover:text-primary"><span className="material-symbols-outlined text-lg">content_copy</span></button>
                                  <button className="hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       </div>
    </div>
  );
}