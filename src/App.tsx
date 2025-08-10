import React, { useState, useEffect } from 'react';
import { Users, Plus, Trophy, RotateCcw, Target, Award, BookOpen } from 'lucide-react';
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
    if (confirm('Tem certeza que deseja resetar o jogo? Todos os dados serão perdidos.')) {
      setGameData({
        players: [],
        rounds: [],
        currentRound: 1,
        maxRounds: 13
      });
      setActiveTab('game');
    }
  };

  const canStartRound = gameData.players.length >= 2 && gameData.currentRound <= gameData.maxRounds;
  const gameFinished = gameData.currentRound > gameData.maxRounds;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-600 rounded-xl shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Blackout 2.0 Scorer</h1>
                <p className="text-slate-600 mt-1">Sistema de pontuação para o jogo Blackout 2.0</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {gameData.players.length > 0 && (
                <div className="text-right">
                  <p className="text-sm text-slate-600">Partida Atual</p>
                  <p className="text-2xl font-bold text-green-600">
                    {gameFinished ? 'Finalizado' : `${gameData.currentRound}/${gameData.maxRounds}`}
                  </p>
                </div>
              )}
              
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Resetar Jogo"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {gameData.players.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Users className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Bem-vindo ao Blackout 2.0!</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
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
            <div className="flex justify-center">
              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                <button
                  onClick={() => setActiveTab('game')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'game'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Target className="w-5 h-5" />
                  Jogo
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'history'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-5 h-5" />
                  Histórico
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'rules'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  Regras
                </button>
              </div>
            </div>

            {activeTab === 'game' ? (
              <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8">
                <div className="xl:col-span-2 lg:col-span-1 space-y-6">
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
                    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white text-center shadow-lg">
                      <Trophy className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Jogo Finalizado!</h3>
                      <p className="text-green-100">
                        Parabéns, {gameData.players.sort((a, b) => b.totalScore - a.totalScore)[0]?.name}! 🎉
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="xl:col-span-1 lg:col-span-1">
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
    </div>
  );
}

export default App;