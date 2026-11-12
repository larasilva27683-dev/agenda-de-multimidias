export type EquipmentCategory = 
  | 'datashow'
  | 'tv'
  | 'chromebook'
  | 'audio'
  | 'cables'
  | 'others';

export type EquipmentStatus = 
  | 'disponivel'
  | 'reservado'
  | 'em_uso'
  | 'manutencao';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  patrimony: string;
  totalQuantity: number;
  availableQuantity: number;
  image: string;
  location: string;
  accessories: string[];
  maintenanceNotes?: string;
  status: EquipmentStatus;
  description: string;
}

export type ReservationStatus = 
  | 'pendente'
  | 'aprovada'
  | 'retirada'
  | 'devolvida'
  | 'cancelada';

export interface Reservation {
  id: string; // Ex: "RES-2026-1042"
  equipmentId: string;
  equipmentName: string;
  equipmentPatrimony: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: 'professor' | 'servidor' | 'coordenador';
  subject?: string; // Disciplina / Matéria (ex: Português, Matemática, História)
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  shift: 'manha' | 'tarde' | 'noite';
  location: string; // Sala ou espaço
  purpose: string; // Finalidade
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
  checkedOutAt?: string;
  checkedInAt?: string;
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'professor' | 'servidor' | 'admin';
  department: string;
  subject?: string; // Matéria / Disciplina padrão do professor
  avatarColor: string;
}
