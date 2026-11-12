import React, { useState, useMemo } from 'react';
import { Reservation, Equipment } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Filter, 
  Layers, 
  Eye, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface CalendarViewProps {
  reservations: Reservation[];
  equipments: Equipment[];
  onOpenReceipt: (reservation: Reservation) => void;
  onOpenBooking: () => void;
  onEditReservation?: (reservation: Reservation) => void;
}

type ViewMode = 'month' | 'week' | 'day';

export const CalendarView: React.FC<CalendarViewProps> = ({
  reservations,
  equipments,
  onOpenReceipt,
  onOpenBooking,
  onEditReservation,
}) => {
  // Base date in current context (October 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 26)); // Oct 26, 2026
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    } else {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setCurrentDate(prevDay);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    } else {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 26));
  };

  // Filter reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      if (res.status === 'cancelada') return false;

      if (selectedEquipmentId !== 'all' && res.equipmentId !== selectedEquipmentId) {
        return false;
      }

      if (selectedCategory !== 'all') {
        const eq = equipments.find(e => e.id === res.equipmentId);
        if (!eq || eq.category !== selectedCategory) return false;
      }

      return true;
    });
  }, [reservations, equipments, selectedEquipmentId, selectedCategory]);

  // Status Color Helper
  const getStatusStyle = (status: Reservation['status']) => {
    switch (status) {
      case 'aprovada':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'retirada':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'devolvida':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'pendente':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  // Month grid generator
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const monthDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    return days;
  }, [year, month, firstDayIndex, daysInMonth]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Bar with Title and Quick Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Calendário de Reservas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consulte a ocupação dos equipamentos por dia, semana e mês para planejar suas aulas com antecedência.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-2xs shrink-0"
        >
          <CalendarIcon className="w-4 h-4" />
          Agendar Neste Período
        </button>
      </div>

      {/* Control Panel: Navigation, View Toggle, and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Month / Period Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
              <button
                onClick={handlePrev}
                className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border-x border-slate-200 transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Próximo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-base font-bold text-slate-900">
              {monthNames[month]} {year}
            </h2>
          </div>

          {/* View Mode Toggle (Segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'month' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'week' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'day' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dia
            </button>
          </div>

        </div>

        {/* Secondary Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          
          {/* Equipment selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium shrink-0">Equipamento:</span>
            <select
              value={selectedEquipmentId}
              onChange={(e) => setSelectedEquipmentId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todos os Equipamentos</option>
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.name} ({eq.patrimony})</option>
              ))}
            </select>
          </div>

          {/* Category selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium shrink-0">Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todas as Categorias</option>
              <option value="datashow">Datashows & Projetores</option>
              <option value="tv">Televisores & Smart TVs</option>
              <option value="chromebook">Chromebooks & Notebooks</option>
              <option value="audio">Caixas de Som & Microfones</option>
              <option value="cables">Cabos & Adaptadores</option>
            </select>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-[11px] text-slate-600 sm:col-span-2 md:col-span-1 justify-start md:justify-end flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              Aprovada
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              Retirada
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Devolvida
            </span>
          </div>

        </div>
      </div>

      {/* Calendar Grid — View Mode: Month */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold text-slate-600 py-2.5">
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
            {monthDays.map((cell, idx) => {
              const dayReservations = filteredReservations.filter(r => r.date === cell.dateStr);
              const isToday = cell.dateStr === '2026-10-26';

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] p-1.5 flex flex-col justify-between transition-colors ${
                    cell.isCurrentMonth ? 'bg-white' : 'bg-slate-50/50 text-slate-400'
                  } ${isToday ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-mono font-medium inline-block w-6 h-6 leading-6 text-center rounded-full ${
                        isToday
                          ? 'bg-blue-600 text-white font-bold'
                          : cell.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {dayReservations.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dayReservations.length} {dayReservations.length === 1 ? 'reserva' : 'reservas'}
                      </span>
                    )}
                  </div>

                  {/* Day Events Stack */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-[90px] no-scrollbar">
                    {dayReservations.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => setSelectedReservation(res)}
                        className={`w-full text-left p-1 rounded border text-[11px] leading-tight block truncate transition-transform hover:scale-[1.02] ${getStatusStyle(
                          res.status
                        )}`}
                        title={`${res.equipmentName} - ${res.startTime} às ${res.endTime} (${res.requesterName})`}
                      >
                        <div className="font-semibold truncate">
                          {res.startTime} · {res.equipmentName.split(' ')[0]} {res.equipmentName.split(' ')[1]}
                        </div>
                        <div className="text-[10px] text-slate-600 truncate">
                          {res.location}
                        </div>
                      </button>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Week or Day View fallback list */}
      {(viewMode === 'week' || viewMode === 'day') && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Agendamentos para {viewMode === 'day' ? 'o dia selecionado' : 'esta semana'}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total listado: {filteredReservations.length}
            </span>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Nenhuma reserva registrada para este período.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredReservations.map((res) => (
                <div key={res.id} className="py-3 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{res.equipmentName}</span>
                      <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {res.equipmentPatrimony}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 font-mono">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        {res.date} ({res.startTime} às {res.endTime})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {res.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {res.requesterName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs rounded-md border font-medium ${getStatusStyle(res.status)}`}>
                      {res.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setSelectedReservation(res)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reservation Details Drawer/Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase">Detalhes da Reserva</span>
                <h3 className="text-base font-bold text-slate-900">{selectedReservation.equipmentName}</h3>
              </div>
              <span className={`px-2.5 py-1 text-xs rounded-md border font-medium ${getStatusStyle(selectedReservation.status)}`}>
                {selectedReservation.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Protocolo:</span>
                  <span className="font-mono font-bold text-blue-700">{selectedReservation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patrimônio:</span>
                  <span className="font-mono text-slate-800">{selectedReservation.equipmentPatrimony}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Solicitante:</span>
                  <span className="font-medium text-slate-800">{selectedReservation.requesterName}</span>
                </div>
                {selectedReservation.subject && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Matéria:</span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      📚 {selectedReservation.subject}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">E-mail:</span>
                  <span className="text-slate-600">{selectedReservation.requesterEmail}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Data e Horário</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {new Date(selectedReservation.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </span>
                  <span className="font-mono text-slate-600 text-[11px]">
                    {selectedReservation.startTime} às {selectedReservation.endTime}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Local</span>
                  <span className="font-semibold text-slate-900 block mt-0.5 truncate">
                    {selectedReservation.location}
                  </span>
                  <span className="capitalize text-slate-500 text-[11px]">
                    Turno: {selectedReservation.shift}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Finalidade:</span>
                <p className="p-2.5 bg-slate-50 rounded-md border border-slate-200 text-slate-700 mt-1">
                  {selectedReservation.purpose}
                </p>
              </div>

              {selectedReservation.notes && (
                <div>
                  <span className="text-slate-500 font-medium block">Observações:</span>
                  <p className="p-2 bg-slate-50 rounded-md border border-slate-200 text-slate-600 mt-1 text-[11px]">
                    {selectedReservation.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 flex-wrap">
              <button
                onClick={() => setSelectedReservation(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Fechar
              </button>
              {onEditReservation && (
                <button
                  onClick={() => {
                    const res = selectedReservation;
                    setSelectedReservation(null);
                    onEditReservation(res);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                >
                  <span>✏️ Editar Reserva</span>
                </button>
              )}
              <button
                onClick={() => {
                  const res = selectedReservation;
                  setSelectedReservation(null);
                  onOpenReceipt(res);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Ver Comprovante
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
