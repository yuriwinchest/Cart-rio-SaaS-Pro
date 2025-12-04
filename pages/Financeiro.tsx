import React from 'react';
import { Transaction } from '../types';

const transactions: Transaction[] = [
  { id: '1', time: '14:32', description: 'Reconhecimento de firma', type: 'Receita', method: 'PIX', amount: 15.50 },
  { id: '2', time: '13:15', description: 'Pagamento conta de luz', type: 'Despesa', method: 'Boleto', amount: -350.00 },
  { id: '3', time: '11:58', description: 'Autenticação de cópia (5x)', type: 'Receita', method: 'Cartão de Débito', amount: 45.00 },
  { id: '4', time: '10:05', description: 'Compra de material de escritório', type: 'Despesa', method: 'Cartão', amount: -120.70 },
  { id: '5', time: '09:12', description: 'Procuração pública', type: 'Receita', method: 'Dinheiro', amount: 280.00 },
];

export default function Financeiro() {
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Controle Financeiro</h1>
          <p className="text-slate-500">Caixa Diário - Acompanhe as movimentações.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full lg:w-auto">
           <div className="relative flex-1 lg:flex-none">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                type="text" 
                placeholder="Buscar lançamentos..." 
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
              />
           </div>
           <div className="flex gap-2">
             <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 font-bold text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
               <span className="material-symbols-outlined text-sm">calendar_today</span>
               <span className="whitespace-nowrap">Hoje</span>
             </button>
             <button className="flex-1 sm:flex-none bg-primary text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
               Fechar Caixa
             </button>
           </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
           <p className="text-slate-500 font-medium mb-1 text-sm">Saldo Inicial</p>
           <p className="text-2xl font-bold text-slate-900">R$ 5.120,00</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
           <p className="text-green-600 font-medium mb-1 text-sm">Total Entradas</p>
           <p className="text-2xl font-bold text-slate-900">R$ 8.750,50</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
           <p className="text-red-600 font-medium mb-1 text-sm">Total Saídas</p>
           <p className="text-2xl font-bold text-slate-900">R$ 3.210,00</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-xl">
           <p className="text-primary font-bold mb-1 text-sm">Saldo Atual</p>
           <p className="text-2xl font-bold text-primary">R$ 10.660,50</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div className="w-full md:w-auto overflow-x-auto">
             <nav className="flex gap-6 text-sm font-bold min-w-max pb-1">
               <button className="text-primary border-b-2 border-primary pb-2 -mb-2.5 whitespace-nowrap">Movimentações do Dia</button>
               <button className="text-slate-500 hover:text-slate-700 whitespace-nowrap">Contas a Pagar</button>
               <button className="text-slate-500 hover:text-slate-700 whitespace-nowrap">Contas a Receber</button>
               <button className="text-slate-500 hover:text-slate-700 whitespace-nowrap">Relatórios</button>
             </nav>
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-primary text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-primary/90">
                <span className="material-symbols-outlined text-sm">add</span> Lançar Receita
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-200">
                <span className="material-symbols-outlined text-sm">remove</span> Lançar Despesa
              </button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
               <tr>
                 <th className="px-6 py-3">Hora</th>
                 <th className="px-6 py-3">Descrição</th>
                 <th className="px-6 py-3">Tipo</th>
                 <th className="px-6 py-3">Meio de Pagamento</th>
                 <th className="px-6 py-3 text-right">Valor</th>
                 <th className="px-6 py-3 text-center">Ações</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {transactions.map(t => (
                 <tr key={t.id} className="hover:bg-slate-50 group">
                    <td className="px-6 py-4 text-slate-500 font-mono">{t.time}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        t.type === 'Receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                      {t.method === 'PIX' && <span className="material-symbols-outlined text-sm">qr_code</span>}
                      {t.method === 'Boleto' && <span className="material-symbols-outlined text-sm">barcode</span>}
                      {t.method.includes('Cartão') && <span className="material-symbols-outlined text-sm">credit_card</span>}
                      {t.method === 'Dinheiro' && <span className="material-symbols-outlined text-sm">payments</span>}
                      {t.method}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${
                        t.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {t.amount > 0 ? 'R$' : '- R$'} {Math.abs(t.amount).toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}