import { Equipment, Reservation, UserProfile } from '../types';
import { INITIAL_EQUIPMENTS, INITIAL_RESERVATIONS, INITIAL_USERS } from '../data/initialData';

const STORAGE_KEYS = {
  EQUIPMENT: 'multimidia_facil_equipments_v1',
  RESERVATIONS: 'multimidia_facil_reservations_v1',
  CURRENT_USER: 'multimidia_facil_current_user_v1',
  USERS: 'multimidia_facil_users_v1',
};

export const storageService = {
  // --- USERS ---
  getUsers(): UserProfile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  },

  saveUsers(users: UserProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Erro ao salvar usuários:', e);
    }
  },

  updateUserProfile(updated: UserProfile): void {
    const list = this.getUsers();
    const index = list.findIndex(u => u.id === updated.id);
    if (index !== -1) {
      list[index] = updated;
    } else {
      list.push(updated);
    }
    this.saveUsers(list);

    // If it's current user, update current user too
    const current = this.getCurrentUser();
    if (current.id === updated.id) {
      this.setCurrentUser(updated);
    }
  },

  getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    const users = this.getUsers();
    return users[0] || INITIAL_USERS[0]; // Profª Mariana Alencar default
  },

  setCurrentUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Erro ao salvar usuário atual:', e);
    }
  },

  // --- EQUIPMENTS ---
  getEquipments(): Equipment[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler equipamentos:', e);
    }
    // initialize
    this.saveEquipments(INITIAL_EQUIPMENTS);
    return INITIAL_EQUIPMENTS;
  },

  saveEquipments(equipments: Equipment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipments));
    } catch (e) {
      console.error('Erro ao salvar equipamentos:', e);
    }
  },

  addEquipment(equipment: Omit<Equipment, 'id'>): Equipment {
    const list = this.getEquipments();
    const newId = `eq-${Date.now()}`;
    const newEquipment: Equipment = {
      ...equipment,
      id: newId,
      availableQuantity: equipment.status === 'manutencao' ? 0 : equipment.totalQuantity,
    };
    list.unshift(newEquipment);
    this.saveEquipments(list);
    return newEquipment;
  },

  updateEquipment(updated: Equipment): void {
    const list = this.getEquipments();
    const index = list.findIndex(e => e.id === updated.id);
    if (index !== -1) {
      list[index] = updated;
      this.saveEquipments(list);
    }
  },

  deleteEquipment(id: string): void {
    const list = this.getEquipments().filter(e => e.id !== id);
    this.saveEquipments(list);
  },

  // --- RESERVATIONS ---
  getReservations(): Reservation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler reservas:', e);
    }
    this.saveReservations(INITIAL_RESERVATIONS);
    return INITIAL_RESERVATIONS;
  },

  saveReservations(reservations: Reservation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch (e) {
      console.error('Erro ao salvar reservas:', e);
    }
  },

  // Conflict validation:
  // Returns availability and detailed conflict explanation
  checkAvailability(
    equipmentId: string,
    date: string,
    startTime: string,
    endTime: string,
    quantity: number = 1,
    excludeReservationId?: string
  ): { available: boolean; conflictReason?: string; conflictingReservations: Reservation[] } {
    const equipments = this.getEquipments();
    const equipment = equipments.find(e => e.id === equipmentId);

    if (!equipment) {
      return { available: false, conflictReason: 'Equipamento não encontrado.', conflictingReservations: [] };
    }

    if (equipment.status === 'manutencao') {
      return {
        available: false,
        conflictReason: `Este equipamento está atualmente em manutenção preventiva/corretiva (${equipment.maintenanceNotes || 'Sem detalhes'}).`,
        conflictingReservations: [],
      };
    }

    // Convert time strings "HH:MM" to minutes from midnight
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const reqStart = toMinutes(startTime);
    const reqEnd = toMinutes(endTime);

    if (reqEnd <= reqStart) {
      return {
        available: false,
        conflictReason: 'O horário de devolução deve ser posterior ao horário de retirada.',
        conflictingReservations: [],
      };
    }

    const reservations = this.getReservations();
    // Only check active reservations on the exact same date
    const overlapping = reservations.filter(res => {
      if (res.id === excludeReservationId) return false;
      if (res.equipmentId !== equipmentId) return false;
      if (res.date !== date) return false;
      if (res.status === 'cancelada' || res.status === 'devolvida') return false;

      const resStart = toMinutes(res.startTime);
      const resEnd = toMinutes(res.endTime);

      // Two intervals overlap if: reqStart < resEnd AND reqEnd > resStart
      return reqStart < resEnd && reqEnd > resStart;
    });

    // Sum overlapping quantities
    const reservedQuantity = overlapping.reduce((sum, r) => sum + (r.quantity || 1), 0);
    const remainingUnits = equipment.totalQuantity - reservedQuantity;

    if (remainingUnits < quantity) {
      const details = overlapping
        .map(r => `• ${r.startTime} às ${r.endTime} (${r.requesterName} - ${r.location})`)
        .join('\n');
      return {
        available: false,
        conflictReason: `Conflito de horário! Todas as ${equipment.totalQuantity} unidade(s) já estão reservadas no intervalo solicitado:\n${details}`,
        conflictingReservations: overlapping,
      };
    }

    return { available: true, conflictingReservations: [] };
  },

  createReservation(data: {
    equipmentId: string;
    requesterName: string;
    requesterEmail: string;
    requesterRole?: 'professor' | 'servidor' | 'coordenador';
    subject?: string;
    date: string;
    startTime: string;
    endTime: string;
    shift: 'manha' | 'tarde' | 'noite';
    location: string;
    purpose: string;
    notes?: string;
    quantity?: number;
  }): { success: boolean; reservation?: Reservation; error?: string } {
    const qty = data.quantity || 1;
    const availability = this.checkAvailability(
      data.equipmentId,
      data.date,
      data.startTime,
      data.endTime,
      qty
    );

    if (!availability.available) {
      return { success: false, error: availability.conflictReason };
    }

    const equipments = this.getEquipments();
    const equipment = equipments.find(e => e.id === data.equipmentId)!;

    const newReservation: Reservation = {
      id: `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      equipmentId: data.equipmentId,
      equipmentName: equipment.name,
      equipmentPatrimony: equipment.patrimony,
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      requesterRole: data.requesterRole || 'professor',
      subject: data.subject || 'Geral',
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      shift: data.shift,
      location: data.location,
      purpose: data.purpose,
      notes: data.notes,
      status: 'aprovada', // Auto-approved if no conflict, or 'pendente' depending on policy
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      quantity: qty,
    };

    const reservations = this.getReservations();
    reservations.unshift(newReservation);
    this.saveReservations(reservations);

    return { success: true, reservation: newReservation };
  },

  updateReservation(updated: Reservation): void {
    const reservations = this.getReservations();
    const index = reservations.findIndex(r => r.id === updated.id);
    if (index !== -1) {
      reservations[index] = updated;
      this.saveReservations(reservations);
    }
  },

  updateReservationStatus(id: string, newStatus: Reservation['status']): void {
    const reservations = this.getReservations();
    const res = reservations.find(r => r.id === id);
    if (!res) return;

    res.status = newStatus;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (newStatus === 'retirada' && !res.checkedOutAt) {
      res.checkedOutAt = now;
    }
    if (newStatus === 'devolvida' && !res.checkedInAt) {
      res.checkedInAt = now;
    }

    this.saveReservations(reservations);
  },

  cancelReservation(id: string): void {
    this.updateReservationStatus(id, 'cancelada');
  },

  // Export report to CSV
  exportReservationsToCSV(): void {
    const list = this.getReservations();
    const headers = [
      'Código',
      'Equipamento',
      'Patrimônio',
      'Solicitante',
      'E-mail',
      'Data',
      'Início',
      'Fim',
      'Turno',
      'Local',
      'Finalidade',
      'Status',
      'Criado em',
      'Retirada',
      'Devolução',
    ];

    const rows = list.map(r => [
      r.id,
      `"${r.equipmentName.replace(/"/g, '""')}"`,
      r.equipmentPatrimony,
      `"${r.requesterName.replace(/"/g, '""')}"`,
      r.requesterEmail,
      r.date,
      r.startTime,
      r.endTime,
      r.shift,
      `"${r.location.replace(/"/g, '""')}"`,
      `"${r.purpose.replace(/"/g, '""')}"`,
      r.status,
      r.createdAt,
      r.checkedOutAt || '-',
      r.checkedInAt || '-',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `multimidia_facil_relatorio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.EQUIPMENT);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
};
