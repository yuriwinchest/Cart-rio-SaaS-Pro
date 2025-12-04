
export interface User {
  id: string;
  name: string;
  email: string;
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
  type: 'pdf' | 'docx' | 'jpg';
  size?: string;
  content?: string;
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
