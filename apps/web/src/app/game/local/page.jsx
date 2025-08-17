import { useState } from 'react';
import { Crown, Play } from 'lucide-react';
import HeroSelection from '@/components/HeroSelection';

export default function LocalGamePage() {
  const [gamePhase, setGamePhase] = useState('white_hero'); // white_hero, black_hero, playing
  const [whiteHero, setWhiteHero] = useState(null);
  const [blackHero, setBlackHero] = useState(null);

  const handleWhiteHeroSelect = (heroName) => {
    setWhiteHero(heroName);
  };

  const handleBlackHeroSelect = (heroName) => {
    setBlackHero(heroName);
  };

  const confirmWhiteHero = () => {
    if (whiteHero) {
      setGamePhase('black_hero');
    }
  };

  const confirmBlackHero = () => {
    if (blackHero) {
      setGamePhase('playing');
    }
  };

  const startGame = () => {
    // Redirect to the actual game board with selected heroes
    const params = new URLSearchParams({
      mode: 'local',
      whiteHero,
      blackHero
    });
    window.location.href = `/game/board?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-amber-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Local Game</h1>
          </div>
          <a href="/" className="text-amber-600 hover:text-amber-700 underline">
            ← Back to home
          </a>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${gamePhase === 'white_hero' ? 'text-blue-600' : gamePhase === 'black_hero' || gamePhase === 'playing' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${gamePhase === 'white_hero' ? 'border-blue-600 bg-blue-50' : gamePhase === 'black_hero' || gamePhase === 'playing' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                <span className="text-sm font-bold">1</span>
              </div>
              <span className="font-medium">White Hero</span>
            </div>
            
            <div className={`w-16 h-1 ${gamePhase === 'black_hero' || gamePhase === 'playing' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${gamePhase === 'black_hero' ? 'text-red-600' : gamePhase === 'playing' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${gamePhase === 'black_hero' ? 'border-red-600 bg-red-50' : gamePhase === 'playing' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                <span className="text-sm font-bold">2</span>
              </div>
              <span className="font-medium">Black Hero</span>
            </div>
            
            <div className={`w-16 h-1 ${gamePhase === 'playing' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${gamePhase === 'playing' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${gamePhase === 'playing' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                <Play className="w-4 h-4" />
              </div>
              <span className="font-medium">Play Game</span>
            </div>
          </div>
        </div>

        {/* Hero Selection for White Player */}
        {gamePhase === 'white_hero' && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <HeroSelection
              onHeroSelect={handleWhiteHeroSelect}
              selectedHero={whiteHero}
              playerColor="white"
            />
            
            {whiteHero && (
              <div className="text-center mt-8">
                <button
                  onClick={confirmWhiteHero}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Confirm White Hero
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hero Selection for Black Player */}
        {gamePhase === 'black_hero' && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <HeroSelection
              onHeroSelect={handleBlackHeroSelect}
              selectedHero={blackHero}
              playerColor="black"
              opponentHero={whiteHero}
            />
            
            {blackHero && (
              <div className="text-center mt-8">
                <button
                  onClick={confirmBlackHero}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Confirm Black Hero
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ready to Play */}
        {gamePhase === 'playing' && (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="mb-6">
              <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Ready to Battle!</h2>
              <p className="text-gray-600 mb-6">
                Both heroes have been selected. Time to begin the strategic chess battle!
              </p>
            </div>

            {/* Hero Summary */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-2">White Player</h3>
                <p className="text-blue-700">{whiteHero}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-2">Black Player</h3>
                <p className="text-red-700">{blackHero}</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-lg font-bold text-xl transition-colors"
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}