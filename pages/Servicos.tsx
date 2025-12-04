
import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { supabase } from '../supabaseClient';

export default function Servicos() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros e Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttribution, setSelectedAttribution] = useState('Todas');

  // Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    attribution: 'Tabelionato de Notas',
    model: '',
    numbering: 'Automática'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data) {
        const mappedServices: Service[] = data.map((s: any) => ({
          id: s.id,
          name: s.name,
          attribution: s.attribution,
          model: s.model || '-',
          numbering: s.numbering || '-',
          status: s.status
        }));
        setServices(mappedServices);
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('services')
        .insert([{
          name: formData.name,
          attribution: formData.attribution,
          model: formData.model,
          numbering: formData.numbering,
          status: 'Ativo'
        }]);

      if (error) throw error;

      await fetchServices();
      setIsModalOpen(false);
      setFormData({ name: '', attribution: 'Tabelionato de Notas', model: '', numbering: 'Automática' });
      alert('Serviço adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      alert('Erro ao salvar no banco de dados.');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir serviço.');
    }
  };

  // Lógica de Filtragem
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAttribution = selectedAttribution === 'Todas' || service.attribution === selectedAttribution;
    return matchesSearch && matchesAttribution;
  });

  const SidebarItem = ({ label, icon, value }: { label: string, icon: string, value: string }) => (
    <button 
      onClick={() => setSelectedAttribution(value)}
      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        selectedAttribution === value 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <span className={`material-symbols-outlined text-lg ${selectedAttribution === value ? 'fill' : ''}`}>{icon}</span> 
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
       {/* Filters Sidebar */}
       <div className="w-full lg:w-64 flex-shrink-0">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 hidden lg:block">Atribuições</h3>
          
          <div className="lg:space-y-1 grid grid-cols-2 sm:grid-cols-3 lg:block gap-2">
             <SidebarItem label="Todas" icon="apps" value="Todas" />
             <SidebarItem label="Tabelionato" icon="description" value="Tabelionato de Notas" />
             <SidebarItem label="Reg. Civil" icon="group" value="Registro Civil" />
             <SidebarItem label="Reg. Imóveis" icon="home" value="Registro de Imóveis" />
             <SidebarItem label="Títulos" icon="assignment" value="Títulos e Documentos" />
             <SidebarItem label="Protesto" icon="warning" value="Protesto" />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 w-full border border-primary text-primary font-bold text-sm py-2 rounded-lg hover:bg-primary/5 hidden lg:block transition-colors"
          >
             Adicionar Atribuição
          </button>
       </div>

       {/* Main Content */}
       <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
             <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Serviços e Atos</h1>
                <p className="text-slate-500 text-sm mt-1">Gerencie os serviços oferecidos pelo cartório.</p>
             </div>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-primary text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 shadow-sm transition-colors"
             >
                <span className="material-symbols-outlined text-lg">add_circle</span> Novo Serviço/Ato
             </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col shadow-sm">
             {/* Toolbar */}
             <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
                <div className="relative flex-1 max-w-md">
                   <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                   <input 
                      type="text" 
                      placeholder="Buscar por nome do serviço ou ato..." 
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-primary focus:border-primary outline-none bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                   <div className="relative flex-1 sm:flex-none">
                      <select 
                        className="w-full sm:w-48 appearance-none border border-slate-200 rounded-lg text-sm text-slate-600 pl-3 pr-8 py-2 outline-none bg-white cursor-pointer hover:border-slate-300"
                        value={selectedAttribution}
                        onChange={(e) => setSelectedAttribution(e.target.value)}
                      >
                          <option value="Todas">Todas Atribuições</option>
                          <option value="Tabelionato de Notas">Tabelionato de Notas</option>
                          <option value="Registro Civil">Registro Civil</option>
                          <option value="Registro de Imóveis">Registro de Imóveis</option>
                          <option value="Títulos e Documentos">Títulos e Documentos</option>
                          <option value="Protesto">Protesto</option>
                       </select>
                       <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                   </div>
                   <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white hover:text-primary transition-colors bg-white">
                      <span className="material-symbols-outlined text-lg">download</span>
                   </button>
                </div>
             </div>

             {/* Table */}
             <div className="overflow-x-auto flex-1">
                {loading ? (
                   <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-2">
                      <span className="material-symbols-outlined text-3xl animate-spin text-primary">progress_activity</span>
                      <p>Carregando serviços...</p>
                   </div>
                ) : filteredServices.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                      <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">search_off</span>
                      <p>Nenhum serviço encontrado.</p>
                   </div>
                ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                      <tr>
                         <th className="px-6 py-3">Nome do Serviço/Ato</th>
                         <th className="px-6 py-3">Atribuição</th>
                         <th className="px-6 py-3">Modelo Associado</th>
                         <th className="px-6 py-3">Numeração</th>
                         <th className="px-6 py-3">Status</th>
                         <th className="px-6 py-3 text-right">Ações</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {filteredServices.map(s => (
                         <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 font-bold text-slate-900">{s.name}</td>
                            <td className="px-6 py-4 text-slate-600">
                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                  {s.attribution}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{s.model}</td>
                            <td className="px-6 py-4 text-slate-600">{s.numbering}</td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {s.status}
                                  </span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex items-center justify-end gap-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1.5 hover:text-primary hover:bg-white rounded border border-transparent hover:border-slate-200 shadow-sm transition-all" title="Editar"><span className="material-symbols-outlined text-lg">edit</span></button>
                                  <button onClick={() => handleDeleteService(s.id)} className="p-1.5 hover:text-red-500 hover:bg-white rounded border border-transparent hover:border-slate-200 shadow-sm transition-all" title="Excluir"><span className="material-symbols-outlined text-lg">delete</span></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
                )}
             </div>
             
             <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 text-center">
                Mostrando {filteredServices.length} registro(s)
             </div>
          </div>
       </div>

       {/* Create Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Novo Serviço/Ato</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleAddService} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Serviço</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  placeholder="Ex: Procuração Pública"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Atribuição</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                  value={formData.attribution}
                  onChange={e => setFormData({...formData, attribution: e.target.value})}
                >
                  <option value="Tabelionato de Notas">Tabelionato de Notas</option>
                  <option value="Registro Civil">Registro Civil</option>
                  <option value="Registro de Imóveis">Registro de Imóveis</option>
                  <option value="Títulos e Documentos">Títulos e Documentos</option>
                  <option value="Protesto">Protesto</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Modelo Associado</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                    placeholder="Ex: Modelo V2"
                    value={formData.model}
                    onChange={e => setFormData({...formData, model: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Numeração</label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm bg-white"
                    value={formData.numbering}
                    onChange={e => setFormData({...formData, numbering: e.target.value})}
                  >
                    <option value="Automática">Automática</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 text-sm shadow-sm">Salvar Serviço</button>
              </div>
            </form>
          </div>
        </div>
       )}
    </div>
  );
}
