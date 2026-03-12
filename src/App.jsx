/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import gamesData from './games.json';
import { Gamepad2, Search, X, Maximize2, ArrowLeft, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const games = gamesData;

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const filteredGames = useMemo(() => {
    return games.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePlayer = () => {
    setSelectedGame(null);
    setIsFullScreen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between shadow-sm">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setSelectedGame(null)}
        >
          <div className="bg-black p-2 rounded-lg">
            <Gamepad2 className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">Unblocked Hub</h1>
        </div>

        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-black/5 transition-all outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-gray-400 hidden sm:block">
            {games.length} Games Available
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={closePlayer}
                  className="flex items-center gap-2 text-sm font-medium hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Catalog
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={closePlayer}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${isFullScreen ? 'fixed inset-0 z-[100] rounded-none' : 'aspect-video w-full'}`}>
                {isFullScreen && (
                  <button 
                    onClick={() => setIsFullScreen(false)}
                    className="absolute top-6 right-6 z-[110] bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  allow="fullscreen; autoplay; encrypted-media"
                  title={selectedGame.title}
                />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">{selectedGame.title}</h2>
                <p className="text-gray-500 max-w-2xl">{selectedGame.description}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Mobile Search */}
              <div className="relative w-full mb-8 md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-black/5 shadow-sm outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    layoutId={game.id}
                    whileHover={{ y: -8 }}
                    className="group bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => handleGameSelect(game)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white p-4 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <Play className="w-6 h-6 fill-black" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{game.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No games found</h3>
                  <p className="text-gray-500">Try searching for something else.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-black/5 py-12 px-6 text-center">
        <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">
          Unblocked Hub &copy; 2026 • Play Responsibly
        </p>
      </footer>
    </div>
  );
}
