export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Atendente' | 'Financeiro';
  status: 'Ativo' | 'Inativo';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  client: string;
  service: string;
  uploadDate: string;
  status: 'Concluído' | 'Pendente' | 'Processando';
  type: 'pdf' | 'docx' | 'jpg';
  size?: string;
}

export interface Transaction {
  id: string;
  time: string;
  description: string;
  type: 'Receita' | 'Despesa';
  method: 'PIX' | 'Boleto' | 'Dinheiro' | 'Cartão' | 'Cartão de Débito';
  amount: number;
}

export interface Service {
  id: string;
  name: string;
  attribution: 'Tabelionato de Notas' | 'Registro Civil' | 'Registro de Imóveis';
  model: string;
  numbering: 'Automática' | 'Manual';
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