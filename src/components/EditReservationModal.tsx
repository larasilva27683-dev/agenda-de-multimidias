import React, { useState } from 'react';
import { Reservation, Equipment } from '../types';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Check, 
  X, 
  Edit3,
  Layers
} from 'lucide-react';

interface EditReservationModalProps {
  reservation: Reservation;
  equipments: Equipment[];
  onSave: (updated: Reservation) => void;
  onClose: () => void;
}

const COMMON_SUBJECTS = [
  'Língua Portuguesa',
  'Matemática',
  'História',
  'Geografia',
  'Ciências / Biologia',
  'Física',
  'Química',
  'Inglês',
  'Educação Física',
  'Artes',
  'Filosofia / Sociologia',
  'Robótica / Informática',
  'Coordenação Pedagógica',
];

const COMMON_LOCATIONS = [
  'Sala 10 — 1º Ano Ensino Médio',
  'Sala 12 — 2º Ano Ensino Médio',
  'Sala 14 — 3º Ano Ensino Médio',
  'Auditório Paulo Freire',
  'Laboratório de Informática 01',
  'Laboratório de Ciências',
  'Sala dos Professores',
  'Pátio Coberto Principal',
];

export const EditReservationModal: React.FC<EditReservationModalProps> = ({
  reservation,
  equipments,
  onSave,
  onClose,
}) => {
  const [requesterName, setRequesterName] = useState(reservation.requesterName);
  const [subject, setSubject] = useState(reservation.subject || 'Língua Portuguesa');
  const [equipmentId, setEquipmentId] = useState(reservation.equipmentId);
  const [date, setDate] = useState(reservation.date);
  const [startTime, setStartTime] = useState(reservation.startTime);
  const [endTime, setEndTime] = useState(reservation.endTime);
  const [location, setLocation] = useState(reservation.location);
  const [purpose, setPurpose] = useState(reservation.purpose);
  const [status, setStatus] = useState(reservation.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eq = equipments.find(item => item.id === equipmentId);

    onSave({
      ...reservation,
      requesterName: requesterName.trim() || reservation.requesterName,
      subject: subject.trim(),
      equipmentId,
      equipmentName: eq ? eq.name : reservation.equipmentName,
      equipmentPatrimony: eq ? eq.patrimony : reservation.equipmentPatrimony,
      date,
      startTime,
      endTime,
      location: location.trim() || reservation.location,
      purpose: purpose.trim() || reservation.purpose,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border-2 border-blue-400 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              ✏️
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Editar Agendamento ({reservation.id})
              </h3>
              <p className="text-xs text-slate-500">
                Altere o nome do professor, a matéria, o horário ou a sala
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Row 1: Professor + Matéria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-blue-50/60 p-3.5 rounded-xl border border-blue-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Nome do Professor(a):</span>
              </label>
              <input
                type="text"
                required
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Ex: Prof. José da Silva"
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nome da Matéria:</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Português, Matemática..."
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-white"
              />
            </div>

            {/* Quick subject suggestions */}
            <div className="sm:col-span-2 flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-medium mr-1 py-0.5">Sugestões:</span>
              {COMMON_SUBJECTS.slice(0, 6).map((sub, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSubject(sub)}
                  className="px-2 py-0.5 text-[10px] bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700"
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Equipamento */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Equipamento Escolhido:</span>
            </label>
            <select
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium"
            >
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} — [{eq.patrimony}]
                </option>
              ))}
            </select>
          </div>

          {/* Row 3: Data e Horário */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Data:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Início:</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Devolução:</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono font-medium"
              />
            </div>
          </div>

          {/* Row 4: Sala / Local */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sala / Local de Uso:</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Sala 12 — 2º Ano A"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {COMMON_LOCATIONS.slice(0, 4).map((loc, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setLocation(loc)}
                  className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                >
                  {loc.split('—')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Row 5: Finalidade / Descrição da Aula */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Finalidade da Aula / Conteúdo:</label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Ex: Apresentação de slides sobre o sistema solar"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          {/* Row 6: Status da reserva */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status da Reserva:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Reservation['status'])}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="aprovada">Aprovada / Confirmada</option>
              <option value="retirada">Retirada (Em Uso)</option>
              <option value="devolvida">Devolvida (Concluída)</option>
              <option value="pendente">Pendente de Aprovação</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
