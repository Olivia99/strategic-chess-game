import { useState, useEffect } from 'react';
import { Crown, Sword, Shield, Star, Zap } from 'lucide-react';

const heroIcons = {
  'Alexander the Great': Crown,
  'Genghis Khan': Sword,
  'Napoleon Bonaparte': Star,
  'George Washington': Shield,
  'Anne Bonny': Sword,
  'Che Guevara': Zap
};

const heroColors = {
  'Alexander the Great': 'from-purple-500 to-purple-700',
  'Genghis Khan': 'from-red-500 to-red-700',
  'Napoleon Bonaparte': 'from-blue-500 to-blue-700',
  'George Washington': 'from-green-500 to-green-700',
  'Anne Bonny': 'from-orange-500 to-orange-700',
  'Che Guevara': 'from-gray-500 to-gray-700'
};

export default function HeroSelection({ 
  onHeroSelect, 
  selectedHero, 
  playerColor, 
  opponentHero = null,
  disabled = false 
}) {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const response = await fetch('/api/heroes');
      if (!response.ok) {
        throw new Error('Failed to fetch heroes');
      }
      const data = await response.json();
      setHeroes(data.heroes);
    } catch (err) {
      console.error('Error fetching heroes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading heroes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchHeroes}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Choose Your Hero
        </h2>
        <p className="text-gray-600">
          Playing as <span className={`font-semibold ${playerColor === 'white' ? 'text-blue-600' : 'text-red-600'}`}>
            {playerColor === 'white' ? 'White' : 'Black'}
          </span>
        </p>
        {opponentHero && (
          <p className="text-sm text-gray-500 mt-1">
            Opponent selected: <span className="font-medium">{opponentHero}</span>
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {heroes.map((hero) => {
          const IconComponent = heroIcons[hero.name] || Crown;
          const isSelected = selectedHero === hero.name;
          const isOpponentChoice = opponentHero === hero.name;
          const isDisabled = disabled || isOpponentChoice;
          
          return (
            <button
              key={hero.id}
              onClick={() => !isDisabled && onHeroSelect(hero.name)}
              disabled={isDisabled}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300 text-left
                ${isSelected 
                  ? 'border-amber-500 bg-amber-50 shadow-lg scale-105' 
                  : isOpponentChoice
                    ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-md hover:scale-102'
                }
                ${isDisabled && !isOpponentChoice ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {/* Hero Icon */}
              <div className={`
                w-12 h-12 rounded-lg bg-gradient-to-br ${heroColors[hero.name]} 
                flex items-center justify-center mb-3
              `}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              {/* Hero Info */}
              <div className="mb-3">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">
                  {hero.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {hero.title}
                </p>
              </div>

              {/* Starting Trophies */}
              {hero.starting_trophies > 0 && (
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700">
                    Starts with {hero.starting_trophies} trophies
                  </span>
                </div>
              )}

              {/* Abilities Preview */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Passive:</p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {hero.passive_ability}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Active:</p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {hero.active_ability}
                  </p>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
              )}

              {/* Opponent Choice Indicator */}
              {isOpponentChoice && (
                <div className="absolute top-2 right-2 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Hero Details */}
      {selectedHero && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Crown className="w-5 h-5 text-amber-600 mr-2" />
            <h3 className="font-bold text-amber-800">Selected: {selectedHero}</h3>
          </div>
          {heroes.find(h => h.name === selectedHero) && (
            <p className="text-amber-700 text-sm">
              {heroes.find(h => h.name === selectedHero).description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}