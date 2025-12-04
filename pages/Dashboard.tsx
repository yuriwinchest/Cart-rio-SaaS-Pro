
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const data = [
  { name: 'Seg', uv: 40 },
  { name: 'Ter', uv: 65 },
  { name: 'Qua', uv: 55 },
  { name: 'Qui', uv: 85 },
  { name: 'Sex', uv: 60 },
  { name: 'Sab', uv: 20 },
  { name: 'Dom', uv: 10 },
];

const pieData = [
  { name: 'Em Andamento', value: 39, color: '#2563eb' }, // blue-600
  { name: 'Aguardando', value: 16, color: '#f59e0b' }, // amber-500
  { name: 'Finalizado', value: 10, color: '#10b981' }, // emerald-500
];

const StatCard = ({ title, value, icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-2">
    <div className="flex justify-between items-start">
        <span className="text-slate-500 font-medium text-sm">{title}</span>
        <span className={`material-symbols-outlined ${colorClass}`}>{icon}</span>
    </div>
    <span className="text-3xl font-bold text-slate-900">{value}</span>
  </div>
);

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Painel Administrativo</h2>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Bem-vinda de volta, Ana! Aqui está o resumo de hoje.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <button className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 justify-center">Hoje</button>
           <Link 
             to="/atendimentos" 
             state={{ openModal: true }}
             className="flex-1 md:flex-none bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
           >
             <span className="material-symbols-outlined text-lg">add</span> Novo Atendimento
           </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard title="Atendimentos Hoje" value="112" icon="groups" colorClass="text-primary" />
        <StatCard title="Arrecadação do Dia" value="R$ 12.580" icon="payments" colorClass="text-green-500" />
        <StatCard title="Processos Pendentes" value="45" icon="pending_actions" colorClass="text-amber-500" />
        <StatCard title="Concluídos Hoje" value="67" icon="task_alt" colorClass="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 min-w-0">
           <h3 className="font-bold text-lg text-slate-800 mb-6">Atendimentos da Semana</h3>
           <div className="h-64 sm:h-72 w-full min-w-0">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="uv" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#1152d4" opacity={entry.uv > 80 ? 1 : 0.7} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col min-w-0">
            <h3 className="font-bold text-lg text-slate-800 mb-6">Status de Serviços</h3>
            <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-slate-900">65</span>
                  <span className="text-xs text-slate-500">Total</span>
               </div>
               <div className="w-48 h-48">
                 {/* Fixed dimensions to prevent responsive container errors in restricted flex layouts */}
                 <PieChart width={192} height={192}>
                   <Pie
                     data={pieData}
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                 </PieChart>
               </div>
            </div>
            <div className="space-y-3 mt-4">
                {pieData.map((item) => (
                    <div key={item.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}></div>
                            <span className="text-slate-600">{item.name}</span>
                        </div>
                        <span className="font-medium text-slate-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Urgent Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
            <h3 className="font-bold text-lg text-slate-800">Pendências Urgentes</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-3">Tarefa</th>
                        <th className="px-6 py-3">Solicitante</th>
                        <th className="px-6 py-3">Vencimento</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">Registro de Imóvel #10234</td>
                        <td className="px-6 py-4 text-slate-600">Maria Oliveira</td>
                        <td className="px-6 py-4 text-red-600 font-medium">Hoje</td>
                        <td className="px-6 py-4"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold">Aguardando Doc</span></td>
                        <td className="px-6 py-4 text-right"><a href="#" className="text-primary font-medium hover:underline">Ver detalhes</a></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">Procuração Pública #10233</td>
                        <td className="px-6 py-4 text-slate-600">João da Silva</td>
                        <td className="px-6 py-4 text-amber-600 font-medium">Amanhã</td>
                        <td className="px-6 py-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Pagamento Pendente</span></td>
                        <td className="px-6 py-4 text-right"><a href="#" className="text-primary font-medium hover:underline">Ver detalhes</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
