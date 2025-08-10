import React, { useState, useEffect } from 'react';
import { Users, Plus, Trophy, RotateCcw, Target, Award, BookOpen, AlertTriangle } from 'lucide-react';
import PlayerManager from './components/PlayerManager';
import GameBoard from './components/GameBoard';
import ScoreTable from './components/ScoreTable';
import GameHistory from './components/GameHistory';
import GameRules from './components/GameRules';
import { Player, GameRound, GameData } from './types';

function App() {
  const [gameData, setGameData] = useState<GameData>(() => {
    const saved = localStorage.getItem('blackout-game');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      players: [],
      rounds: [],
      currentRound: 1,
      maxRounds: 13
    };
  });

  const [activeTab, setActiveTab] = useState<'game' | 'history' | 'rules'>('game');
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('blackout-game', JSON.stringify(gameData));
  }, [gameData]);

  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      totalScore: 0
    };
    setGameData(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  };

  const removePlayer = (id: string) => {
    setGameData(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  };

  const updatePlayerName = (id: string, name: string) => {
    setGameData(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === id ? { ...p, name } : p)
    }));
  };

  const addRound = (round: Omit<GameRound, 'id'>) => {
    const newRound: GameRound = {
      ...round,
      id: Date.now().toString()
    };

    // Calculate scores for each player
    const updatedPlayers = gameData.players.map(player => {
      const playerData = round.playerData.find(pd => pd.playerId === player.id);
      if (!playerData) return player;

      let roundScore = 0;
      if (playerData.prediction === playerData.actual) {
        if (playerData.prediction === 0) {
          roundScore = 5; // Special case for predicting 0 correctly
        } else {
          roundScore = 10 * playerData.prediction; // 10 points per predicted round
        }
      } else {
        roundScore = -10; // -10 for wrong prediction
      }

      return {
        ...player,
        totalScore: player.totalScore + roundScore
      };
    });

    setGameData(prev => ({
      ...prev,
      players: updatedPlayers,
      rounds: [...prev.rounds, newRound],
      currentRound: prev.currentRound + 1
    }));
  };

  const resetGame = () => {
    setGameData({
      players: [],
      rounds: [],
      currentRound: 1,
      maxRounds: 13
    });
    setActiveTab('game');
    setShowResetModal(false);
  };

  const confirmResetGame = () => {
    setShowResetModal(true);
  };

  const cancelResetGame = () => {
    setShowResetModal(false);
  };

  const canStartRound = gameData.players.length >= 2 && gameData.currentRound <= gameData.maxRounds;
  const gameFinished = gameData.currentRound > gameData.maxRounds;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Card Suit Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-red-500/10 text-6xl transform rotate-12">♠</div>
        <div className="absolute top-32 right-16 text-red-600/10 text-8xl transform -rotate-12">♥</div>
        <div className="absolute top-64 left-20 text-slate-400/10 text-7xl transform rotate-45">♣</div>
        <div className="absolute bottom-32 right-12 text-red-500/10 text-9xl transform -rotate-45">♦</div>
        <div className="absolute bottom-16 left-16 text-slate-400/10 text-6xl transform rotate-12">♠</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-500/5 text-[20rem] -rotate-12">♥</div>
        
        {/* Mobile decorations */}
        <div className="md:hidden">
          <div className="absolute top-20 right-4 text-red-600/10 text-4xl transform rotate-12">♠</div>
          <div className="absolute bottom-40 left-4 text-slate-400/10 text-5xl transform -rotate-12">♣</div>
          <div className="absolute top-1/3 right-8 text-red-500/10 text-3xl transform rotate-45">♦</div>
        </div>
      </div>

      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-slate-800">Blackout 2.0 Scorer</h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">Sistema de pontuação para o jogo Blackout 2.0</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-4">
              {gameData.players.length > 0 && (
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-slate-600">Partida Atual</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    {gameFinished ? 'Finalizado' : `${gameData.currentRound}/${gameData.maxRounds}`}
                  </p>
                </div>
              )}
              
              <button
                onClick={confirmResetGame}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                title="Resetar Jogo"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 relative z-10">
        {gameData.players.length === 0 ? (
          <div className="text-center py-8 md:py-16 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">Bem-vindo ao Blackout 2.0!</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
              Para começar, adicione pelo menos 2 jogadores ao jogo.
            </p>
            <PlayerManager
              players={gameData.players}
              onAddPlayer={addPlayer}
              onRemovePlayer={removePlayer}
              onUpdatePlayerName={updatePlayerName}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="flex justify-center px-4">
              <div className="flex flex-col sm:flex-row bg-white/95 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('game')}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'game'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Target className="w-5 h-5" />
                  Jogo
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'history'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-5 h-5" />
                  Histórico
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'rules'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  Regras
                </button>
              </div>
            </div>

            {activeTab === 'game' ? (
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <PlayerManager
                    players={gameData.players}
                    onAddPlayer={addPlayer}
                    onRemovePlayer={removePlayer}
                    onUpdatePlayerName={updatePlayerName}
                  />
                  
                  {canStartRound && (
                    <GameBoard
                      players={gameData.players}
                      currentRound={gameData.currentRound}
                      onAddRound={addRound}
                      isBlindRound={gameData.currentRound === 1}
                    />
                  )}
                  
                  {gameFinished && (
                    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white text-center shadow-xl border border-green-500/20">
                      <Trophy className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Jogo Finalizado!</h3>
                      <p className="text-green-100">
                        Parabéns, {gameData.players.sort((a, b) => b.totalScore - a.totalScore)[0]?.name}! 🎉
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-1">
                  <ScoreTable players={gameData.players} />
                </div>
              </div>
            ) : (
              activeTab === 'history' ? (
                <GameHistory 
                  rounds={gameData.rounds}
                  players={gameData.players}
                />
              ) : (
                <GameRules />
              )
            )}
          </div>
        )}
      </main>

      {/* Modal de Confirmação de Reset */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Confirmar Reset</h3>
            </div>
            
            <p className="text-slate-600 mb-4 text-base">
              Tem certeza que deseja resetar o jogo completamente?
            </p>
            
            <div className="text-sm text-slate-500 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <strong>Atenção:</strong> Esta ação irá remover todos os jogadores, partidas e pontuações. 
              Todos os dados serão perdidos permanentemente e não podem ser recuperados.
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelResetGame}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={resetGame}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg"
              >
                Resetar Jogo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;