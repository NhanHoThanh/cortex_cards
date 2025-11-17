import { Deck, Screen } from '../App';
import { Plus, Upload, BarChart3, Settings, BookOpen, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

type HomeProps = {
  decks: Deck[];
  onNavigate: (screen: Screen) => void;
  theme: 'light' | 'dark';
};

export function Home({ decks, onNavigate, theme }: HomeProps) {
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const totalStudyTime = decks.reduce((sum, deck) => sum + deck.totalStudyTime, 0);
  const dueCards = decks.reduce((sum, deck) => {
    const due = deck.cards.filter(card => 
      !card.nextReview || card.nextReview <= new Date()
    ).length;
    return sum + due;
  }, 0);

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">Cortex Cards</h1>
            <p className="text-blue-100 dark:text-blue-200">Smart study, better results</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => onNavigate({ type: 'settings' })}
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-5 w-5 mx-auto mb-2 text-white" />
              <div className="text-2xl text-white">{totalCards}</div>
              <div className="text-xs text-blue-100">Total Cards</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4 text-center">
              <Clock className="h-5 w-5 mx-auto mb-2 text-white" />
              <div className="text-2xl text-white">{formatStudyTime(totalStudyTime)}</div>
              <div className="text-xs text-blue-100">Study Time</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-2 text-white" />
              <div className="text-2xl text-white">{dueCards}</div>
              <div className="text-xs text-blue-100">Due Today</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 -mt-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => onNavigate({ type: 'upload' })}
            className="h-24 flex flex-col gap-2 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
          >
            <Sparkles className="h-6 w-6" />
            <span>AI Generate</span>
          </Button>
          <Button 
            onClick={() => onNavigate({ type: 'create-deck' })}
            className="h-24 flex flex-col gap-2 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
          >
            <Plus className="h-6 w-6" />
            <span>Create Deck</span>
          </Button>
        </div>
      </div>

      {/* Decks List */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl dark:text-white">My Decks</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate({ type: 'statistics' })}
            className="dark:text-white"
          >
            <BarChart3 className="h-5 w-5 mr-1" />
            Stats
          </Button>
        </div>

        <div className="space-y-3">
          {decks.map(deck => {
            const dueCount = deck.cards.filter(card => 
              !card.nextReview || card.nextReview <= new Date()
            ).length;
            const masteredCount = deck.cards.filter(card => 
              card.repetitions >= 5 && card.correctCount > card.incorrectCount * 3
            ).length;
            const accuracy = deck.cards.reduce((sum, card) => {
              const total = card.correctCount + card.incorrectCount;
              return sum + (total > 0 ? card.correctCount / total : 0);
            }, 0) / (deck.cards.length || 1) * 100;

            return (
              <Card 
                key={deck.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700"
                onClick={() => onNavigate({ type: 'deck', deckId: deck.id })}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className={`w-16 h-16 rounded-xl ${deck.color} flex items-center justify-center text-white text-2xl flex-shrink-0`}>
                      {deck.isAIGenerated && <Sparkles className="h-8 w-8" />}
                      {!deck.isAIGenerated && <BookOpen className="h-8 w-8" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="truncate dark:text-white">{deck.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{deck.subject}</p>
                        </div>
                        {dueCount > 0 && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs whitespace-nowrap">
                            {dueCount} due
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{deck.cards.length} cards</span>
                        <span>•</span>
                        <span>{masteredCount} mastered</span>
                        <span>•</span>
                        <span>{Math.round(accuracy)}% accuracy</span>
                      </div>
                      {deck.lastStudied && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Last studied {new Date(deck.lastStudied).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {decks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg mb-2 text-gray-600 dark:text-gray-400">No decks yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Create your first deck or generate one with AI
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
