import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QueueItem } from '../types';

const initialQueueData: QueueItem[] = [
  { id: '01', name: 'Ana Clara Souza', service: 'Reconhecimento de Firma', ticketNumber: '01', waitTime: '12:34', status: 'Em Atendimento', desk: 'Guichê 03' },
  { id: '02', name: 'Bruno Gomes', service: 'Autenticação de Cópia', ticketNumber: '02', waitTime: '08:12', status: 'Aguardando' },
  { id: '03', name: 'Carlos Eduardo', service: 'Procuração Pública', ticketNumber: '03', waitTime: '05:45', status: 'Remoto' },
  { id: '04', name: 'Daniela Martins', service: 'Escritura Pública', ticketNumber: '04', waitTime: '02:19', status: 'Aguardando' },
];

const availableServices = [
  'Reconhecimento de Firma',
  'Autenticação de Cópia',
  'Procuração Pública',
  'Escritura Pública',
  'Apostilamento',
  'Registro de Nascimento',
  'Certidão de Casamento'
];

const QueueCard: React.FC<{ item: QueueItem }> = ({ item }) => {
  const isServing = item.status === 'Em Atendimento';
  const isRemote = item.status === 'Remoto';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md h-full">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
           <div className="flex-1 min-w-0 pr-2">
             <h3 className="font-bold text-lg text-slate-900 truncate" title={item.name}>{item.name}</h3>
             <p className="text-sm text-slate-500 truncate">{item.service}</p>
           </div>
           <span className={`text-2xl font-black shrink-0 ${isServing ? 'text-primary' : 'text-slate-300'}`}>{item.ticketNumber}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2 flex-wrap">
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
        
        <div className="flex justify-between items-center text-sm text-slate-500 mt-auto pt-2">
           {isServing && <span className="font-medium text-slate-700">{item.desk}</span>}
           <span className="flex items-center gap-1 ml-auto"><span className="material-symbols-outlined text-[16px]">schedule</span> {item.waitTime}</span>
        </div>
      </div>

      <div className="border-t border-slate-200 flex divide-x divide-slate-200">
         {isServing ? (
           <>
            <button className="flex-1 py-3 text-sm font-bold text-green-600 hover:bg-green-50 transition-colors">Concluir</button>
            <button className="flex-1 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Detalhes</button>
           </>
         ) : isRemote ? (
           <button className="flex-1 py-3 text-sm font-bold text-primary hover:bg-primary/5 flex items-center justify-center gap-2 transition-colors">
             <span className="material-symbols-outlined text-base">chat</span> Iniciar Chat
           </button>
         ) : (
           <>
            <button className="flex-1 py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">Chamar</button>
            <button className="flex-1 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Cancelar</button>
           </>
         )}
      </div>
    </div>
  );
};

export default function Atendimentos() {
  const location = useLocation();
  const [queue, setQueue] = useState<QueueItem[]>(initialQueueData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Check for navigation state to open modal automatically
  useEffect(() => {
    if (location.state && (location.state as any).openModal) {
      setIsModalOpen(true);
      // Clean up state (optional, depends on router behavior preference)
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [selectedService, setSelectedService] = useState(availableServices[0]);
  const [isPriority, setIsPriority] = useState(false);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;

    const nextNumber = (queue.length + 1).toString().padStart(2, '0');
    
    const newItem: QueueItem = {
      id: Date.now().toString(),
      name: clientName,
      service: selectedService,
      ticketNumber: nextNumber,
      waitTime: '00:00',
      status: 'Aguardando'
    };

    // If priority, add to the beginning of the "Aguardando" list (simplified logic)
    // For now just appending
    setQueue([...queue, newItem]);
    
    // Reset and close
    setClientName('');
    setIsPriority(false);
    setSelectedService(availableServices[0]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Gestão de Atendimentos</h1>
          <p className="text-slate-500">Acompanhe a fila em tempo real.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-primary text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
           <span className="material-symbols-outlined text-lg">add</span> Novo Atendimento
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 overflow-x-auto">
        <nav className="flex gap-8 min-w-max">
          <button className="border-b-2 border-primary pb-3 px-1 text-sm font-bold text-primary whitespace-nowrap">Fila Virtual</button>
          <button className="border-b-2 border-transparent pb-3 px-1 text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all whitespace-nowrap">Agendamentos</button>
          <button className="border-b-2 border-transparent pb-3 px-1 text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all whitespace-nowrap">Histórico</button>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Render Cards */}
        {queue.map(item => (
          <QueueCard key={item.id} item={item} />
        ))}

        {/* Add New Card Button */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 min-h-[220px] p-6 text-center hover:bg-white hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
        >
           <div className="size-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">add</span>
           </div>
           <p className="font-bold text-slate-700 group-hover:text-primary transition-colors">Novo Atendimento</p>
           <p className="text-sm text-slate-500 mt-1">Adicionar cliente à fila manualmente</p>
        </div>
      </div>
      
      {/* Side Section (QR Code & Notifications) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
           <div className="bg-slate-900 p-3 rounded-lg shadow-lg shrink-0">
             {/* Fake QR Code */}
             <div className="size-24 bg-white p-1">
                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Checkin')] bg-cover"></div>
             </div>
           </div>
           <div className="text-center sm:text-left flex-1">
             <h3 className="font-bold text-slate-900 text-lg">Check-in por QR Code</h3>
             <p className="text-sm text-slate-500 mt-1 mb-3">Exiba este código na recepção para os clientes realizarem o auto-atendimento.</p>
             <div className="flex gap-2 justify-center sm:justify-start">
                <button className="text-xs bg-primary/10 text-primary font-bold px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors">Imprimir</button>
                <button className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors">Gerar Novo</button>
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

      {/* NEW ATTENDANCE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Novo Atendimento</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddNew} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Nome do Cliente</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="Ex: João da Silva"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Tipo de Serviço</label>
                <select 
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
                >
                  {availableServices.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center h-5">
                  <input 
                    id="priority" 
                    type="checkbox" 
                    checked={isPriority}
                    onChange={(e) => setIsPriority(e.target.checked)}
                    className="w-5 h-5 border border-slate-300 rounded text-primary focus:ring-primary/50 cursor-pointer"
                  />
                </div>
                <label htmlFor="priority" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                  Atendimento Preferencial / Prioridade
                </label>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Confirmar e Gerar Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}