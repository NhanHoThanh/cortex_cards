import { Deck } from '../App';
import { ArrowLeft, TrendingUp, Clock, Target, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

type StatisticsProps = {
  decks: Deck[];
  onBack: () => void;
  theme: 'light' | 'dark';
};

export function Statistics({ decks, onBack, theme }: StatisticsProps) {
  // Calculate overall statistics
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const totalStudyTime = decks.reduce((sum, deck) => sum + deck.totalStudyTime, 0);
  
  const allCards = decks.flatMap(deck => deck.cards);
  const totalCorrect = allCards.reduce((sum, card) => sum + card.correctCount, 0);
  const totalIncorrect = allCards.reduce((sum, card) => sum + card.incorrectCount, 0);
  const totalReviews = totalCorrect + totalIncorrect;
  const overallAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  const masteredCards = allCards.filter(card => 
    card.repetitions >= 5 && card.correctCount > card.incorrectCount * 3
  ).length;

  const dueCards = allCards.filter(card => 
    !card.nextReview || card.nextReview <= new Date()
  ).length;

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Subject performance
  const subjectStats = decks.reduce((acc, deck) => {
    const deckCorrect = deck.cards.reduce((sum, card) => sum + card.correctCount, 0);
    const deckIncorrect = deck.cards.reduce((sum, card) => sum + card.incorrectCount, 0);
    const deckTotal = deckCorrect + deckIncorrect;
    const accuracy = deckTotal > 0 ? Math.round((deckCorrect / deckTotal) * 100) : 0;

    if (!acc[deck.subject]) {
      acc[deck.subject] = {
        cards: 0,
        accuracy: 0,
        reviews: 0,
        count: 0,
      };
    }

    acc[deck.subject].cards += deck.cards.length;
    acc[deck.subject].accuracy += accuracy;
    acc[deck.subject].reviews += deckTotal;
    acc[deck.subject].count += 1;

    return acc;
  }, {} as Record<string, { cards: number; accuracy: number; reviews: number; count: number }>);

  const subjectStatsArray = Object.entries(subjectStats).map(([subject, stats]) => ({
    subject,
    cards: stats.cards,
    accuracy: Math.round(stats.accuracy / stats.count),
    reviews: stats.reviews,
  })).sort((a, b) => b.reviews - a.reviews);

  // Study streak (mock data)
  const studyStreak = 7;
  const weeklyGoal = 5;
  const studyDaysThisWeek = 4;

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white px-6 pt-12 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl mb-2">Your Statistics</h1>
        <p className="text-white/80 text-sm">Track your progress and achievements</p>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 space-y-4">
        {/* Overall Stats */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <div className="text-2xl text-blue-600 dark:text-blue-400">{totalCards}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Cards</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <Award className="h-6 w-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                <div className="text-2xl text-green-600 dark:text-green-400">{masteredCards}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Mastered</div>
              </div>
            </div>

            <div className="pt-4 border-t dark:border-gray-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overall Accuracy</span>
                <span className="text-green-600 dark:text-green-400">{overallAccuracy}%</span>
              </div>
              <Progress value={overallAccuracy} className="h-2" />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</span>
                <span className="dark:text-white">{formatStudyTime(totalStudyTime)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</span>
                <span className="dark:text-white">{totalReviews}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cards Due Today</span>
                <span className="text-orange-600 dark:text-orange-400">{dueCards}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Streak */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Study Streak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-950 rounded-full mb-3">
                <TrendingUp className="h-10 w-10 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-3xl mb-1 dark:text-white">{studyStreak} days</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current streak</p>
            </div>

            <div className="pt-4 border-t dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Weekly Goal ({studyDaysThisWeek}/{weeklyGoal} days)
                </span>
                <span className="text-sm dark:text-white">
                  {Math.round((studyDaysThisWeek / weeklyGoal) * 100)}%
                </span>
              </div>
              <Progress value={(studyDaysThisWeek / weeklyGoal) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Performance by Subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectStatsArray.length > 0 ? (
              subjectStatsArray.map(stat => (
                <div key={stat.subject} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="dark:text-white">{stat.subject}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.cards} cards • {stat.reviews} reviews
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={stat.accuracy} className="h-2 flex-1" />
                    <span className="text-sm text-green-600 dark:text-green-400 w-12 text-right">
                      {stat.accuracy}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No study data yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {decks
              .filter(deck => deck.lastStudied)
              .sort((a, b) => (b.lastStudied?.getTime() || 0) - (a.lastStudied?.getTime() || 0))
              .slice(0, 5)
              .map(deck => (
                <div key={deck.id} className="flex items-center gap-3 py-2">
                  <div className={`w-10 h-10 rounded-lg ${deck.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate dark:text-white">{deck.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Studied {deck.lastStudied?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            {decks.filter(deck => deck.lastStudied).length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
