
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for login simulation
  role: 'Administrador' | 'Atendente' | 'Financeiro';
  status: 'Ativo' | 'Inativo';
  createdAt?: string; // Mapped from created_at
}

export interface Document {
  id: string;
  name: string;
  client: string;
  service: string;
  uploadDate?: string; // Mapped from created_at
  status: 'Concluído' | 'Pendente' | 'Processando';
  // Added 'doc' and 'jpeg' to support legacy formats and alternate extensions checked in Documentos.tsx
  type: 'pdf' | 'docx' | 'doc' | 'jpg' | 'jpeg' | 'png' | 'other';
  size?: string;
  content?: string;
  url?: string;  // Public URL from storage
  path?: string; // Internal path in storage bucket
}

export interface Transaction {
  id: string;
  time?: string; // Mapped from created_at
  description: string;
  type: 'Receita' | 'Despesa';
  method: string;
  amount: number;
  notes?: string;
  items?: { description: string; quantity: number; unitPrice: number }[];
}

export interface Service {
  id: string;
  name: string;
  attribution: string;
  model: string;
  numbering: string;
  status: 'Ativo' | 'Inativo';
}

export interface QueueItem {
  id: string;
  name: string;
  service: string;
  ticketNumber: string;
  waitTime: string;
  status: 'Em Atendimento' | 'Aguardando' | 'Remoto';
  desk?: string;
}