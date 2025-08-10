import React from 'react';
import { History, Target, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { GameRound, Player } from '../types';

interface GameHistoryProps {
  rounds: GameRound[];
  players: Player[];
}

export default function GameHistory({ rounds, players }: GameHistoryProps) {
  const getPlayerName = (playerId: string) => {
    return players.find(p => p.id === playerId)?.name || 'Jogador Removido';
  };

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-600 bg-green-50';
    if (score < 0) return 'text-red-600 bg-red-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <History className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Histórico das Partidas</h2>
      </div>

      {rounds.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma partida foi jogada ainda</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rounds.map((round) => (
            <div key={round.id} className="border border-slate-200 rounded-lg p-6 bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Partida {round.roundNumber}
                      {round.isBlindRound && (
                        <span className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">
                          <EyeOff className="w-3 h-3 inline mr-1" />
                          Às Cegas
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {round.cardsPerPlayer} carta{round.cardsPerPlayer !== 1 ? 's' : ''} por jogador
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {round.playerData.map((data) => {
                  const isCorrect = data.prediction === data.actual;
                  return (
                    <div key={data.playerId} className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {getPlayerName(data.playerId).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800">
                            {getPlayerName(data.playerId)}
                          </span>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-slate-600 mb-1">Previu</div>
                            <div className="font-bold text-slate-800">{data.prediction}</div>
                          </div>
                          
                          <div className="flex items-center">
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          
                          <div className="text-center">
                            <div className="text-sm text-slate-600 mb-1">Ganhou</div>
                            <div className="font-bold text-slate-800">{data.actual}</div>
                          </div>
                          
                          <div className={`px-3 py-2 rounded-lg font-bold text-sm ${getScoreColor(data.score)}`}>
                            {data.score > 0 ? '+' : ''}{data.score}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}