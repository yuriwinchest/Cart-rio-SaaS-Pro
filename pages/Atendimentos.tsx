import React from 'react';
import { QueueItem } from '../types';

const queueData: QueueItem[] = [
  { id: '01', name: 'Ana Clara Souza', service: 'Reconhecimento de Firma', ticketNumber: '01', waitTime: '12:34', status: 'Em Atendimento', desk: 'Guichê 03' },
  { id: '02', name: 'Bruno Gomes', service: 'Autenticação de Cópia', ticketNumber: '02', waitTime: '08:12', status: 'Aguardando' },
  { id: '03', name: 'Carlos Eduardo', service: 'Procuração Pública', ticketNumber: '03', waitTime: '05:45', status: 'Remoto' },
  { id: '04', name: 'Daniela Martins', service: 'Escritura Pública', ticketNumber: '04', waitTime: '02:19', status: 'Aguardando' },
];

const QueueCard: React.FC<{ item: QueueItem }> = ({ item }) => {
  const isServing = item.status === 'Em Atendimento';
  const isRemote = item.status === 'Remoto';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
           <div>
             <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
             <p className="text-sm text-slate-500">{item.service}</p>
           </div>
           <span className={`text-2xl font-black ${isServing ? 'text-primary' : 'text-slate-300'}`}>{item.ticketNumber}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          {isServing && (
             <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full">Em Atendimento</span>
          )}
          {isRemote && (
             <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
               <span className="material-symbols-outlined text-[14px]">headset_mic</span> Remoto
             </span>
          )}
          {!isServing && !isRemote && (
             <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">Aguardando</span>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm text-slate-500">
           {isServing && <span>{item.desk}</span>}
           <span>Tempo: {item.waitTime}</span>
        </div>
      </div>

      <div className="border-t border-slate-200 flex divide-x divide-slate-200">
         {isServing ? (
           <>
            <button className="flex-1 py-3 text-sm font-bold text-green-600 hover:bg-green-50">Concluir</button>
            <button className="flex-1 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">Detalhes</button>
           </>
         ) : isRemote ? (
           <button className="flex-1 py-3 text-sm font-bold text-primary hover:bg-primary/5 flex items-center justify-center gap-2">
             <span className="material-symbols-outlined text-base">chat</span> Iniciar Chat
           </button>
         ) : (
           <>
            <button className="flex-1 py-3 text-sm font-bold text-primary hover:bg-primary/5">Chamar</button>
            <button className="flex-1 py-3 text-sm font-medium text-red-600 hover:bg-red-50">Cancelar</button>
           </>
         )}
      </div>
    </div>
  );
};

export default function Atendimentos() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Atendimentos</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex gap-8">
          <button className="border-b-2 border-primary pb-3 px-1 text-sm font-bold text-primary">Fila Virtual</button>
          <button className="border-b-2 border-transparent pb-3 px-1 text-sm font-medium text-slate-500 hover:text-slate-700">Agendamentos</button>
          <button className="border-b-2 border-transparent pb-3 px-1 text-sm font-medium text-slate-500 hover:text-slate-700">Histórico</button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Render Cards */}
        {queueData.map(item => (
          <QueueCard key={item.id} item={item} />
        ))}

        {/* Empty State / Add New */}
        <div className="flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-300 min-h-[220px] p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
           <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-sm">
             <span className="material-symbols-outlined text-slate-400">add</span>
           </div>
           <p className="font-bold text-slate-700">Novo Atendimento</p>
           <p className="text-sm text-slate-500 mt-1">Adicionar cliente à fila manualmente</p>
        </div>
      </div>
      
      {/* Side Section (QR Code & Notifications) - Using Grid layout to mimic Img 8 structure in a responsive way */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-row items-center gap-6">
           <div className="bg-slate-900 p-3 rounded-lg shadow-lg">
             {/* Fake QR Code */}
             <div className="size-24 bg-white p-1">
                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Checkin')] bg-cover"></div>
             </div>
           </div>
           <div>
             <h3 className="font-bold text-slate-900 text-lg">Check-in por QR Code</h3>
             <p className="text-sm text-slate-500 mt-1 mb-3">Exiba este código na recepção para auto-atendimento.</p>
             <div className="flex gap-2">
                <button className="text-xs bg-primary/10 text-primary font-bold px-3 py-2 rounded-lg hover:bg-primary/20">Imprimir</button>
                <button className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-2 rounded-lg hover:bg-slate-200">Gerar Novo</button>
             </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
           <h3 className="font-bold text-slate-900 text-lg mb-4">Notificações Automáticas</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                       <span className="material-symbols-outlined text-sm">chat</span>
                    </div>
                    <div>
                       <p className="font-semibold text-sm text-slate-800">Aviso de "Sua Vez"</p>
                       <p className="text-xs text-slate-500">WhatsApp</p>
                    </div>
                 </div>
                 <button className="text-primary text-xs font-bold hover:underline">Editar</button>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                       <span className="material-symbols-outlined text-sm">mail</span>
                    </div>
                    <div>
                       <p className="font-semibold text-sm text-slate-800">Confirmação de Agendamento</p>
                       <p className="text-xs text-slate-500">E-mail</p>
                    </div>
                 </div>
                 <button className="text-primary text-xs font-bold hover:underline">Editar</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}