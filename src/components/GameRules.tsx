import React from 'react';
import { BookOpen, Target, Spade as Spades, Trophy, RotateCcw, Calculator } from 'lucide-react';

export default function GameRules() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Regras do Blackout 2.0</h1>
            <p className="text-slate-600 mt-1">Versão revisada completa</p>
          </div>
        </div>

        {/* Objetivo */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-800">🎯 Objetivo</h2>
          </div>
          <p className="text-slate-700 text-lg leading-relaxed">
            Acumular o maior número de pontos até o final das partidas, acertando o número exato de rodadas que você conseguirá vencer.
          </p>
        </section>

        {/* Baralho e Força das Cartas */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Spades className="w-6 h-6 text-slate-600" />
            <h2 className="text-2xl font-bold text-slate-800">🃏 Baralho e Força das Cartas</h2>
          </div>
          <div className="space-y-4">
            <p className="text-slate-700">Utiliza-se todo o baralho de 52 cartas (sem curingas).</p>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Força das cartas (da mais fraca para a mais forte):</h3>
              <div className="flex flex-wrap gap-2">
                {['4', '5', '6', '7', '8', '9', '10', 'Dama', 'Valete', 'Rei', 'Ás', '2', '3'].map((card, index) => (
                  <span key={card} className="px-3 py-1 bg-white rounded-md border border-slate-200 font-mono text-sm">
                    {card}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Força dos naipes (do mais fraco para o mais forte):</h3>
              <div className="flex flex-wrap gap-2">
                {['♦ Ouros', '♠ Espadas', '♥ Copas', '♣ Paus'].map((suit) => (
                  <span key={suit} className="px-3 py-1 bg-white rounded-md border border-slate-200 text-sm">
                    {suit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* O "Vira" e os Coringas */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">🃠 O "Vira" e os Coringas</h2>
          <div className="space-y-3 text-slate-700">
            <p>Em todas as partidas (menos na "às cegas"), vira-se uma carta no centro da mesa para determinar:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Naipe de trunfo</strong> (vence qualquer carta de outros naipes)</li>
              <li><strong>Carta coringa:</strong> é a carta imediatamente acima do vira na ordem de força</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800"><strong>Exemplo:</strong> se o vira for 4, o 5 é o coringa.</p>
            </div>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Coringas vencem todas as outras cartas</li>
              <li>Se dois coringas forem jogados, vence o de naipe mais forte</li>
            </ul>
          </div>
        </section>

        {/* Estrutura do Jogo */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <RotateCcw className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-slate-800">🔄 Estrutura do Jogo</h2>
          </div>
          <div className="space-y-3 text-slate-700">
            <ul className="list-disc list-inside space-y-2">
              <li>O jogo é dividido em partidas</li>
              <li>Na primeira partida, cada jogador recebe 1 carta → é a <strong>partida às cegas</strong></li>
              <li>Em cada nova partida, aumenta +1 carta por jogador</li>
              <li>Segue até atingir o máximo possível com o baralho</li>
            </ul>
          </div>
        </section>

        {/* Passo a Passo */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">📝 Passo a Passo de Cada Partida</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">1. Distribuição</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>O jogador da vez distribui as cartas da rodada</li>
                <li>Vira-se uma carta no centro para definir coringa e trunfo (na "às cegas" essa carta fica virada para baixo)</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">2. Declaração de Previsões</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>Cada jogador anuncia quantas rodadas acredita vencer (máximo = nº de cartas que recebeu)</li>
                <li>Na "às cegas", a previsão é feita sem ver as cartas</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">3. Revelação na "Às Cegas"</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>Depois que todos declararem, todas as cartas dos jogadores e o vira são revelados</li>
                <li>A partir daí, joga-se normalmente para definir quem venceu cada rodada</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">4. Jogando as Rodadas</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>O jogador à esquerda do distribuidor começa</li>
                <li>Seguir o naipe inicial se possível, senão pode jogar qualquer carta</li>
                <li>Trunfo vence qualquer outro naipe</li>
                <li>Quem vence a rodada inicia a próxima</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pontuação */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-800">📊 Pontuação</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Acertou a previsão</h3>
              <p className="text-green-700"><strong>+10 pontos</strong> por rodada prevista</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Previu 0 e acertou</h3>
              <p className="text-yellow-700"><strong>+5 pontos</strong></p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Errou a previsão</h3>
              <p className="text-red-700"><strong>–10 pontos</strong></p>
            </div>
          </div>
        </section>

        {/* Fim do Jogo */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-slate-800">🏆 Fim do Jogo</h2>
          </div>
          <div className="space-y-3 text-slate-700">
            <ul className="list-disc list-inside space-y-2">
              <li>Termina quando não é mais possível aumentar o número de cartas distribuídas</li>
              <li>O vencedor é quem tiver mais pontos</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}