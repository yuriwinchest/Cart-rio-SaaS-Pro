
import React, { useState, useEffect } from 'react';
import { Document } from '../types';
import { supabase } from '../supabaseClient';

export default function Documentos() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);
  
  // Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedDocs: Document[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          client: d.client || 'Cliente Desconhecido',
          service: d.service || 'Geral',
          uploadDate: new Date(d.created_at).toLocaleDateString('pt-BR'),
          status: d.status,
          type: d.type,
          content: d.content,
          size: d.size,
          url: d.url,
          path: d.path
        }));
        setDocs(mappedDocs);
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- UPLOAD LOGIC ---
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'other';
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = `${fileName}`;

      // 1. Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // 3. Insert into Database
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      
      const { error: dbError } = await supabase
        .from('documents')
        .insert([
          {
            name: file.name,
            client: 'Cliente Exemplo', // In a real app, this would come from a modal/form
            service: 'Upload Manual',
            type: fileExt,
            size: fileSizeMB,
            url: publicUrl,
            path: filePath,
            status: 'Concluído',
            content: `Conteúdo OCR simulado para ${file.name}...` // Placeholder for OCR
          }
        ]);

      if (dbError) throw dbError;

      await fetchDocuments();
      alert('Upload realizado com sucesso!');

    } catch (error: any) {
      console.error('Erro no upload:', error);
      alert('Falha ao enviar arquivo: ' + error.message);
    } finally {
      setUploading(false);
      setIsDragging(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (id: string, path?: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      // 1. Delete from Storage (if path exists)
      if (path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([path]);
        
        if (storageError) console.warn('Erro ao deletar arquivo do storage:', storageError);
      }

      // 2. Delete from Database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setDocs(prev => prev.filter(d => d.id !== id));

    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir documento.');
    }
  };

  // --- DRAG AND DROP HANDLERS ---
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // --- FILTER LOGIC ---
  const filteredDocs = docs.filter(doc => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      doc.name.toLowerCase().includes(term) ||
      doc.client.toLowerCase().includes(term) ||
      doc.service.toLowerCase().includes(term) ||
      (doc.content && doc.content.toLowerCase().includes(term));
    
    const matchesStatus = statusFilter === 'Todos' || doc.status === statusFilter;
    
    // Simple extension check for type filter
    const matchesType = typeFilter === 'Todos' || 
                        (typeFilter === 'pdf' && doc.type === 'pdf') ||
                        (typeFilter === 'docx' && (doc.type === 'docx' || doc.type === 'doc')) ||
                        (typeFilter === 'jpg' && (doc.type === 'jpg' || doc.type === 'jpeg' || doc.type === 'png'));

    return matchesSearch && matchesStatus && matchesType;
  });

  const getSnippet = (text: string | undefined, term: string) => {
    if (!text || !term || term.length < 2) return null;
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index === -1) return null;
    
    const start = Math.max(0, index - 25);
    const end = Math.min(text.length, index + term.length + 35);
    return (start > 0 ? "..." : "") + text.substring(start, end) + (end < text.length ? "..." : "");
  };

  const getFileIcon = (type: string) => {
    if (['pdf'].includes(type)) return <span className="material-symbols-outlined text-red-500 text-3xl">picture_as_pdf</span>;
    if (['doc', 'docx'].includes(type)) return <span className="material-symbols-outlined text-blue-500 text-3xl">description</span>;
    if (['jpg', 'jpeg', 'png'].includes(type)) return <span className="material-symbols-outlined text-green-500 text-3xl">image</span>;
    return <span className="material-symbols-outlined text-slate-400 text-3xl">insert_drive_file</span>;
  };

  return (
    <div className="h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Gerenciamento de Documentos</h1>
            <p className="text-slate-500">Faça upload, organize e busque seus documentos.</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <label className={`flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-primary/90 cursor-pointer transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined">upload_file</span>
                )}
                {uploading ? 'Enviando...' : 'Upload'}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e.target.files)} 
                  disabled={uploading}
                />
            </label>
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

       {/* Content */}
       <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 md:p-6 overflow-hidden flex flex-col">
          {loading ? (
             <div className="flex justify-center p-12">
               <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
             </div>
          ) : view === 'grid' ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto p-1">
               {/* Dropzone */}
               <div 
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer min-h-[220px] ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-slate-300 hover:bg-slate-50'
                  }`}
               >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                       <span className="material-symbols-outlined text-4xl mb-2 text-primary animate-spin">refresh</span>
                       <p className="text-sm font-bold text-primary">Enviando...</p>
                    </div>
                  ) : (
                    <>
                      <span className={`material-symbols-outlined text-4xl mb-2 ${isDragging ? 'text-primary' : 'text-slate-400'}`}>cloud_upload</span>
                      <p className="text-sm font-medium text-slate-600">Arraste e solte arquivos</p>
                      <p className="text-xs mt-1 text-slate-400">PDF, JPG, DOCX (Max 50MB)</p>
                      <label className="mt-3 text-xs bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 font-medium">
                         Selecionar Arquivo
                         <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
                      </label>
                    </>
                  )}
               </div>

               {filteredDocs.map(doc => {
                 const contentSnippet = getSnippet(doc.content, searchTerm);
                 return (
                   <div key={doc.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow group relative flex flex-col h-[220px]">
                      <div className="flex justify-between items-start mb-3">
                         {getFileIcon(doc.type)}
                         <div className="relative group/menu">
                            <button className="text-slate-300 hover:text-slate-600"><span className="material-symbols-outlined">more_vert</span></button>
                            {/* Simple Dropdown for Grid */}
                            <div className="absolute right-0 top-6 w-32 bg-white border border-slate-200 rounded-lg shadow-lg hidden group-hover/menu:block z-10">
                               <a href={doc.url} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">Baixar</a>
                               <button onClick={() => handleDelete(doc.id, doc.path)} className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50">Excluir</button>
                            </div>
                         </div>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1 truncate" title={doc.name}>{doc.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">Cliente: {doc.client}</p>
                      
                      {contentSnippet ? (
                        <div className="flex-1 mb-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-[10px] text-slate-600 italic leading-snug overflow-hidden">
                           "{contentSnippet}"
                        </div>
                      ) : (
                        <div className="flex-1"></div>
                      )}
                      
                      <div className="mt-auto flex justify-between items-center pt-2 border-t border-slate-100">
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            doc.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                            doc.status === 'Processando' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                         }`}>{doc.status}</span>
                         <a href={doc.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary" title="Visualizar">
                            <span className="material-symbols-outlined text-lg">visibility</span>
                         </a>
                      </div>
                   </div>
                 );
               })}
             </div>
          ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                     <tr>
                        <th className="px-4 py-3">Documento</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Data</th>
                        <th className="px-4 py-3">Tamanho</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-slate-50">
                           <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                              {getFileIcon(doc.type)}
                              <div className="flex flex-col">
                                 <span>{doc.name}</span>
                                 {getSnippet(doc.content, searchTerm) && (
                                    <span className="text-[10px] text-slate-400 italic max-w-xs truncate">
                                       "...{getSnippet(doc.content, searchTerm)}..."
                                    </span>
                                 )}
                              </div>
                           </td>
                           <td className="px-4 py-3 text-slate-600">{doc.client}</td>
                           <td className="px-4 py-3 text-slate-500">{doc.uploadDate}</td>
                           <td className="px-4 py-3 text-slate-500 text-xs">{doc.size || '-'}</td>
                           <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  doc.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                                  doc.status === 'Processando' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                               }`}>{doc.status}</span>
                           </td>
                           <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2 text-slate-400">
                                 <a href={doc.url} target="_blank" rel="noreferrer" className="hover:text-primary" title="Visualizar"><span className="material-symbols-outlined text-lg">visibility</span></a>
                                 <a href={doc.url} download className="hover:text-primary" title="Baixar"><span className="material-symbols-outlined text-lg">download</span></a>
                                 <button onClick={() => handleDelete(doc.id, doc.path)} className="hover:text-red-500" title="Excluir"><span className="material-symbols-outlined text-lg">delete</span></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}
       </div>
    </div>
  );
}
