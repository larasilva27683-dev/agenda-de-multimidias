import React from 'react';
import { 
  Projector, 
  Calendar, 
  Layers, 
  PlusCircle, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  ChevronDown 
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
  onOpenBookingModal: (equipmentId?: string) => void;
  onEditTeacher: () => void;
  pendingApprovalsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onSwitchUser,
  allUsers,
  onOpenBookingModal,
  onEditTeacher,
  pendingApprovalsCount,
}) => {
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Brand title */}
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 text-left focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Projector className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                Multimídia Fácil
              </span>
              <span className="text-xs text-slate-500 block">
                Gestão & Agendamento Escolar
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                currentTab === 'home'
                  ? 'text-blue-700 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Início
            </button>

            <button
              onClick={() => setCurrentTab('equipments')}
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                currentTab === 'equipments'
                  ? 'text-blue-700 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Equipamentos
            </button>

            <button
              onClick={() => setCurrentTab('calendar')}
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                currentTab === 'calendar'
                  ? 'text-blue-700 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendário
            </button>

            <button
              onClick={() => setCurrentTab('my-reservations')}
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                currentTab === 'my-reservations'
                  ? 'text-blue-700 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              Minhas Reservas
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 relative ${
                currentTab === 'admin'
                  ? 'text-blue-700 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Painel NTE
              {pendingApprovalsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-amber-500 text-white rounded-full">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Actions & Quick Teacher Edit */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Super obvious button to edit teacher name and subject */}
            <button
              onClick={onEditTeacher}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-400 transition-all shadow-2xs"
              title="Clique para mudar o nome do professor ou a matéria"
            >
              <span className="text-sm">✏️</span>
              <span className="hidden sm:inline">Mudar</span>
              <span className="font-semibold text-slate-800 truncate max-w-[100px] md:max-w-[130px]">
                {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1] || ''}
              </span>
              {currentUser.subject && (
                <span className="hidden lg:inline text-[10px] text-blue-600 font-normal">
                  ({currentUser.subject.split(' ')[0]})
                </span>
              )}
            </button>

            <button
              onClick={() => onOpenBookingModal()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Agendamento</span>
            </button>

            {/* Profile Dropdown / Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none"
                title="Trocar perfil"
              >
                <div className={`w-7 h-7 rounded-md ${currentUser.avatarColor} text-white flex items-center justify-center text-xs font-bold`}>
                  {currentUser.name.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Alternar Perfil Ativo
                    </p>
                  </div>
                  <div className="py-1">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-2.5 text-xs hover:bg-slate-50 transition-colors ${
                          user.id === currentUser.id ? 'bg-blue-50/70 text-blue-900 font-medium' : 'text-slate-700'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded ${user.avatarColor} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{user.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{user.department}</p>
                        </div>
                        {user.id === currentUser.id && (
                          <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50/70 px-2 py-1.5 text-xs">
        <button
          onClick={() => setCurrentTab('home')}
          className={`px-2 py-1 rounded ${currentTab === 'home' ? 'text-blue-700 font-semibold' : 'text-slate-600'}`}
        >
          Início
        </button>
        <button
          onClick={() => setCurrentTab('equipments')}
          className={`px-2 py-1 rounded ${currentTab === 'equipments' ? 'text-blue-700 font-semibold' : 'text-slate-600'}`}
        >
          Equipamentos
        </button>
        <button
          onClick={() => onOpenBookingModal()}
          className="px-2 py-1 rounded bg-blue-600 text-white font-medium"
        >
          + Agendar
        </button>
        <button
          onClick={() => setCurrentTab('calendar')}
          className={`px-2 py-1 rounded ${currentTab === 'calendar' ? 'text-blue-700 font-semibold' : 'text-slate-600'}`}
        >
          Calendário
        </button>
        <button
          onClick={() => setCurrentTab('my-reservations')}
          className={`px-2 py-1 rounded ${currentTab === 'my-reservations' ? 'text-blue-700 font-semibold' : 'text-slate-600'}`}
        >
          Minhas Reservas
        </button>
        <button
          onClick={() => setCurrentTab('admin')}
          className={`px-2 py-1 rounded ${currentTab === 'admin' ? 'text-blue-700 font-semibold' : 'text-slate-600'}`}
        >
          NTE
        </button>
      </div>
    </header>
  );
};
