import React, { useState } from 'react';
import { Plus, Users, X, Edit3, Check } from 'lucide-react';
import { Player } from '../types';

interface PlayerManagerProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: string) => void;
  onUpdatePlayerName: (id: string, name: string) => void;
}

export default function PlayerManager({ players, onAddPlayer, onRemovePlayer, onUpdatePlayerName }: PlayerManagerProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setEditingName(player.name);
  };

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdatePlayerName(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Users className="w-7 h-7 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Jogadores</h2>
      </div>

      <form onSubmit={handleAddPlayer} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nome do jogador"
            className="flex-1 px-5 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-6 h-6" />
            Adicionar
          </button>
        </div>
      </form>

      {players.length > 0 && (
        <div className="space-y-3">
          <p className="text-base font-medium text-slate-600 mb-4">
            {players.length} jogador{players.length !== 1 ? 'es' : ''} adicionado{players.length !== 1 ? 's' : ''}
          </p>
          
          {players.map((player) => (
            <div key={player.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all">
              {editingId === player.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button
                    onClick={saveEdit}
                    className="p-3 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    title="Salvar"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-3 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Cancelar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-lg">{player.name}</span>
                      <p className="text-sm text-slate-500">{player.totalScore} pontos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditing(player)}
                      className="p-3 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Editar nome"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onRemovePlayer(player.id)}
                      className="p-3 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Remover jogador"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}