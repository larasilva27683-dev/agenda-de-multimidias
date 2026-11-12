import React, { useState, useMemo } from 'react';
import { Equipment, EquipmentCategory } from '../types';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  PlusCircle, 
  Tv, 
  Laptop, 
  Volume2, 
  Cable, 
  MoreHorizontal,
  MapPin,
  Package
} from 'lucide-react';

interface EquipmentCatalogViewProps {
  equipments: Equipment[];
  onSelectEquipmentToBook: (equipmentId: string) => void;
  onOpenNewEquipmentModal?: () => void;
  isAdmin: boolean;
}

export const EquipmentCatalogView: React.FC<EquipmentCatalogViewProps> = ({
  equipments,
  onSelectEquipmentToBook,
  onOpenNewEquipmentModal,
  isAdmin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const categories: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todos os Equipamentos', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'datashow', label: 'Datashows & Projetores', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'tv', label: 'TVs & Smart TVs', icon: <Tv className="w-3.5 h-3.5" /> },
    { id: 'chromebook', label: 'Chromebooks & Notebooks', icon: <Laptop className="w-3.5 h-3.5" /> },
    { id: 'audio', label: 'Caixas de Som & Microfones', icon: <Volume2 className="w-3.5 h-3.5" /> },
    { id: 'cables', label: 'Cabos & Adaptadores', icon: <Cable className="w-3.5 h-3.5" /> },
    { id: 'others', label: 'Outros Recursos', icon: <MoreHorizontal className="w-3.5 h-3.5" /> },
  ];

  const filteredEquipments = useMemo(() => {
    return equipments.filter(eq => {
      // Category filter
      if (selectedCategory !== 'all' && eq.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'available' && (eq.status === 'manutencao' || eq.availableQuantity === 0)) {
        return false;
      }
      if (statusFilter === 'maintenance' && eq.status !== 'manutencao') {
        return false;
      }

      // Search query (name, patrimony, location, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          eq.name.toLowerCase().includes(query) ||
          eq.patrimony.toLowerCase().includes(query) ||
          eq.location.toLowerCase().includes(query) ||
          eq.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [equipments, selectedCategory, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Header with Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Catálogo de Equipamentos Multimídia
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Recursos audiovisuais, computadores e periféricos disponíveis para uso pedagógico e institucional.
          </p>
        </div>

        {isAdmin && onOpenNewEquipmentModal && (
          <button
            onClick={onOpenNewEquipmentModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Cadastrar Novo Equipamento
          </button>
        )}
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, número de patrimônio (PAT) ou local..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Quick Status Select */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">Todos os Status</option>
              <option value="available">Apenas Disponíveis</option>
              <option value="maintenance">Em Manutenção</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Functional Segmented Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      {filteredEquipments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">Nenhum equipamento encontrado</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Não encontramos nenhum recurso com os filtros selecionados. Tente ajustar a busca ou categoria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipments.map((eq) => {
            const isMaintenance = eq.status === 'manutencao';
            const isAvailable = !isMaintenance && eq.availableQuantity > 0;

            return (
              <div
                key={eq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Equipment Image */}
                <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img
                    src={eq.image}
                    alt={eq.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Status Indicator (Pairing Icon + Explicit Text) */}
                  <div className="absolute top-3 right-3">
                    {isMaintenance ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-rose-600 text-white shadow-xs">
                        <AlertTriangle className="w-3 h-3" />
                        Em Manutenção
                      </span>
                    ) : isAvailable ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-emerald-700 text-white shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        Disponível ({eq.availableQuantity}/{eq.totalQuantity})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-amber-600 text-white shadow-xs">
                        <Clock className="w-3 h-3" />
                        Em Uso
                      </span>
                    )}
                  </div>

                  {/* Patrimony Tag on photo */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {eq.patrimony}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                      {eq.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {eq.description}
                    </p>

                    {/* Location */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{eq.location}</span>
                    </div>

                    {/* Accessories Checklist */}
                    {eq.accessories && eq.accessories.length > 0 && (
                      <div className="mt-2 text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700">Acessórios inclusos: </span>
                        <span>{eq.accessories.join(', ')}</span>
                      </div>
                    )}

                    {/* Maintenance Alert Notes */}
                    {isMaintenance && eq.maintenanceNotes && (
                      <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-800">
                        <strong>Motivo:</strong> {eq.maintenanceNotes}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500">
                      <span>Total: <strong>{eq.totalQuantity} un.</strong></span>
                    </div>

                    <button
                      onClick={() => onSelectEquipmentToBook(eq.id)}
                      disabled={isMaintenance}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        isMaintenance
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{isMaintenance ? 'Indisponível' : 'Agendar'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
