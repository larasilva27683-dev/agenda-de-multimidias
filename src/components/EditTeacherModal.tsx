import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, BookOpen, Check, X, Sparkles, Building, Mail } from 'lucide-react';

interface EditTeacherModalProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
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
  'Informática / Robótica',
  'Coordenação Pedagógica',
];

export const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  user,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(user.name);
  const [subject, setSubject] = useState(user.subject || user.department || 'Língua Portuguesa');
  const [department, setDepartment] = useState(user.department || '');
  const [email, setEmail] = useState(user.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...user,
      name: name.trim(),
      subject: subject.trim(),
      department: department.trim() || subject.trim(),
      email: email.trim() || user.email,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-blue-400 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              ✏️
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Editar Nome do Professor & Matéria
              </h3>
              <p className="text-xs text-slate-500">
                Altere aqui para preencher tudo com 1 clique
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
          {/* Nome do Professor */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Nome Completo do Professor(a):</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Prof. José Santos"
              className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all shadow-xs"
            />
          </div>

          {/* Matéria / Disciplina */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Matéria / Disciplina que leciona:</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Matemática, História, Português..."
              className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all shadow-xs"
            />

            {/* Quick click subjects */}
            <div className="mt-2">
              <span className="text-[11px] text-slate-500 font-medium block mb-1">
                Ou clique em uma matéria rápida:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {COMMON_SUBJECTS.map((sub, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setSubject(sub);
                      setDepartment(sub);
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-all ${
                      subject === sub
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* E-mail / Contato (opcional) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>E-mail Institucional:</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="professor@escola.edu.br"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Nome e Matéria</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
