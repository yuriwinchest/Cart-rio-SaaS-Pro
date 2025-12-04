import React, { useState } from 'react';
import { Document } from '../types';

const initialDocs: Document[] = [
  { 
    id: '1', 
    name: 'Escritura Compra e Venda.pdf', 
    client: 'Ana Silva', 
    service: 'Escritura', 
    uploadDate: '15/07/2023', 
    status: 'Concluído', 
    type: 'pdf',
    content: 'ESCRITURA PÚBLICA DE COMPRA E VENDA. Saibam quantos esta pública escritura virem que, aos... compareceram partes entre si justas e contratadas... objeto: imóvel residencial urbano...'
  },
  { 
    id: '2', 
    name: 'Procuracao_Joao_Santos.pdf', 
    client: 'João Santos', 
    service: 'Procuração', 
    uploadDate: '14/07/2023', 
    status: 'Concluído', 
    type: 'pdf',
    content: 'PROCURAÇÃO AD JUDICIA ET EXTRA. Outorgante: João Santos... Outorgado: Dr. Advogado... Poderes: amplos gerais e ilimitados para o foro em geral...'
  },
  { 
    id: '3', 
    name: 'Contrato_Social_LTDA.docx', 
    client: 'Empresa XYZ Ltda', 
    service: 'Contrato Social', 
    uploadDate: '12/07/2023', 
    status: 'Processando', 
    type: 'docx',
    content: 'CONTRATO SOCIAL DE CONSTITUIÇÃO DE SOCIEDADE LIMITADA. Pelo presente instrumento particular... Cláusula 1ª: A sociedade girará sob a denominação social de Empresa XYZ Ltda...'
  },
  { 
    id: '4', 
    name: 'Certidao_Nascimento.jpg', 
    client: 'Carlos Pereira', 
    service: 'Certidão', 
    uploadDate: '11/07/2023', 
    status: 'Pendente', 
    type: 'jpg',
    content: 'REPÚBLICA FEDERATIVA DO BRASIL. REGISTRO CIVIL DAS PESSOAS NATURAIS. Certidão de Nascimento. Nome: Carlos Pereira. Data de Nascimento: ...'
  },
  { 
    id: '5', 
    name: 'Testamento_Maria.pdf', 
    client: 'Maria Fernandes', 
    service: 'Testamento', 
    uploadDate: '10/07/2023', 
    status: 'Concluído', 
    type: 'pdf',
    content: 'TESTAMENTO PÚBLICO. Aos dez dias do mês de julho... compareceu a testadora Maria Fernandes... declara que este é o seu testamento e disposição de última vontade...'
  },
];

export default function Documentos() {
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');

  const filteredDocs = initialDocs.filter(doc => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      doc.name.toLowerCase().includes(term) ||
      doc.client.toLowerCase().includes(term) ||
      doc.service.toLowerCase().includes(term) ||
      (doc.content && doc.content.toLowerCase().includes(term));
    
    const matchesStatus = statusFilter === 'Todos' || doc.status === statusFilter;
    const matchesType = typeFilter === 'Todos' || doc.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Helper to extract a snippet of text around the search term
  const getSnippet = (text: string | undefined, term: string) => {
    if (!text || !term || term.length < 2) return null;
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index === -1) return null;
    
    const start = Math.max(0, index - 25);
    const end = Math.min(text.length, index + term.length + 35);
    return (start > 0 ? "..." : "") + text.substring(start, end) + (end < text.length ? "..." : "");
  };

  return (
    <div className="h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Gerenciamento de Documentos</h1>
            <p className="text-slate-500">Faça upload, organize e busque seus documentos.</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-primary/30 text-primary font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary/5">
                <span className="material-symbols-outlined">create_new_folder</span> Create
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary/90">
                <span className="material-symbols-outlined">upload_file</span> Upload
            </button>
         </div>
       </div>

       {/* Toolbar */}
       <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
             <input 
                type="text" 
                placeholder="Busca textual (OCR) por nome ou conteúdo..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-transparent bg-white shadow-sm focus:ring-2 focus:ring-primary/20 outline-none text-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-transparent bg-white shadow-sm focus:ring-2 focus:ring-primary/20 outline-none text-sm text-slate-600 min-w-[160px] cursor-pointer"
             >
                <option value="Todos">Status: Todos</option>
                <option value="Concluído">Concluído</option>
                <option value="Pendente">Pendente</option>
                <option value="Processando">Processando</option>
             </select>

             <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-transparent bg-white shadow-sm focus:ring-2 focus:ring-primary/20 outline-none text-sm text-slate-600 min-w-[140px] cursor-pointer"
             >
                <option value="Todos">Tipo: Todos</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="jpg">JPG</option>
             </select>

             <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm ml-auto sm:ml-0">
                <button 
                   onClick={() => setView('list')}
                   className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <span className="material-symbols-outlined">view_list</span>
                </button>
                <button 
                   onClick={() => setView('grid')}
                   className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <span className="material-symbols-outlined">grid_view</span>
                </button>
             </div>
          </div>
       </div>

       {/* Tags/Filters */}
       <div className="flex gap-2 mb-6 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold cursor-pointer hover:bg-blue-200">Escritura</span>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold cursor-pointer hover:bg-purple-200">Procuração</span>
          <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold cursor-pointer hover:bg-teal-200">Contrato Social</span>
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold cursor-pointer hover:bg-orange-200">Certidão</span>
       </div>

       {/* Content */}
       <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 md:p-6 overflow-hidden flex flex-col">
          {view === 'grid' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto p-1">
               {/* Dropzone */}
               <div className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer min-h-[180px]">
                  <span className="material-symbols-outlined text-4xl mb-2">cloud_upload</span>
                  <p className="text-sm font-medium">Clique ou arraste arquivos</p>
                  <p className="text-xs mt-1">PDF, JPG, DOCX (Max 50MB)</p>
               </div>

               {filteredDocs.map(doc => {
                 // Check if match is in content to show snippet
                 const contentSnippet = getSnippet(doc.content, searchTerm);
                 
                 return (
                   <div key={doc.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow group relative flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                         {doc.type === 'pdf' && <span className="material-symbols-outlined text-red-500 text-3xl">picture_as_pdf</span>}
                         {doc.type === 'docx' && <span className="material-symbols-outlined text-blue-500 text-3xl">description</span>}
                         {doc.type === 'jpg' && <span className="material-symbols-outlined text-green-500 text-3xl">image</span>}
                         <button className="text-slate-300 hover:text-slate-600"><span className="material-symbols-outlined">more_vert</span></button>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1 truncate" title={doc.name}>{doc.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">Modificado: {doc.uploadDate}</p>
                      
                      {/* OCR Snippet - Show if search term matches content */}
                      {contentSnippet && (
                        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-100 rounded text-[11px] text-slate-600 italic leading-snug">
                           "{contentSnippet}"
                        </div>
                      )}
                      
                      <div className="mt-auto flex justify-between items-center">
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            doc.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                            doc.status === 'Processando' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                         }`}>{doc.status}</span>
                         <span className="material-symbols-outlined text-slate-400 text-lg hover:text-primary cursor-pointer">visibility</span>
                      </div>
                   </div>
                 );
               })}
               
               {filteredDocs.length === 0 && (
                 <div className="col-span-full py-10 text-center text-slate-500">
                    Nenhum documento encontrado.
                 </div>
               )}
             </div>
          )}

          {view === 'list' && (
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                     <tr>
                        <th className="px-4 py-3"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" /></th>
                        <th className="px-4 py-3">Documento</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Serviço</th>
                        <th className="px-4 py-3">Data</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-slate-50">
                           <td className="px-4 py-3"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" /></td>
                           <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                              {doc.type === 'pdf' && <span className="material-symbols-outlined text-red-500 text-lg">picture_as_pdf</span>}
                              {doc.type === 'docx' && <span className="material-symbols-outlined text-blue-500 text-lg">description</span>}
                              {doc.type === 'jpg' && <span className="material-symbols-outlined text-green-500 text-lg">image</span>}
                              <div className="flex flex-col">
                                 <span>{doc.name}</span>
                                 {/* Optional small snippet in list view */}
                                 {getSnippet(doc.content, searchTerm) && (
                                    <span className="text-[10px] text-slate-400 italic max-w-xs truncate">
                                       "...{getSnippet(doc.content, searchTerm)}..."
                                    </span>
                                 )}
                              </div>
                           </td>
                           <td className="px-4 py-3 text-slate-600">{doc.client}</td>
                           <td className="px-4 py-3 text-slate-600">{doc.service}</td>
                           <td className="px-4 py-3 text-slate-500">{doc.uploadDate}</td>
                           <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  doc.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                                  doc.status === 'Processando' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                               }`}>{doc.status}</span>
                           </td>
                           <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2 text-slate-400">
                                 <button className="hover:text-primary"><span className="material-symbols-outlined text-lg">visibility</span></button>
                                 <button className="hover:text-primary"><span className="material-symbols-outlined text-lg">download</span></button>
                                 <button className="hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                     {filteredDocs.length === 0 && (
                        <tr>
                           <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                              Nenhum documento encontrado.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
          )}
       </div>
    </div>
  );
}
