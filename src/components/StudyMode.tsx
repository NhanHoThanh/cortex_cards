import { useState, useEffect } from 'react';
import { Deck, Flashcard } from '../App';
import { ArrowLeft, RotateCcw, ThumbsUp, ThumbsDown, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';

type StudyModeProps = {
  deck: Deck;
  onBack: () => void;
  onUpdateCard: (deckId: string, cardId: string, updates: Partial<Flashcard>) => void;
  onUpdateDeck: (deckId: string, updates: Partial<Deck>) => void;
  theme: 'light' | 'dark';
};

export function StudyMode({ deck, onBack, onUpdateCard, onUpdateDeck, theme }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    startTime: Date.now(),
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Prioritize due cards, then shuffle the rest
    const dueCards = deck.cards.filter(card => 
      !card.nextReview || card.nextReview <= new Date()
    );
    const otherCards = deck.cards.filter(card => 
      card.nextReview && card.nextReview > new Date()
    );
    
    const shuffled = [...dueCards, ...otherCards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffled);
  }, [deck]);

  const currentCard = studyCards[currentIndex];

  const handleResponse = (wasCorrect: boolean) => {
    if (!currentCard) return;

    const now = new Date();
    const newRepetitions = currentCard.repetitions + 1;
    
    // Simple spaced repetition algorithm
    let daysUntilNextReview = 1;
    if (wasCorrect) {
      if (newRepetitions === 1) daysUntilNextReview = 1;
      else if (newRepetitions === 2) daysUntilNextReview = 3;
      else if (newRepetitions === 3) daysUntilNextReview = 7;
      else daysUntilNextReview = Math.min(30, newRepetitions * 7);
    } else {
      daysUntilNextReview = 1;
    }

    const nextReview = new Date(now.getTime() + daysUntilNextReview * 24 * 60 * 60 * 1000);

    onUpdateCard(deck.id, currentCard.id, {
      lastReviewed: now,
      nextReview: nextReview,
      repetitions: newRepetitions,
      correctCount: currentCard.correctCount + (wasCorrect ? 1 : 0),
      incorrectCount: currentCard.incorrectCount + (wasCorrect ? 0 : 1),
    });

    setSessionStats({
      ...sessionStats,
      correct: sessionStats.correct + (wasCorrect ? 1 : 0),
      incorrect: sessionStats.incorrect + (wasCorrect ? 0 : 1),
    });

    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Complete the session
      const sessionTime = Math.floor((Date.now() - sessionStats.startTime) / 1000);
      onUpdateDeck(deck.id, {
        lastStudied: new Date(),
        totalStudyTime: deck.totalStudyTime + sessionTime,
      });
      setIsComplete(true);
    }
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
    setSessionStats({
      correct: 0,
      incorrect: 0,
      startTime: Date.now(),
    });
    const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffled);
  };

  const progress = ((currentIndex) / studyCards.length) * 100;

  if (studyCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg mb-4 dark:text-white">No cards to study</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const totalCards = sessionStats.correct + sessionStats.incorrect;
    const accuracy = totalCards > 0 ? Math.round((sessionStats.correct / totalCards) * 100) : 0;
    const sessionTime = Math.floor((Date.now() - sessionStats.startTime) / 1000);
    const minutes = Math.floor(sessionTime / 60);
    const seconds = sessionTime % 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6">
        <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h2 className="text-2xl mb-2 dark:text-white">Study Session Complete!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Great job studying {deck.name}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Cards Studied:</span>
                <span className="dark:text-white">{totalCards}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
                <span className="text-green-600 dark:text-green-400">{accuracy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Correct:</span>
                <span className="text-green-600 dark:text-green-400">{sessionStats.correct}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Needs Review:</span>
                <span className="text-orange-600 dark:text-orange-400">{sessionStats.incorrect}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Time:</span>
                <span className="dark:text-white">{minutes}m {seconds}s</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back to Deck
              </Button>
              <Button onClick={restartSession} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Study Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <span className="dark:text-white">
            Card {currentIndex + 1} of {studyCards.length}
          </span>
          <div className="w-10" />
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="px-6 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div
          className="w-full max-w-md cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front of card */}
            <Card
              className="min-h-[400px] flex items-center justify-center p-8 dark:bg-gray-800 dark:border-gray-700 absolute w-full"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <CardContent className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
                  Question
                </p>
                <p className="text-xl dark:text-white">{currentCard.question}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-8">
                  Tap to reveal answer
                </p>
              </CardContent>
            </Card>

            {/* Back of card */}
            <Card
              className="min-h-[400px] flex items-center justify-center p-8 dark:bg-gray-800 dark:border-gray-700"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <CardContent className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
                  Answer
                </p>
                <p className="text-xl dark:text-white">{currentCard.answer}</p>
                <div className={`mt-6 px-3 py-1 inline-block rounded-full text-sm ${
                  currentCard.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                  currentCard.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                  'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                }`}>
                  {currentCard.difficulty}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Response Buttons */}
        {isFlipped && (
          <div className="flex gap-4 mt-8 w-full max-w-md">
            <Button
              onClick={() => handleResponse(false)}
              variant="outline"
              className="flex-1 h-16 border-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <X className="h-6 w-6 mr-2" />
              Incorrect
            </Button>
            <Button
              onClick={() => handleResponse(true)}
              className="flex-1 h-16 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-6 w-6 mr-2" />
              Correct
            </Button>
          </div>
        )}
      </div>

      {/* Session Stats */}
      <div className="fixed bottom-6 left-6 right-6 flex justify-center gap-6">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="dark:text-white">{sessionStats.correct}</span>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="dark:text-white">{sessionStats.incorrect}</span>
        </div>
      </div>
    </div>
  );
}
