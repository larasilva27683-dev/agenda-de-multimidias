import React, { useState } from 'react';
import { Reservation, UserProfile, Equipment } from '../types';
import { storageService } from '../services/storageService';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Layers, 
  Filter, 
  PlusCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface MyReservationsViewProps {
  reservations: Reservation[];
  equipments: Equipment[];
  currentUser: UserProfile;
  onOpenReceipt: (reservation: Reservation) => void;
  onOpenBooking: () => void;
  onEditReservation: (reservation: Reservation) => void;
  onRefresh: () => void;
}

export const MyReservationsView: React.FC<MyReservationsViewProps> = ({
  reservations,
  equipments,
  currentUser,
  onOpenReceipt,
  onOpenBooking,
  onEditReservation,
  onRefresh,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  // Filter reservations for the active user (or all if admin wanting to see user perspective)
  const myReservations = reservations.filter(res => {
    // If admin is viewing, allow seeing user's or toggle
    const isUserBooking = res.requesterEmail.toLowerCase() === currentUser.email.toLowerCase();
    
    if (currentUser.role === 'admin') {
      return true; // Admin can see all in this view or filtered
    }
    return isUserBooking;
  });

  const filtered = myReservations.filter(res => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return res.status === 'aprovada' || res.status === 'retirada' || res.status === 'pendente';
    if (statusFilter === 'completed') return res.status === 'devolvida';
    if (statusFilter === 'canceled') return res.status === 'cancelada';
    return res.status === statusFilter;
  });

  const handleConfirmCancel = (id: string) => {
    storageService.cancelReservation(id);
    setCancelingId(null);
    onRefresh();
  };

  const statusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'pendente':
        return { label: 'Pendente de Aprovação', class: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'aprovada':
        return { label: 'Aprovada / Confirmada', class: 'text-blue-800 bg-blue-50 border-blue-200' };
      case 'retirada':
        return { label: 'Retirada / Em Uso', class: 'text-indigo-800 bg-indigo-50 border-indigo-200' };
      case 'devolvida':
        return { label: 'Devolvida / Concluída', class: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
      case 'cancelada':
        return { label: 'Cancelada', class: 'text-rose-800 bg-rose-50 border-rose-200' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Minhas Reservas & Empréstimos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Histórico e acompanhamento de agendamentos de {currentUser.name} ({currentUser.department}).
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-2xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas ({myReservations.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'active'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Ativas / Em Andamento
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'completed'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Concluídas (Devolvidas)
          </button>
          <button
            onClick={() => setStatusFilter('canceled')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'canceled'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Canceladas
          </button>
        </div>

        {currentUser.role === 'admin' && (
          <span className="text-[11px] text-slate-400 italic">
            Visualizando como Administrador
          </span>
        )}
      </div>

      {/* List of Reservations */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">Nenhuma reserva encontrada nesta categoria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Você não possui reservas cadastradas com este filtro. Faça uma nova solicitação agora mesmo.
          </p>
          <button
            onClick={onOpenBooking}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
          >
            Criar Meu Primeiro Agendamento
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((res) => {
            const badge = statusBadge(res.status);
            const isCancelable = res.status === 'pendente' || res.status === 'aprovada';

            return (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-base">{res.equipmentName}</span>
                      <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {res.equipmentPatrimony}
                      </span>
                      {res.subject && (
                        <span className="font-semibold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          📚 Matéria: {res.subject}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono flex-wrap">
                      <span>Prof: <strong>{res.requesterName}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Protocolo: <strong>{res.id}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Solicitado em: {res.createdAt}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 text-xs rounded-md border font-medium self-start sm:self-center ${badge.class}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-400 block font-medium">Data do Empréstimo</span>
                      <span className="text-slate-900 font-semibold">
                        {new Date(res.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-slate-500 capitalize block">Turno: {res.shift}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-400 block font-medium">Horário Marcado</span>
                      <span className="text-slate-900 font-mono font-bold text-sm">
                        {res.startTime} às {res.endTime}
                      </span>
                      {res.checkedOutAt && (
                        <span className="text-indigo-600 text-[11px] block">
                          Retirado às {res.checkedOutAt.split(' ')[1]}
                        </span>
                      )}
                      {res.checkedInAt && (
                        <span className="text-emerald-600 text-[11px] block">
                          Devolvido às {res.checkedInAt.split(' ')[1]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-400 block font-medium">Local de Uso</span>
                      <span className="text-slate-900 font-medium block">{res.location}</span>
                    </div>
                  </div>
                </div>

                {/* Purpose text */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium block">Finalidade Registrada:</span>
                  <p className="text-slate-800 mt-0.5">{res.purpose}</p>
                  {res.notes && (
                    <p className="text-slate-500 text-[11px] mt-1 border-t border-slate-200/60 pt-1">
                      <strong>Obs:</strong> {res.notes}
                    </p>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="text-xs text-slate-500">
                    {res.status === 'aprovada' && (
                      <span className="text-blue-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Pronto para retirada no NTE até 15 minutos antes
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Edit reservation button */}
                    <button
                      onClick={() => onEditReservation(res)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors shadow-2xs"
                      title="Editar nome do professor, matéria ou horário"
                    >
                      <span>✏️ Editar</span>
                    </button>

                    {/* View voucher */}
                    <button
                      onClick={() => onOpenReceipt(res)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      Ver Comprovante
                    </button>

                    {/* Cancel action */}
                    {isCancelable && (
                      <button
                        onClick={() => setCancelingId(res.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancelar Reserva
                      </button>
                    )}
                  </div>
                </div>

                {/* Confirmation prompt inline */}
                {cancelingId === res.id && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2 animate-in fade-in duration-100">
                    <p className="font-semibold text-rose-900">
                      Tem certeza que deseja cancelar esta reserva ({res.id})?
                    </p>
                    <p className="text-rose-700 text-[11px]">
                      O equipamento ficará imediatamente disponível para outros professores no sistema.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleConfirmCancel(res.id)}
                        className="px-3 py-1 bg-rose-600 text-white rounded font-medium hover:bg-rose-700 transition-colors"
                      >
                        Sim, Cancelar Agora
                      </button>
                      <button
                        onClick={() => setCancelingId(null)}
                        className="px-3 py-1 bg-white text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                      >
                        Voltar
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
