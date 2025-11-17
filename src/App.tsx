import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { DeckView } from './components/DeckView';
import { StudyMode } from './components/StudyMode';
import { CreateDeck } from './components/CreateDeck';
import { UploadMaterial } from './components/UploadMaterial';
import { Statistics } from './components/Statistics';
import { Settings } from './components/Settings';

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReview?: Date;
  repetitions: number;
  correctCount: number;
  incorrectCount: number;
};

export type Deck = {
  id: string;
  name: string;
  subject: string;
  description: string;
  color: string;
  cards: Flashcard[];
  createdAt: Date;
  lastStudied?: Date;
  totalStudyTime: number;
  isAIGenerated?: boolean;
};

export type Screen = 
  | { type: 'home' }
  | { type: 'deck'; deckId: string }
  | { type: 'study'; deckId: string }
  | { type: 'create-deck' }
  | { type: 'upload' }
  | { type: 'statistics' }
  | { type: 'settings' };

function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'home' });
  const [decks, setDecks] = useState<Deck[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load decks from localStorage
  useEffect(() => {
    const savedDecks = localStorage.getItem('flashcard-decks');
    if (savedDecks) {
      const parsed = JSON.parse(savedDecks);
      setDecks(parsed.map((deck: any) => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        lastStudied: deck.lastStudied ? new Date(deck.lastStudied) : undefined,
        cards: deck.cards.map((card: any) => ({
          ...card,
          lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined,
          nextReview: card.nextReview ? new Date(card.nextReview) : undefined,
        }))
      })));
    } else {
      // Add sample decks
      setDecks(getSampleDecks());
    }

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save decks to localStorage
  useEffect(() => {
    if (decks.length > 0) {
      localStorage.setItem('flashcard-decks', JSON.stringify(decks));
    }
  }, [decks]);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const addDeck = (deck: Deck) => {
    setDecks([...decks, deck]);
  };

  const updateDeck = (deckId: string, updates: Partial<Deck>) => {
    setDecks(decks.map(deck => 
      deck.id === deckId ? { ...deck, ...updates } : deck
    ));
  };

  const deleteDeck = (deckId: string) => {
    setDecks(decks.filter(deck => deck.id !== deckId));
  };

  const addCardToDeck = (deckId: string, card: Flashcard) => {
    setDecks(decks.map(deck => 
      deck.id === deckId 
        ? { ...deck, cards: [...deck.cards, card] }
        : deck
    ));
  };

  const updateCard = (deckId: string, cardId: string, updates: Partial<Flashcard>) => {
    setDecks(decks.map(deck => 
      deck.id === deckId
        ? {
            ...deck,
            cards: deck.cards.map(card =>
              card.id === cardId ? { ...card, ...updates } : card
            )
          }
        : deck
    ));
  };

  const deleteCard = (deckId: string, cardId: string) => {
    setDecks(decks.map(deck => 
      deck.id === deckId
        ? { ...deck, cards: deck.cards.filter(card => card.id !== cardId) }
        : deck
    ));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {screen.type === 'home' && (
          <Home 
            decks={decks}
            onNavigate={setScreen}
            theme={theme}
          />
        )}
        
        {screen.type === 'deck' && (
          <DeckView
            deck={decks.find(d => d.id === screen.deckId)!}
            onBack={() => setScreen({ type: 'home' })}
            onStudy={() => setScreen({ type: 'study', deckId: screen.deckId })}
            onAddCard={addCardToDeck}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
            onUpdateDeck={updateDeck}
            onDeleteDeck={deleteDeck}
            theme={theme}
          />
        )}

        {screen.type === 'study' && (
          <StudyMode
            deck={decks.find(d => d.id === screen.deckId)!}
            onBack={() => setScreen({ type: 'deck', deckId: screen.deckId })}
            onUpdateCard={updateCard}
            onUpdateDeck={updateDeck}
            theme={theme}
          />
        )}

        {screen.type === 'create-deck' && (
          <CreateDeck
            onBack={() => setScreen({ type: 'home' })}
            onCreateDeck={addDeck}
            theme={theme}
          />
        )}

        {screen.type === 'upload' && (
          <UploadMaterial
            onBack={() => setScreen({ type: 'home' })}
            onGenerateDeck={addDeck}
            theme={theme}
          />
        )}

        {screen.type === 'statistics' && (
          <Statistics
            decks={decks}
            onBack={() => setScreen({ type: 'home' })}
            theme={theme}
          />
        )}

        {screen.type === 'settings' && (
          <Settings
            onBack={() => setScreen({ type: 'home' })}
            theme={theme}
            onThemeChange={setTheme}
          />
        )}
      </div>
    </div>
  );
}

function getSampleDecks(): Deck[] {
  return [
    {
      id: '1',
      name: 'Biology Basics',
      subject: 'Biology',
      description: 'Fundamental concepts in biology',
      color: 'bg-green-500',
      createdAt: new Date('2024-11-01'),
      lastStudied: new Date('2024-11-16'),
      totalStudyTime: 3600,
      cards: [
        {
          id: '1-1',
          question: 'What is photosynthesis?',
          answer: 'The process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water, releasing oxygen as a byproduct.',
          difficulty: 'medium',
          repetitions: 3,
          correctCount: 5,
          incorrectCount: 1,
          lastReviewed: new Date('2024-11-16'),
          nextReview: new Date('2024-11-19'),
        },
        {
          id: '1-2',
          question: 'What are the main components of a cell?',
          answer: 'The main components include the cell membrane, cytoplasm, nucleus (in eukaryotes), mitochondria, ribosomes, and various organelles depending on cell type.',
          difficulty: 'easy',
          repetitions: 5,
          correctCount: 8,
          incorrectCount: 0,
          lastReviewed: new Date('2024-11-15'),
          nextReview: new Date('2024-11-22'),
        },
        {
          id: '1-3',
          question: 'What is DNA?',
          answer: 'Deoxyribonucleic acid - a molecule that carries genetic instructions for the development, functioning, growth and reproduction of all known organisms.',
          difficulty: 'medium',
          repetitions: 2,
          correctCount: 3,
          incorrectCount: 2,
          lastReviewed: new Date('2024-11-14'),
          nextReview: new Date('2024-11-18'),
        }
      ]
    },
    {
      id: '2',
      name: 'Spanish Vocabulary',
      subject: 'Languages',
      description: 'Common Spanish words and phrases',
      color: 'bg-orange-500',
      createdAt: new Date('2024-10-20'),
      lastStudied: new Date('2024-11-17'),
      totalStudyTime: 2400,
      cards: [
        {
          id: '2-1',
          question: 'Hello (Spanish)',
          answer: 'Hola',
          difficulty: 'easy',
          repetitions: 10,
          correctCount: 15,
          incorrectCount: 0,
          lastReviewed: new Date('2024-11-17'),
          nextReview: new Date('2024-11-24'),
        },
        {
          id: '2-2',
          question: 'Thank you (Spanish)',
          answer: 'Gracias',
          difficulty: 'easy',
          repetitions: 8,
          correctCount: 12,
          incorrectCount: 1,
          lastReviewed: new Date('2024-11-17'),
          nextReview: new Date('2024-11-23'),
        }
      ]
    },
    {
      id: '3',
      name: 'World History - WW2',
      subject: 'History',
      description: 'AI-generated from lecture notes',
      color: 'bg-purple-500',
      createdAt: new Date('2024-11-10'),
      totalStudyTime: 1800,
      isAIGenerated: true,
      cards: [
        {
          id: '3-1',
          question: 'When did World War 2 begin?',
          answer: 'September 1, 1939, when Germany invaded Poland.',
          difficulty: 'easy',
          repetitions: 2,
          correctCount: 3,
          incorrectCount: 0,
          lastReviewed: new Date('2024-11-12'),
          nextReview: new Date('2024-11-19'),
        },
        {
          id: '3-2',
          question: 'What were the main Allied powers?',
          answer: 'United States, United Kingdom, Soviet Union, and China were the major Allied powers.',
          difficulty: 'medium',
          repetitions: 1,
          correctCount: 1,
          incorrectCount: 1,
          lastReviewed: new Date('2024-11-13'),
          nextReview: new Date('2024-11-18'),
        }
      ]
    }
  ];
}

export default App;
