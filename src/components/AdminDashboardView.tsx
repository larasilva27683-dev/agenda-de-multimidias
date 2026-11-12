import React, { useState } from 'react';
import { Equipment, Reservation, UserProfile } from '../types';
import { storageService } from '../services/storageService';
import { 
  ShieldCheck, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileDown, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Wrench, 
  ArrowUpRight, 
  Search,
  Filter,
  Check,
  RotateCcw,
  BarChart3,
  Calendar
} from 'lucide-react';

interface AdminDashboardViewProps {
  equipments: Equipment[];
  reservations: Reservation[];
  currentUser: UserProfile;
  onOpenNewEquipmentModal: () => void;
  onEditEquipment: (equipment: Equipment) => void;
  onRefresh: () => void;
  onOpenReceipt: (reservation: Reservation) => void;
  onEditReservation: (reservation: Reservation) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  equipments,
  reservations,
  currentUser,
  onOpenNewEquipmentModal,
  onEditEquipment,
  onRefresh,
  onOpenReceipt,
  onEditReservation,
}) => {
  const [adminTab, setAdminTab] = useState<'reservations' | 'inventory' | 'reports'>('reservations');
  const [searchQuery, setSearchQuery] = useState('');
  const [reservationFilter, setReservationFilter] = useState<'all' | 'pending' | 'active' | 'overdue'>('all');

  // Overdue check logic:
  // Today is 2026-10-26
  const isOverdue = (res: Reservation) => {
    if (res.status !== 'retirada' && res.status !== 'aprovada') return false;
    const nowTimeStr = '12:00'; // Baseline current simulated time
    if (res.date < '2026-10-26') return true;
    if (res.date === '2026-10-26' && res.endTime < nowTimeStr && res.status === 'retirada') return true;
    return false;
  };

  const handleApprove = (id: string) => {
    storageService.updateReservationStatus(id, 'aprovada');
    onRefresh();
  };

  const handleReject = (id: string) => {
    storageService.updateReservationStatus(id, 'cancelada');
    onRefresh();
  };

  const handleCheckOut = (id: string) => {
    storageService.updateReservationStatus(id, 'retirada');
    onRefresh();
  };

  const handleCheckIn = (id: string) => {
    storageService.updateReservationStatus(id, 'devolvida');
    onRefresh();
  };

  const handleToggleMaintenance = (equipment: Equipment) => {
    const isMaint = equipment.status === 'manutencao';
    const updated: Equipment = {
      ...equipment,
      status: isMaint ? 'disponivel' : 'manutencao',
      availableQuantity: isMaint ? equipment.totalQuantity : 0,
      maintenanceNotes: isMaint ? undefined : 'Bloqueado para manutenção preventiva e revisão de rotina.',
    };
    storageService.updateEquipment(updated);
    onRefresh();
  };

  const handleDeleteEquipment = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o equipamento "${name}"?`)) {
      storageService.deleteEquipment(id);
      onRefresh();
    }
  };

  // Filtered reservations
  const filteredReservations = reservations.filter(res => {
    if (reservationFilter === 'pending' && res.status !== 'pendente') return false;
    if (reservationFilter === 'active' && res.status !== 'retirada' && res.status !== 'aprovada') return false;
    if (reservationFilter === 'overdue' && !isOverdue(res)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.id.toLowerCase().includes(q) ||
        res.equipmentName.toLowerCase().includes(q) ||
        res.equipmentPatrimony.toLowerCase().includes(q) ||
        res.requesterName.toLowerCase().includes(q) ||
        res.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Analytics Metrics
  const totalReservations = reservations.length;
  const completedReservations = reservations.filter(r => r.status === 'devolvida').length;
  const activeReservations = reservations.filter(r => r.status === 'retirada' || r.status === 'aprovada').length;
  const pendingCount = reservations.filter(r => r.status === 'pendente').length;
  const overdueCount = reservations.filter(isOverdue).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Admin Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-100 text-indigo-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Painel de Gestão do NTE / TI
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Administração de Multimídia & Empréstimos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Controle de inventário patrimonial, fluxo de retiradas/devoluções e aprovação de reservas escolares.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => storageService.exportReservationsToCSV()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5" />
            Exportar CSV
          </button>
          <button
            onClick={onOpenNewEquipmentModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            Novo Equipamento
          </button>
        </div>
      </div>

      {/* KPI Cards Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total de Equipamentos</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {equipments.reduce((sum, e) => sum + e.totalQuantity, 0)}
            </span>
            <span className="text-xs text-slate-400">em {equipments.length} modelos</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Reservas Ativas / Em Uso</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-600 font-mono tabular-nums">
              {activeReservations}
            </span>
            <span className="text-xs text-slate-400">hoje na escola</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Aprovações Pendentes</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-mono tabular-nums ${pendingCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingCount}
            </span>
            <span className="text-xs text-slate-400">requisições</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Atrasos Identificados</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-mono tabular-nums ${overdueCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {overdueCount}
            </span>
            <span className="text-xs text-slate-400">não devolvidos</span>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => setAdminTab('reservations')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            adminTab === 'reservations'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Gestão de Reservas & Check-in/out</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('inventory')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            adminTab === 'inventory'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventário & Manutenções</span>
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            adminTab === 'reports'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Relatórios de Utilização</span>
        </button>
      </div>

      {/* TAB 1: RESERVATIONS CONTROL */}
      {adminTab === 'reservations' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por protocolo, professor, sala..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setReservationFilter('all')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  reservationFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setReservationFilter('pending')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  reservationFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pendentes ({pendingCount})
              </button>
              <button
                onClick={() => setReservationFilter('active')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  reservationFilter === 'active' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ativas
              </button>
              <button
                onClick={() => setReservationFilter('overdue')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  reservationFilter === 'overdue' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Atrasadas ({overdueCount})
              </button>
            </div>
          </div>

          {/* Table of reservations */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Protocolo</th>
                    <th className="px-4 py-3">Equipamento & Patrimônio</th>
                    <th className="px-4 py-3">Solicitante</th>
                    <th className="px-4 py-3">Data & Horário</th>
                    <th className="px-4 py-3">Local de Uso</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Ações de Controle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        Nenhuma reserva encontrada com os critérios selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => {
                      const overdue = isOverdue(res);

                      return (
                        <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-blue-700">
                            {res.id}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-900 block">{res.equipmentName}</span>
                            <span className="text-[11px] font-mono text-slate-400">{res.equipmentPatrimony}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-slate-900 block">{res.requesterName}</span>
                            {res.subject && (
                              <span className="font-semibold text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
                                📚 {res.subject}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 block">{res.requesterEmail}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium block">{res.date}</span>
                            <span className="font-mono text-[11px] text-slate-500">{res.startTime} às {res.endTime}</span>
                          </td>
                          <td className="px-4 py-3 max-w-[150px] truncate" title={res.location}>
                            {res.location}
                          </td>
                          <td className="px-4 py-3">
                            {overdue ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                Atraso na Devolução
                              </span>
                            ) : res.status === 'pendente' ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                Pendente
                              </span>
                            ) : res.status === 'aprovada' ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                Aprovada
                              </span>
                            ) : res.status === 'retirada' ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                                Em Uso (Retirado)
                              </span>
                            ) : res.status === 'devolvida' ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Devolvido
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                Cancelada
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Workflow Actions */}
                              {res.status === 'pendente' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(res.id)}
                                    className="px-2 py-1 text-[11px] font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    title="Aprovar Agendamento"
                                  >
                                    Aprovar
                                  </button>
                                  <button
                                    onClick={() => handleReject(res.id)}
                                    className="px-2 py-1 text-[11px] font-medium bg-slate-100 text-rose-600 rounded hover:bg-rose-50 transition-colors"
                                    title="Rejeitar Solicitação"
                                  >
                                    Rejeitar
                                  </button>
                                </>
                              )}

                              {res.status === 'aprovada' && (
                                <button
                                  onClick={() => handleCheckOut(res.id)}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-2xs"
                                  title="Registrar Retirada pelo Professor (Check-out)"
                                >
                                  Registrar Retirada
                                </button>
                              )}

                              {res.status === 'retirada' && (
                                <button
                                  onClick={() => handleCheckIn(res.id)}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors shadow-2xs"
                                  title="Confirmar Devolução do Equipamento (Check-in)"
                                >
                                  Confirmar Devolução
                                </button>
                              )}

                              <button
                                onClick={() => onEditReservation(res)}
                                className="px-2 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors"
                                title="Editar professor, matéria ou detalhes"
                              >
                                ✏️ Editar
                              </button>

                              <button
                                onClick={() => onOpenReceipt(res)}
                                className="px-2 py-1 text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                                title="Ver Comprovante"
                              >
                                Comprovante
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: INVENTORY & MAINTENANCE */}
      {adminTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Inventário Físico do NTE</h3>
                <p className="text-xs text-slate-500">Controle de localização, bloqueio para manutenção e exclusão de itens patrimoniais.</p>
              </div>
              <button
                onClick={onOpenNewEquipmentModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Adicionar Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Equipamento</th>
                    <th className="px-4 py-3">Patrimônio</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3">Localização Padrão</th>
                    <th className="px-4 py-3 text-center">Qtd Total</th>
                    <th className="px-4 py-3 text-center">Status Operacional</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {equipments.map((eq) => {
                    const isMaint = eq.status === 'manutencao';

                    return (
                      <tr key={eq.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-3">
                          <img
                            src={eq.image}
                            alt=""
                            className="w-10 h-10 object-cover rounded border border-slate-200"
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                          <div>
                            <span className="font-semibold block">{eq.name}</span>
                            <span className="text-[11px] text-slate-400 block line-clamp-1">{eq.description}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-slate-700">
                          {eq.patrimony}
                        </td>
                        <td className="px-4 py-3 capitalize">
                          {eq.category}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {eq.location}
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold">
                          {eq.totalQuantity}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isMaint ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                              <Wrench className="w-3 h-3" />
                              Em Manutenção
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Operacional
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleMaintenance(eq)}
                              className={`p-1.5 rounded transition-colors ${
                                isMaint 
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              }`}
                              title={isMaint ? 'Desbloquear da Manutenção' : 'Enviar para Manutenção'}
                            >
                              <Wrench className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditEquipment(eq)}
                              className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition-colors"
                              title="Editar Equipamento"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEquipment(eq.id, eq.name)}
                              className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded transition-colors"
                              title="Excluir Equipamento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS & METRICS */}
      {adminTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Top Demand Equipments */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Equipamentos Mais Requisitados</h3>
              <p className="text-xs text-slate-500">Ranking baseado no volume total de agendamentos realizados.</p>
              
              <div className="space-y-2 pt-2">
                {equipments.slice(0, 4).map((eq, idx) => {
                  const count = reservations.filter(r => r.equipmentId === eq.id).length;
                  const percent = Math.min(100, Math.round((count / Math.max(1, totalReservations)) * 100));

                  return (
                    <div key={eq.id} className="text-xs space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="truncate max-w-[200px]">{idx + 1}. {eq.name}</span>
                        <span className="font-mono text-slate-500">{count} reservas</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.max(10, percent)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Rooms / Locations */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Espaços com Maior Demanda</h3>
              <p className="text-xs text-slate-500">Salas e laboratórios que mais utilizam recursos multimídia.</p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-800">Auditório Principal Paulo Freire</span>
                  <span className="font-mono font-bold text-blue-700">4 agendamentos</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-800">Sala 14 — 3º Ano Ensino Médio</span>
                  <span className="font-mono font-bold text-blue-700">3 agendamentos</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-800">Laboratório de Informática 02</span>
                  <span className="font-mono font-bold text-blue-700">2 agendamentos</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-800">Laboratório de Ciências & Física</span>
                  <span className="font-mono font-bold text-blue-700">2 agendamentos</span>
                </div>
              </div>
            </div>

            {/* Operational Quality Indicator */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Taxa de Devolução no Prazo</h3>
              <p className="text-xs text-slate-500">Conformidade das devoluções sem atrasos na rotina escolar.</p>

              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                <span className="text-3xl font-extrabold text-emerald-800 font-mono">
                  96.4%
                </span>
                <span className="text-xs text-emerald-700 block mt-1 font-medium">
                  Índice de Pontualidade
                </span>
              </div>

              <div className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Total de empréstimos concluídos:</span>
                  <span className="font-bold text-slate-800">{completedReservations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Equipamentos em manutenção:</span>
                  <span className="font-bold text-rose-600">
                    {equipments.filter(e => e.status === 'manutencao').length}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Reset Demo Data & Export Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Manutenção dos Registros da Aplicação</h4>
              <p className="text-[11px] text-slate-500">
                Baixe relatórios tabulares em formato CSV para prestação de contas ou restaure os dados de demonstração da escola.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => storageService.exportReservationsToCSV()}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-2xs"
              >
                Download Relatório CSV
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Deseja redefinir os dados para o padrão de demonstração?')) {
                    storageService.resetDemoData();
                    onRefresh();
                  }
                }}
                className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Restaurar Dados Demo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
