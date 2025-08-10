import React from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Player } from '../types';

interface ScoreTableProps {
  players: Player[];
}

export default function ScoreTable({ players }: ScoreTableProps) {
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-slate-600">{position}</span>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-100 rounded-xl">
          <TrendingUp className="w-7 h-7 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Placar</h2>
      </div>

      {players.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-lg">
          Nenhum jogador adicionado ainda
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPlayers.map((player, index) => {
            const position = index + 1;
            const isWinning = position === 1 && player.totalScore > 0;
            
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all ${getRankColor(position)} ${
                  isWinning ? 'ring-4 ring-yellow-200 ring-opacity-50 shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    {getRankIcon(position)}
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-slate-800 text-2xl">{player.name}</h3>
                    <p className="text-slate-600 text-base">
                      {position}º lugar
                      {isWinning && <span className="text-yellow-600 font-bold ml-2 text-lg">👑 Líder</span>}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-4xl font-bold ${
                    player.totalScore > 0 
                      ? 'text-green-600' 
                      : player.totalScore < 0 
                      ? 'text-red-600' 
                      : 'text-slate-600'
                  }`}>
                    {player.totalScore > 0 ? '+' : ''}{player.totalScore}
                  </div>
                  <div className="text-base text-slate-500 font-medium">pontos</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {players.length > 0 && (
        <div className="mt-8 pt-8 border-t-2 border-slate-200">
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {Math.max(...players.map(p => p.totalScore))}
              </div>
              <div className="text-base text-slate-600 font-medium">Maior Pontuação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-600">
                {Math.round(players.reduce((sum, p) => sum + p.totalScore, 0) / players.length)}
              </div>
              <div className="text-base text-slate-600 font-medium">Pontuação Média</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}