import React from 'react';
import { Equipment, Reservation, UserProfile } from '../types';
import { 
  PlusCircle, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Tv, 
  Laptop, 
  Volume2, 
  Cable,
  BookOpen,
  FileCheck
} from 'lucide-react';

interface HomeViewProps {
  equipments: Equipment[];
  reservations: Reservation[];
  currentUser: UserProfile;
  onOpenBookingModal: (equipmentId?: string) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenReceipt: (reservation: Reservation) => void;
  onEditTeacher: () => void;
  onEditReservation: (reservation: Reservation) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  equipments,
  reservations,
  currentUser,
  onOpenBookingModal,
  onNavigateToTab,
  onOpenReceipt,
  onEditTeacher,
  onEditReservation,
}) => {
  // Today's date YYYY-MM-DD
  const todayStr = '2026-10-26';

  // Metrics
  const totalEquipments = equipments.reduce((sum, e) => sum + e.totalQuantity, 0);
  const availableEquipments = equipments.reduce(
    (sum, e) => sum + (e.status === 'manutencao' ? 0 : e.availableQuantity),
    0
  );
  const maintenanceCount = equipments.filter(e => e.status === 'manutencao').length;
  
  // Today's reservations
  const todayReservations = reservations.filter(r => r.date === todayStr && r.status !== 'cancelada');
  const activeNowReservations = todayReservations.filter(r => r.status === 'retirada' || r.status === 'aprovada');

  return (
    <div className="space-y-8">
      
      {/* Quick Teacher & Subject Profile Card (BABY-SIMPLE TO EDIT) */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            👨‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                Professor Ativo
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                {currentUser.name}
              </span>
            </div>
            <p className="text-xs text-amber-950 mt-1 flex items-center gap-2 flex-wrap">
              <span>Matéria: <strong className="text-blue-900 bg-white px-2 py-0.5 rounded border border-amber-200">{currentUser.subject || currentUser.department || 'Língua Portuguesa'}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-600">{currentUser.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onEditTeacher}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
        >
          <span>✏️ Mudar Meu Nome / Matéria</span>
        </button>
      </div>

      {/* Hero Institutional Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-10 shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-blue-200 text-xs font-medium mb-4 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Sistema Integrado do Núcleo de Tecnologia Educacional</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Multimídia Fácil
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
            Agendamento rápido, transparente e sem conflitos de equipamentos tecnológicos para professores e servidores. Garanta seus recursos para aulas dinâmicas e apresentações.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenBookingModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-blue-950 bg-white hover:bg-blue-50 rounded-lg shadow-sm transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-blue-700" />
              Novo Agendamento
            </button>

            <button
              onClick={() => onNavigateToTab('calendar')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Ver Calendário
            </button>

            <button
              onClick={() => onNavigateToTab('equipments')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
            >
              <Layers className="w-4 h-4" />
              Catálogo de Recursos
            </button>
          </div>
        </div>

        {/* Decorative background subtle glow */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Dashboard Ribbon (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Disponíveis */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Equipamentos Disponíveis</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {availableEquipments}
            </span>
            <span className="text-xs text-slate-400">de {totalEquipments} unidades</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Prontos para reserva imediata</p>
        </div>

        {/* Card 2: Reservados / Em Uso */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Equipamentos em Uso</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700 font-mono tabular-nums">
              {activeNowReservations.length}
            </span>
            <span className="text-xs text-slate-400">em salas e auditórios</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Circulação ativa na escola</p>
        </div>

        {/* Card 3: Agendamentos do Dia */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Agendamentos de Hoje</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {todayReservations.length}
            </span>
            <span className="text-xs text-slate-400">turnos Manhã/Tarde</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">26 de Outubro de 2026</p>
        </div>

        {/* Card 4: Manutenção */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Em Manutenção</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
              {maintenanceCount}
            </span>
            <span className="text-xs text-slate-400">itens bloqueados</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Revisão preventiva técnica</p>
        </div>

      </div>

      {/* Main Content 2-Column Split: Today's Schedule & Quick Category Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Agendamentos de Hoje */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Agendamentos e Empréstimos de Hoje
              </h2>
              <p className="text-xs text-slate-500">
                Acompanhe as salas que estão com projetores, TVs e caixas de som alocados.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('calendar')}
              className="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1"
            >
              Ver todos no calendário
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayReservations.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Nenhum agendamento agendado para o dia de hoje. Os equipamentos estão totalmente livres!
            </div>
          ) : (
            <div className="space-y-3">
              {todayReservations.map((res) => {
                const isOngoing = res.status === 'retirada';
                const isApproved = res.status === 'aprovada';

                return (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100/70 text-blue-800 flex flex-col items-center justify-center shrink-0 font-mono">
                        <span className="text-[10px] uppercase font-bold text-blue-600">{res.shift}</span>
                        <span className="text-xs font-bold">{res.startTime}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {res.equipmentName}
                          </span>
                          <span className="font-mono text-[10px] text-blue-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {res.equipmentPatrimony}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>Professor: <strong>{res.requesterName}</strong></span>
                          {res.subject && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                📚 {res.subject}
                              </span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1 text-slate-700">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {res.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                      <button
                        onClick={() => onEditReservation(res)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                        title="Editar nome do professor, matéria ou horário desta reserva"
                      >
                        <span>✏️ Editar</span>
                      </button>

                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                          isOngoing
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : isApproved
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {isOngoing ? 'Em Uso na Sala' : isApproved ? 'Aguardando Retirada' : 'Devolvido'}
                      </span>
                      <button
                        onClick={() => onOpenReceipt(res)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200/60"
                        title="Ver Comprovante"
                      >
                        <FileCheck className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Category Shortcuts & Quick Guide */}
        <div className="space-y-6">
          
          {/* Quick Category Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Categorias em Destaque</h3>
            <p className="text-xs text-slate-500">Acesso rápido aos equipamentos mais requisitados da escola.</p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <button
                onClick={() => onNavigateToTab('equipments')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all"
              >
                <Layers className="w-5 h-5 text-blue-600 mb-1.5" />
                <span className="font-semibold text-slate-800 block">Datashows</span>
                <span className="text-[11px] text-slate-400">Projetores EPSON / BenQ</span>
              </button>

              <button
                onClick={() => onNavigateToTab('equipments')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all"
              >
                <Tv className="w-5 h-5 text-blue-600 mb-1.5" />
                <span className="font-semibold text-slate-800 block">Smart TVs</span>
                <span className="text-[11px] text-slate-400">Com suporte móvel 4K</span>
              </button>

              <button
                onClick={() => onNavigateToTab('equipments')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all"
              >
                <Laptop className="w-5 h-5 text-blue-600 mb-1.5" />
                <span className="font-semibold text-slate-800 block">Chromebooks</span>
                <span className="text-[11px] text-slate-400">Carrinho móvel 30 un.</span>
              </button>

              <button
                onClick={() => onNavigateToTab('equipments')}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all"
              >
                <Volume2 className="w-5 h-5 text-blue-600 mb-1.5" />
                <span className="font-semibold text-slate-800 block">Caixas de Som</span>
                <span className="text-[11px] text-slate-400">Microfones sem fio</span>
              </button>
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Instruções de Retirada & Devolução
            </h4>
            <ul className="space-y-2 text-slate-600 text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-blue-700">1.</span>
                <span>Faça a reserva com antecedência para evitar conflitos de horário.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-blue-700">2.</span>
                <span>Retire o item no NTE até 15 minutos antes do início da sua aula.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-blue-700">3.</span>
                <span>Confira os cabos e controle remoto na entrega e na devolução imediata.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Featured Equipment Spotlight Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Equipamentos Prontos para Agendamento
            </h2>
            <p className="text-xs text-slate-500">
              Clique em qualquer item para preencher o agendamento diretamente.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('equipments')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Ver catálogo completo ({equipments.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {equipments.slice(0, 4).map((eq) => (
            <div
              key={eq.id}
              className="border border-slate-200 rounded-lg overflow-hidden hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={eq.image}
                    alt={eq.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="p-3">
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    {eq.patrimony}
                  </span>
                  <h4 className="font-semibold text-slate-900 text-xs mt-1.5 line-clamp-1">
                    {eq.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {eq.description}
                  </p>
                </div>
              </div>

              <div className="p-3 pt-0">
                <button
                  onClick={() => onOpenBookingModal(eq.id)}
                  className="w-full py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors text-center"
                >
                  Agendar Este Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
