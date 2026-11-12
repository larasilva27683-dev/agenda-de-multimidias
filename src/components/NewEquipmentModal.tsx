import React, { useState, useEffect } from 'react';
import { Equipment, EquipmentCategory, EquipmentStatus } from '../types';
import { storageService } from '../services/storageService';
import { X, Layers, PlusCircle, CheckCircle2 } from 'lucide-react';

interface NewEquipmentModalProps {
  equipmentToEdit?: Equipment | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_IMAGES = [
  { label: 'Projetor Datashow Moderno', path: '/src/assets/images/hero_datashow_projector_1793021773290.jpg' },
  { label: 'Smart TV c/ Suporte Móvel', path: '/src/assets/images/equipment_smart_tv_cart_1793021775488.jpg' },
  { label: 'Carrinho de Chromebooks', path: '/src/assets/images/equipment_chromebook_cart_1793021774301.jpg' },
  { label: 'Caixa de Som & Microfones', path: '/src/assets/images/equipment_sound_microphone_1793021774987.jpg' },
];

export const NewEquipmentModal: React.FC<NewEquipmentModalProps> = ({
  equipmentToEdit,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState(equipmentToEdit?.name || '');
  const [patrimony, setPatrimony] = useState(equipmentToEdit?.patrimony || `PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState<EquipmentCategory>(equipmentToEdit?.category || 'datashow');
  const [totalQuantity, setTotalQuantity] = useState(equipmentToEdit?.totalQuantity || 1);
  const [location, setLocation] = useState(equipmentToEdit?.location || 'Sala do NTE — Armário Central');
  const [accessoriesStr, setAccessoriesStr] = useState(equipmentToEdit?.accessories.join(', ') || 'Cabo de Força, Cabo HDMI');
  const [image, setImage] = useState(equipmentToEdit?.image || DEFAULT_IMAGES[0].path);
  const [description, setDescription] = useState(equipmentToEdit?.description || '');
  const [status, setStatus] = useState<EquipmentStatus>(equipmentToEdit?.status || 'disponivel');
  const [maintenanceNotes, setMaintenanceNotes] = useState(equipmentToEdit?.maintenanceNotes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const accessories = accessoriesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (equipmentToEdit) {
      storageService.updateEquipment({
        ...equipmentToEdit,
        name,
        patrimony,
        category,
        totalQuantity: Number(totalQuantity),
        availableQuantity: status === 'manutencao' ? 0 : Number(totalQuantity),
        location,
        accessories,
        image,
        description,
        status,
        maintenanceNotes: status === 'manutencao' ? maintenanceNotes : undefined,
      });
    } else {
      storageService.addEquipment({
        name,
        patrimony,
        category,
        totalQuantity: Number(totalQuantity),
        availableQuantity: status === 'manutencao' ? 0 : Number(totalQuantity),
        location,
        accessories,
        image,
        description,
        status,
        maintenanceNotes: status === 'manutencao' ? maintenanceNotes : undefined,
      });
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {equipmentToEdit ? 'Editar Equipamento Multimídia' : 'Cadastrar Novo Equipamento'}
            </h2>
            <p className="text-xs text-slate-500">
              Gerencie identificação patrimonial, estoque e localização física.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nome do Equipamento *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Projetor Epson PowerLite X49"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Número de Patrimônio (Tombamento) *
              </label>
              <input
                type="text"
                required
                value={patrimony}
                onChange={(e) => setPatrimony(e.target.value)}
                placeholder="Ex: PAT-2026-0812"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EquipmentCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="datashow">Datashow / Projetor</option>
                <option value="tv">Televisor / Smart TV</option>
                <option value="chromebook">Chromebook / Notebook</option>
                <option value="audio">Caixa de Som & Microfones</option>
                <option value="cables">Cabos & Adaptadores</option>
                <option value="others">Outros Recursos</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Quantidade Total *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Operacional
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EquipmentStatus)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="disponivel">Disponível</option>
                <option value="manutencao">Em Manutenção</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Localização Padrão / Armazenamento *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Sala do NTE — Armário A (Prateleira 1)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Acessórios Inclusos (separados por vírgula)
            </label>
            <input
              type="text"
              value={accessoriesStr}
              onChange={(e) => setAccessoriesStr(e.target.value)}
              placeholder="Ex: Cabo de Força, Controle Remoto, Cabo HDMI 3m, Case"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Imagem do Equipamento
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {DEFAULT_IMAGES.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setImage(img.path)}
                  className={`p-1 rounded-lg border text-left transition-all overflow-hidden ${
                    image === img.path ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img.path} alt="" className="w-full h-14 object-cover rounded" />
                  <span className="text-[10px] text-slate-600 block truncate mt-1">{img.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Descrição Detalhada & Especificações
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Projetor de 3600 ANSI Lúmens com entrada HDMI e VGA para uso em salas de aula..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>

          {status === 'manutencao' && (
            <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
              <label className="block font-semibold text-rose-800 mb-1">
                Motivo / Laudo da Manutenção
              </label>
              <input
                type="text"
                value={maintenanceNotes}
                onChange={(e) => setMaintenanceNotes(e.target.value)}
                placeholder="Ex: Troca de lâmpada / reparo no conector HDMI"
                className="w-full px-3 py-1.5 rounded border border-rose-300 text-rose-900 bg-white"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
            >
              {equipmentToEdit ? 'Salvar Alterações' : 'Cadastrar Equipamento'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
