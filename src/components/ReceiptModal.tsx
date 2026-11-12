import React from 'react';
import { Reservation, Equipment } from '../types';
import { 
  CheckCircle2, 
  Printer, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  QrCode, 
  ShieldCheck, 
  User, 
  Download 
} from 'lucide-react';

interface ReceiptModalProps {
  reservation: Reservation;
  equipment?: Equipment;
  onClose: () => void;
  onEdit?: (reservation: Reservation) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  reservation,
  equipment,
  onClose,
  onEdit,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const statusLabels: Record<Reservation['status'], { text: string; color: string }> = {
    pendente: { text: 'Pendente de Aprovação', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    aprovada: { text: 'Agendamento Confirmado', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    retirada: { text: 'Equipamento Retirado / Em Uso', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    devolvida: { text: 'Concluído / Devolvido', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    cancelada: { text: 'Agendamento Cancelado', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  };

  const statusInfo = statusLabels[reservation.status] || statusLabels.aprovada;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header / Modal Action Bar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Comprovante de Reserva Emitido</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Institutional Header */}
          <div className="border-b border-slate-200 pb-5 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Secretaria de Estado da Educação · NTE
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Multimídia Fácil — Comprovante de Agendamento
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Controle e Empréstimo de Recursos Tecnológicos Pedagógicos
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-center sm:text-right">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Protocolo</span>
              <span className="font-mono text-sm font-bold text-blue-700 tracking-wider">
                {reservation.id}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className={`px-3 py-1 rounded-md text-xs font-medium border ${statusInfo.color}`}>
              {statusInfo.text}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Emitido em: {reservation.createdAt}
            </div>
          </div>

          {/* Solicitante & Equipamento Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 font-medium block">Solicitante / Professor(a)</span>
              <span className="text-slate-900 font-semibold text-sm flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {reservation.requesterName}
              </span>
              {reservation.subject && (
                <span className="inline-block mt-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                  📚 Disciplina: {reservation.subject}
                </span>
              )}
              <span className="text-slate-500 block mt-0.5">{reservation.requesterEmail}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Equipamento Selecionado</span>
              <span className="text-slate-900 font-semibold text-sm block mt-0.5">
                {reservation.equipmentName}
              </span>
              <span className="text-blue-700 font-mono text-[11px] block mt-0.5">
                Patrimônio: {reservation.equipmentPatrimony}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-b border-slate-100 py-4">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-medium block">Data da Reserva</span>
                <span className="text-slate-900 font-semibold text-sm">
                  {new Date(reservation.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="text-slate-500 capitalize block">Turno: {reservation.shift}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-medium block">Horário de Uso</span>
                <span className="text-slate-900 font-bold text-sm font-mono">
                  {reservation.startTime} às {reservation.endTime}
                </span>
                <span className="text-slate-500 block">Retirada até 15 min antes</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-medium block">Local de Utilização</span>
                <span className="text-slate-900 font-semibold">{reservation.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 font-medium block">Finalidade Pedagógica</span>
                <span className="text-slate-800">{reservation.purpose}</span>
              </div>
            </div>
          </div>

          {/* Accessories Checklist if available */}
          {equipment && equipment.accessories && equipment.accessories.length > 0 && (
            <div className="text-xs">
              <span className="text-slate-500 font-semibold block mb-1.5">
                Checklist de Acessórios para Retirada & Devolução:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-slate-600 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                {equipment.accessories.map((acc, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input type="checkbox" readOnly defaultChecked className="rounded text-blue-600 w-3.5 h-3.5 pointer-events-none" />
                    <span>{acc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR Code and Instructions */}
          <div className="flex items-center gap-4 bg-blue-50/60 p-4 rounded-lg border border-blue-100">
            <div className="w-16 h-16 bg-white p-1 rounded-md border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
              <QrCode className="w-14 h-14 text-slate-800" />
            </div>
            <div className="text-xs text-slate-600">
              <p className="font-semibold text-slate-900">
                Apresente este comprovante na Sala de Multimídia / NTE
              </p>
              <p className="mt-0.5 text-slate-500 leading-relaxed">
                Aponte o código QR ou informe o protocolo <strong>{reservation.id}</strong> para o responsável registrar o check-out do equipamento.
              </p>
            </div>
          </div>

          {/* Institutional Responsibility footer */}
          <div className="text-[11px] text-slate-400 leading-normal border-t border-slate-100 pt-3">
            O solicitante declara responsabilidade pela guarda, bom uso e devolução pontual do recurso multimídia, comunicando qualquer anormalidade imediatamente ao Núcleo de Tecnologia Educacional.
          </div>

        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="no-print flex items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div>
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(reservation);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
              >
                <span>✏️ Editar Informações</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Comprovante
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
