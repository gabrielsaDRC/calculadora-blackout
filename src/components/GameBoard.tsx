import React, { useState } from 'react';
import { Play, Eye, EyeOff, Target, CheckCircle } from 'lucide-react';
import { Player, PlayerRoundData } from '../types';

interface GameBoardProps {
  players: Player[];
  currentRound: number;
  onAddRound: (round: Omit<import('../types').GameRound, 'id'>) => void;
  isBlindRound: boolean;
}

export default function GameBoard({ players, currentRound, onAddRound, isBlindRound }: GameBoardProps) {
  const [step, setStep] = useState<'prediction' | 'results'>('prediction');
  const [predictions, setPredictions] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, number>>({});

  const handlePredictionChange = (playerId: string, value: number) => {
    setPredictions(prev => ({ ...prev, [playerId]: value }));
  };

  const handleResultChange = (playerId: string, value: number) => {
    setResults(prev => ({ ...prev, [playerId]: value }));
  };

  const canSubmitPredictions = players.every(player => 
    player.id in predictions && 
    predictions[player.id] >= 0 && 
    predictions[player.id] <= currentRound
  );

  const canSubmitResults = players.every(player => 
    player.id in results && 
    results[player.id] >= 0 && 
    results[player.id] <= currentRound
  );

  const submitRound = () => {
    const playerData: PlayerRoundData[] = players.map(player => {
      const prediction = predictions[player.id] || 0;
      const actual = results[player.id] || 0;
      
      let score = 0;
      if (prediction === actual) {
        score = prediction === 0 ? 5 : 10 * prediction;
      } else {
        score = -10;
      }

      return {
        playerId: player.id,
        prediction,
        actual,
        score
      };
    });

    onAddRound({
      roundNumber: currentRound,
      cardsPerPlayer: currentRound,
      playerData,
      isBlindRound
    });

    // Reset for next round
    setPredictions({});
    setResults({});
    setStep('prediction');
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg">
          <Play className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Partida {currentRound}
            {isBlindRound && (
              <span className="block sm:inline ml-0 sm:ml-3 mt-2 sm:mt-0 px-3 py-2 bg-yellow-100 text-yellow-800 text-sm sm:text-base rounded-full font-semibold">
                Às Cegas
              </span>
            )}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-1">{currentRound} carta{currentRound !== 1 ? 's' : ''} por jogador</p>
        </div>
      </div>

      {isBlindRound && step === 'prediction' && (
        <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-start gap-3">
            <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-800 mb-2 text-base sm:text-lg">Partida às Cegas</h3>
              <p className="text-yellow-700 text-sm sm:text-base">
                Faça suas previsões sem ver as cartas. O vira será revelado após todas as previsões.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 'prediction' ? (
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-slate-800">
            <Target className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
            Previsões
          </div>

          <div className="grid gap-6">
            {players.map((player) => (
              <div key={player.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-2 border-white/30 rounded-xl bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm hover:shadow-lg transition-all gap-4 sm:gap-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg border-2 border-white/20">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-800 text-lg sm:text-xl">{player.name}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="font-medium text-slate-600 text-base sm:text-lg">
                    Rodadas que vai ganhar:
                  </label>
                  <select
                    value={predictions[player.id] ?? ''}
                    onChange={(e) => handlePredictionChange(player.id, parseInt(e.target.value))}
                    className="px-4 sm:px-5 py-2 sm:py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base sm:text-lg font-semibold min-w-[120px] w-full sm:w-auto bg-white/90 backdrop-blur-sm"
                  >
                    <option value="">Selecione</option>
                    {Array.from({ length: currentRound + 1 }, (_, i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('results')}
            disabled={!canSubmitPredictions}
            className="w-full flex items-center justify-center gap-3 py-4 sm:py-5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
            Ir para Resultados
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-slate-800">
            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            Resultados
          </div>

          <div className="grid gap-6">
            {players.map((player) => (
              <div key={player.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-2 border-white/30 rounded-xl bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm hover:shadow-lg transition-all gap-4 sm:gap-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg border-2 border-white/20">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-lg sm:text-xl">{player.name}</span>
                    <p className="text-slate-600 text-sm sm:text-base">
                      Previu: <span className="font-bold">{predictions[player.id]}</span> rodada{predictions[player.id] !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="font-medium text-slate-600 text-base sm:text-lg">
                    Rodadas ganhas:
                  </label>
                  <select
                    value={results[player.id] ?? ''}
                    onChange={(e) => handleResultChange(player.id, parseInt(e.target.value))}
                    className="px-4 sm:px-5 py-2 sm:py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg font-semibold min-w-[120px] w-full sm:w-auto bg-white/90 backdrop-blur-sm"
                  >
                    <option value="">Selecione</option>
                    {Array.from({ length: currentRound + 1 }, (_, i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('prediction')}
              className="flex-1 py-3 sm:py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold text-base sm:text-lg"
            >
              Voltar
            </button>
            <button
              onClick={submitRound}
              disabled={!canSubmitResults}
              className="flex-1 py-3 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Finalizar Partida
            </button>
          </div>
        </div>
      )}
    </div>
  );
}