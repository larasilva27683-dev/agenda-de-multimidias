import React, { useState, useEffect } from 'react';
import { Equipment, UserProfile, Reservation } from '../types';
import { storageService } from '../services/storageService';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Sparkles,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';

interface BookingFormViewProps {
  equipments: Equipment[];
  currentUser: UserProfile;
  initialEquipmentId?: string;
  onSuccess: (reservation: Reservation) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const BookingFormView: React.FC<BookingFormViewProps> = ({
  equipments,
  currentUser,
  initialEquipmentId,
  onSuccess,
  onCancel,
  isModal = false,
}) => {
  // Today's date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedEqId, setSelectedEqId] = useState<string>(
    initialEquipmentId || equipments[0]?.id || ''
  );
  const [date, setDate] = useState<string>(todayStr);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('09:40');
  const [shift, setShift] = useState<'manha' | 'tarde' | 'noite'>('manha');
  const [location, setLocation] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [subject, setSubject] = useState<string>(currentUser.subject || currentUser.department || 'Língua Portuguesa');
  const [notes, setNotes] = useState<string>('');
  const [requesterName, setRequesterName] = useState<string>(currentUser.name);
  const [requesterEmail, setRequesterEmail] = useState<string>(currentUser.email);
  
  // Real-time conflict feedback
  const [availabilityState, setAvailabilityState] = useState<{
    checking: boolean;
    available: boolean;
    reason?: string;
    conflicts: Reservation[];
  }>({ checking: false, available: true, conflicts: [] });

  const [formError, setFormError] = useState<string | null>(null);

  // Quick preset common school subjects
  const commonSubjects = [
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
  ];

  // Quick preset locations
  const commonLocations = [
    'Sala 10 — 1º Ano Ensino Médio',
    'Sala 12 — 2º Ano Ensino Médio',
    'Sala 14 — 3º Ano Ensino Médio',
    'Auditório Paulo Freire',
    'Laboratório de Informática 01',
    'Laboratório de Ciências',
    'Sala dos Professores',
    'Pátio Coberto Principal',
  ];

  // Quick shift time presets
  const shiftPresets = [
    { label: 'Manhã (1º e 2º Horário)', shift: 'manha' as const, start: '07:30', end: '09:10' },
    { label: 'Manhã (3º e 4º Horário)', shift: 'manha' as const, start: '09:30', end: '11:10' },
    { label: 'Tarde Integral', shift: 'tarde' as const, start: '13:30', end: '17:00' },
    { label: 'Noite (Aulas EJA)', shift: 'noite' as const, start: '19:00', end: '21:30' },
  ];

  // Check availability whenever equipment, date, startTime, or endTime changes
  useEffect(() => {
    if (!selectedEqId || !date || !startTime || !endTime) return;

    setAvailabilityState(prev => ({ ...prev, checking: true }));
    const result = storageService.checkAvailability(selectedEqId, date, startTime, endTime, 1);
    setAvailabilityState({
      checking: false,
      available: result.available,
      reason: result.conflictReason,
      conflicts: result.conflictingReservations,
    });
  }, [selectedEqId, date, startTime, endTime]);

  // Sync user if currentUser changes
  useEffect(() => {
    setRequesterName(currentUser.name);
    setRequesterEmail(currentUser.email);
  }, [currentUser]);

  const selectedEquipment = equipments.find(e => e.id === selectedEqId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedEqId) {
      setFormError('Selecione um equipamento.');
      return;
    }
    if (!location.trim()) {
      setFormError('Informe o local de utilização do equipamento.');
      return;
    }
    if (!purpose.trim()) {
      setFormError('Informe a finalidade pedagógica ou institucional.');
      return;
    }

    if (!availabilityState.available) {
      setFormError(availabilityState.reason || 'O horário selecionado está indisponível.');
      return;
    }

    const result = storageService.createReservation({
      equipmentId: selectedEqId,
      requesterName,
      requesterEmail,
      requesterRole: currentUser.role === 'admin' ? 'servidor' : currentUser.role,
      subject: subject || 'Geral',
      date,
      startTime,
      endTime,
      shift,
      location,
      purpose,
      notes,
      quantity: 1,
    });

    if (result.success && result.reservation) {
      onSuccess(result.reservation);
    } else {
      setFormError(result.error || 'Não foi possível concluir o agendamento.');
    }
  };

  const content = (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      
      {/* Form Header */}
      <div className="p-6 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Formulário de Agendamento de Equipamento
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preencha os dados da reserva. O sistema verificará automaticamente a disponibilidade para evitar duplicidades.
          </p>
        </div>
        {isModal && onCancel && (
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Error notification banner */}
        {formError && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div className="flex-1 whitespace-pre-line">{formError}</div>
          </div>
        )}

        {/* Section 1: User & Identification (SUPER SIMPLE TO EDIT) */}
        <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <span>👤 Professor & Matéria</span>
            </span>
            <span className="text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200 font-medium">
              💡 Você pode editar qualquer nome aqui
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Nome do Professor(a):
              </label>
              <input
                type="text"
                required
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border-2 border-slate-300 focus:outline-none focus:border-blue-600 bg-white shadow-xs"
                placeholder="Ex: Prof. Mariana Alencar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Matéria / Disciplina:
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border-2 border-slate-300 focus:outline-none focus:border-blue-600 bg-white shadow-xs"
                placeholder="Ex: Língua Portuguesa, Matemática..."
              />
            </div>
          </div>

          {/* Quick 1-click Subject pills */}
          <div>
            <span className="text-[11px] text-slate-500 font-medium block mb-1">
              Clique para escolher a matéria rapidinho:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {commonSubjects.map((sub, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSubject(sub)}
                  className={`px-2.5 py-1 text-[11px] rounded-md border transition-all ${
                    subject === sub
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Equipment Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Equipamento Desejado *</span>
            <span className="text-[11px] text-slate-400">
              {equipments.filter(e => e.status !== 'manutencao').length} disponíveis na instituição
            </span>
          </label>
          
          <select
            value={selectedEqId}
            onChange={(e) => setSelectedEqId(e.target.value)}
            className="w-full px-3 py-2.5 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            {equipments.map(eq => (
              <option 
                key={eq.id} 
                value={eq.id}
                disabled={eq.status === 'manutencao'}
              >
                {eq.name} — [{eq.patrimony}] {eq.status === 'manutencao' ? '(EM MANUTENÇÃO)' : `(${eq.totalQuantity} un. no total)`}
              </option>
            ))}
          </select>

          {/* Selected Equipment Card Preview */}
          {selectedEquipment && (
            <div className="mt-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-28 h-20 bg-slate-200 rounded-md overflow-hidden shrink-0 border border-slate-300/60">
                <img
                  src={selectedEquipment.image}
                  alt={selectedEquipment.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">{selectedEquipment.name}</span>
                  <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedEquipment.patrimony}
                  </span>
                </div>
                <p className="text-slate-500 mt-1 line-clamp-1">{selectedEquipment.description}</p>
                <div className="flex items-center gap-4 mt-2 text-slate-600 flex-wrap">
                  <span>Local: <strong>{selectedEquipment.location}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Estoque: <strong>{selectedEquipment.totalQuantity} unidade(s)</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Date and Time Schedule */}
        <div className="p-4 bg-slate-50/60 rounded-lg border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              Data e Horários da Reserva
            </span>
            <span className="text-[11px] text-slate-500">Validação em tempo real</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Data de Utilização *
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Horário de Retirada *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Horário de Devolução *
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Quick Shift Presets */}
          <div>
            <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
              Atalhos de Turnos Escolares:
            </span>
            <div className="flex flex-wrap gap-2">
              {shiftPresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setShift(preset.shift);
                    setStartTime(preset.start);
                    setEndTime(preset.end);
                  }}
                  className={`px-2.5 py-1 text-[11px] rounded-md border transition-colors ${
                    startTime === preset.start && endTime === preset.end
                      ? 'bg-blue-600 text-white border-blue-600 font-medium'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Availability Status Card */}
          <div className="pt-2">
            {availabilityState.checking ? (
              <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600 flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                <span>Verificando disponibilidade em tempo real...</span>
              </div>
            ) : availabilityState.available ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  Equipamento 100% disponível para o dia {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')} das {startTime} às {endTime}.
                </span>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block">Conflito de Horário Detectado!</strong>
                    <p className="mt-0.5 whitespace-pre-line text-[11px]">
                      {availabilityState.reason}
                    </p>
                    <p className="mt-1 text-[10px] text-amber-700">
                      Por favor, escolha outro horário ou selecione outro equipamento similar no catálogo.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Section 4: Location and Purpose */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Local de Utilização na Escola *</span>
              <span className="text-[11px] text-slate-400">Ex: Sala 12, Auditório, etc.</span>
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              placeholder="Digite o local ou selecione abaixo"
            />
            {/* Quick Location Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {commonLocations.map((loc, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setLocation(loc)}
                  className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Finalidade Pedagógica / Objetivo do Uso *
            </label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              placeholder="Ex: Aula prática com slides sobre Genética / Exibição de documentário histórico"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações ou Acessórios Adicionais (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              placeholder="Ex: Preciso de extensão elétrica de 10 metros ou adaptador para Mac USB-C"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={!availabilityState.available}
            className={`px-5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 ${
              availabilityState.available
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Confirmar Agendamento</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </form>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-2xl my-8">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      {content}
    </div>
  );
};
