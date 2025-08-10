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
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-xl">
          <Play className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Partida {currentRound}
            {isBlindRound && (
              <span className="ml-3 px-3 py-2 bg-yellow-100 text-yellow-800 text-base rounded-full font-semibold">
                Às Cegas
              </span>
            )}
          </h2>
          <p className="text-slate-600 text-lg mt-1">{currentRound} carta{currentRound !== 1 ? 's' : ''} por jogador</p>
        </div>
      </div>

      {isBlindRound && step === 'prediction' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <EyeOff className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-800 mb-2 text-lg">Partida às Cegas</h3>
              <p className="text-yellow-700">
                Faça suas previsões sem ver as cartas. O vira será revelado após todas as previsões.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 'prediction' ? (
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <Target className="w-7 h-7 text-green-600" />
            Previsões
          </div>

          <div className="grid gap-6">
            {players.map((player) => (
              <div key={player.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-2 border-slate-200 rounded-xl bg-gradient-to-r from-white to-slate-50 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-800 text-xl">{player.name}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 sm:mt-0">
                  <label className="font-medium text-slate-600 text-lg">
                    Rodadas que vai ganhar:
                  </label>
                  <select
                    value={predictions[player.id] ?? ''}
                    onChange={(e) => handlePredictionChange(player.id, parseInt(e.target.value))}
                    className="px-5 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold min-w-[120px]"
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
            className="w-full flex items-center justify-center gap-3 py-5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Eye className="w-6 h-6" />
            Ir para Resultados
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-2xl font-bold text-slate-800">
            <CheckCircle className="w-7 h-7 text-blue-600" />
            Resultados
          </div>

          <div className="grid gap-6">
            {players.map((player) => (
              <div key={player.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-2 border-slate-200 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xl">{player.name}</span>
                    <p className="text-slate-600 text-base">
                      Previu: <span className="font-bold">{predictions[player.id]}</span> rodada{predictions[player.id] !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 sm:mt-0">
                  <label className="font-medium text-slate-600 text-lg">
                    Rodadas ganhas:
                  </label>
                  <select
                    value={results[player.id] ?? ''}
                    onChange={(e) => handleResultChange(player.id, parseInt(e.target.value))}
                    className="px-5 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold min-w-[120px]"
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
              className="flex-1 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold text-lg"
            >
              Voltar
            </button>
            <button
              onClick={submitRound}
              disabled={!canSubmitResults}
              className="flex-1 py-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Finalizar Partida
            </button>
          </div>
        </div>
      )}
    </div>
  );
}