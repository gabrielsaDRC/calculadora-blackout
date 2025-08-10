import React, { useState } from 'react';
import { Plus, Users, X, Edit3, Check, AlertTriangle } from 'lucide-react';
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
  const [playerToRemove, setPlayerToRemove] = useState<Player | null>(null);

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

  const confirmRemovePlayer = (player: Player) => {
    setPlayerToRemove(player);
  };

  const handleRemovePlayer = () => {
    if (playerToRemove) {
      onRemovePlayer(playerToRemove.id);
      setPlayerToRemove(null);
    }
  };

  const cancelRemovePlayer = () => {
    setPlayerToRemove(null);
  };

  return (
    <div className="relative bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg">
          <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Jogadores</h2>
      </div>

      <form onSubmit={handleAddPlayer} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nome do jogador"
            className="flex-1 px-4 sm:px-5 py-3 sm:py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-base sm:text-lg bg-white/90 backdrop-blur-sm"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
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
            <div key={player.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm rounded-xl border border-white/30 hover:shadow-lg transition-all gap-3 sm:gap-0">
              {editingId === player.id ? (
                <div className="flex items-center gap-2 flex-1 w-full">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base sm:text-lg bg-white/90 backdrop-blur-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button
                    onClick={saveEdit}
                    className="p-2 sm:p-3 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    title="Salvar"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-2 sm:p-3 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg border-2 border-white/20">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-base sm:text-lg">{player.name}</span>
                      <p className="text-xs sm:text-sm text-slate-500">{player.totalScore} pontos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditing(player)}
                      className="p-2 sm:p-3 text-slate-600 hover:bg-white/60 rounded-lg transition-colors"
                      title="Editar nome"
                    >
                      <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => confirmRemovePlayer(player)}
                      className="p-2 sm:p-3 text-red-600 hover:bg-red-100/60 rounded-lg transition-colors"
                      title="Remover jogador"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Confirmação */}
      {playerToRemove && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Confirmar Remoção</h3>
            </div>
            
            <p className="text-slate-600 mb-6 text-base">
              Tem certeza que deseja remover o jogador{' '}
              <span className="font-bold text-slate-800">"{playerToRemove.name}"</span>?
            </p>
            
            <div className="text-sm text-slate-500 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <strong>Atenção:</strong> Esta ação não pode ser desfeita. O jogador será removido permanentemente do jogo atual.
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelRemovePlayer}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleRemovePlayer}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}