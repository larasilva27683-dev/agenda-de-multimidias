import React from 'react';
import { Projector, ShieldCheck, Mail, Phone, Clock, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigateToTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToTab }) => {
  return (
    <footer className="no-print bg-white border-t border-slate-200 mt-16 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: System Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Projector className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Multimídia Fácil</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Plataforma institucional de gestão e agendamento de equipamentos audiovisuais, notebooks e periféricos para a rede escolar.
            </p>
            <p className="text-[10px] text-slate-400">
              © 2026 Secretaria de Educação · Núcleo de Tecnologia Educacional
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Navegação Rápida</h4>
            <ul className="space-y-1.5 text-slate-600 text-xs">
              <li>
                <button onClick={() => onNavigateToTab('home')} className="hover:text-blue-600 transition-colors">
                  Página Inicial
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToTab('equipments')} className="hover:text-blue-600 transition-colors">
                  Catálogo de Equipamentos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToTab('calendar')} className="hover:text-blue-600 transition-colors">
                  Calendário de Ocupação
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToTab('my-reservations')} className="hover:text-blue-600 transition-colors">
                  Minhas Reservas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToTab('admin')} className="hover:text-blue-600 transition-colors">
                  Painel Administrativo NTE
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Suporte NTE */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Atendimento & NTE</h4>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Horário: 07:00 às 22:00 (Seg a Sex)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Sala 04 — Bloco Administrativo (NTE)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>suporte.tecnologia@escola.edu.br</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Ramal Interno: 204 / 205</span>
              </p>
            </div>
          </div>

          {/* Col 4: Boas Práticas */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Termo de Uso</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              O agendamento prévio garante a prioridade no uso. Por favor, devolva os equipamentos no horário estipulado para não prejudicar as aulas de outros docentes.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Patrimônio Escolar Protegido
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
