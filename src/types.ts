export interface Player {
  id: string;
  name: string;
  totalScore: number;
}

export interface PlayerRoundData {
  playerId: string;
  prediction: number;
  actual: number;
  score: number;
}

export interface GameRound {
  id: string;
  roundNumber: number;
  cardsPerPlayer: number;
  playerData: PlayerRoundData[];
  isBlindRound: boolean;
}

export interface GameData {
  players: Player[];
  rounds: GameRound[];
  currentRound: number;
  maxRounds: number;
}