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
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg shadow-lg">
          <History className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">Histórico das Partidas</h2>
      </div>

      {rounds.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-slate-500">
          <History className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma partida foi jogada ainda</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rounds.map((round) => (
            <div key={round.id} className="border border-white/30 rounded-lg p-4 sm:p-6 bg-slate-50/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-1 sm:p-2 bg-white/90 rounded-lg shadow-sm backdrop-blur-sm">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                      Partida {round.roundNumber}
                      {round.isBlindRound && (
                        <span className="block sm:inline ml-0 sm:ml-2 mt-1 sm:mt-0 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">
                          <EyeOff className="w-3 h-3 inline mr-1" />
                          Às Cegas
                        </span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {round.cardsPerPlayer} carta{round.cardsPerPlayer !== 1 ? 's' : ''} por jogador
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {round.playerData.map((data) => {
                  const isCorrect = data.prediction === data.actual;
                  return (
                    <div key={data.playerId} className="bg-white/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm border border-white/20">
                            {getPlayerName(data.playerId).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 text-sm sm:text-base">
                            {getPlayerName(data.playerId)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-6 justify-between sm:justify-end">
                          <div className="text-center">
                            <div className="text-xs sm:text-sm text-slate-600 mb-1">Previu</div>
                            <div className="font-bold text-slate-800 text-sm sm:text-base">{data.prediction}</div>
                          </div>
                          
                          <div className="flex items-center">
                            {isCorrect ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                            )}
                          </div>
                          
                          <div className="text-center">
                            <div className="text-xs sm:text-sm text-slate-600 mb-1">Ganhou</div>
                            <div className="font-bold text-slate-800 text-sm sm:text-base">{data.actual}</div>
                          </div>
                          
                          <div className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-sm ${getScoreColor(data.score)}`}>
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