import { useState } from 'react';
import { Deck, Flashcard } from '../App';
import { ArrowLeft, Plus, Play, Trash2, Edit2, MoreVertical, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type DeckViewProps = {
  deck: Deck;
  onBack: () => void;
  onStudy: () => void;
  onAddCard: (deckId: string, card: Flashcard) => void;
  onUpdateCard: (deckId: string, cardId: string, updates: Partial<Flashcard>) => void;
  onDeleteCard: (deckId: string, cardId: string) => void;
  onUpdateDeck: (deckId: string, updates: Partial<Deck>) => void;
  onDeleteDeck: (deckId: string) => void;
  theme: 'light' | 'dark';
};

export function DeckView({
  deck,
  onBack,
  onStudy,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onUpdateDeck,
  onDeleteDeck,
  theme
}: DeckViewProps) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [showEditDeck, setShowEditDeck] = useState(false);
  const [showDeleteDeck, setShowDeleteDeck] = useState(false);

  const [newCard, setNewCard] = useState({
    question: '',
    answer: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  const [editDeck, setEditDeck] = useState({
    name: deck.name,
    subject: deck.subject,
    description: deck.description,
  });

  const handleAddCard = () => {
    if (newCard.question.trim() && newCard.answer.trim()) {
      const card: Flashcard = {
        id: Date.now().toString(),
        question: newCard.question,
        answer: newCard.answer,
        difficulty: newCard.difficulty,
        repetitions: 0,
        correctCount: 0,
        incorrectCount: 0,
      };
      onAddCard(deck.id, card);
      setNewCard({ question: '', answer: '', difficulty: 'medium' });
      setShowAddCard(false);
    }
  };

  const handleUpdateCard = () => {
    if (editingCard && newCard.question.trim() && newCard.answer.trim()) {
      onUpdateCard(deck.id, editingCard.id, {
        question: newCard.question,
        answer: newCard.answer,
        difficulty: newCard.difficulty,
      });
      setEditingCard(null);
      setNewCard({ question: '', answer: '', difficulty: 'medium' });
    }
  };

  const handleDeleteCard = () => {
    if (cardToDelete) {
      onDeleteCard(deck.id, cardToDelete);
      setCardToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleUpdateDeck = () => {
    onUpdateDeck(deck.id, editDeck);
    setShowEditDeck(false);
  };

  const handleDeleteDeck = () => {
    onDeleteDeck(deck.id);
    onBack();
  };

  const dueCards = deck.cards.filter(card => 
    !card.nextReview || card.nextReview <= new Date()
  ).length;

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className={`${deck.color} text-white px-6 pt-12 pb-6`}>
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <MoreVertical className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditDeck(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Deck
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteDeck(true)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Deck
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl">{deck.name}</h1>
          {deck.isAIGenerated && (
            <Sparkles className="h-5 w-5" />
          )}
        </div>
        <p className="text-white/80 text-sm mb-1">{deck.subject}</p>
        <p className="text-white/70 text-sm">{deck.description}</p>

        <div className="flex items-center gap-3 mt-4 text-sm">
          <span>{deck.cards.length} cards</span>
          {dueCards > 0 && (
            <>
              <span>•</span>
              <span>{dueCards} due for review</span>
            </>
          )}
        </div>

        <Button
          onClick={onStudy}
          className="w-full mt-6 bg-white text-gray-900 hover:bg-gray-100 h-12"
          disabled={deck.cards.length === 0}
        >
          <Play className="h-5 w-5 mr-2" />
          Start Studying
        </Button>
      </div>

      {/* Cards List */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg dark:text-white">Flashcards</h2>
          <Button
            onClick={() => {
              setShowAddCard(true);
              setEditingCard(null);
              setNewCard({ question: '', answer: '', difficulty: 'medium' });
            }}
            size="sm"
            className="dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Card
          </Button>
        </div>

        <div className="space-y-3">
          {deck.cards.map((card, index) => {
            const accuracy = card.correctCount + card.incorrectCount > 0
              ? Math.round((card.correctCount / (card.correctCount + card.incorrectCount)) * 100)
              : 0;

            return (
              <Card key={card.id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between gap-3 mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Card {index + 1}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingCard(card);
                          setNewCard({
                            question: card.question,
                            answer: card.answer,
                            difficulty: card.difficulty,
                          });
                          setShowAddCard(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => {
                          setCardToDelete(card.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Question:</p>
                    <p className="dark:text-white">{card.question}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Answer:</p>
                    <p className="dark:text-white">{card.answer}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className={`px-2 py-1 rounded ${
                      card.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                      card.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                      'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}>
                      {card.difficulty}
                    </span>
                    {(card.correctCount > 0 || card.incorrectCount > 0) && (
                      <>
                        <span>•</span>
                        <span>{accuracy}% accuracy</span>
                        <span>•</span>
                        <span>{card.repetitions} reviews</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {deck.cards.length === 0 && (
            <div className="text-center py-12">
              <Plus className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg mb-2 text-gray-600 dark:text-gray-400">No cards yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Add your first flashcard to start studying
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {editingCard ? 'Edit Card' : 'Add New Card'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="question" className="dark:text-white">Question</Label>
              <Textarea
                id="question"
                value={newCard.question}
                onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                placeholder="Enter your question..."
                rows={3}
                className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="answer" className="dark:text-white">Answer</Label>
              <Textarea
                id="answer"
                value={newCard.answer}
                onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                placeholder="Enter the answer..."
                rows={3}
                className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="difficulty" className="dark:text-white">Difficulty</Label>
              <Select
                value={newCard.difficulty}
                onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                  setNewCard({ ...newCard, difficulty: value })
                }
              >
                <SelectTrigger className="dark:bg-gray-900 dark:text-white dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCard(false)}>
              Cancel
            </Button>
            <Button onClick={editingCard ? handleUpdateCard : handleAddCard}>
              {editingCard ? 'Update' : 'Add'} Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Card Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Delete Card</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCard} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Deck Dialog */}
      <Dialog open={showEditDeck} onOpenChange={setShowEditDeck}>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Deck</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="deck-name" className="dark:text-white">Deck Name</Label>
              <Input
                id="deck-name"
                value={editDeck.name}
                onChange={(e) => setEditDeck({ ...editDeck, name: e.target.value })}
                className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="deck-subject" className="dark:text-white">Subject</Label>
              <Input
                id="deck-subject"
                value={editDeck.subject}
                onChange={(e) => setEditDeck({ ...editDeck, subject: e.target.value })}
                className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="deck-description" className="dark:text-white">Description</Label>
              <Textarea
                id="deck-description"
                value={editDeck.description}
                onChange={(e) => setEditDeck({ ...editDeck, description: e.target.value })}
                className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDeck(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDeck}>
              Update Deck
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Deck Dialog */}
      <AlertDialog open={showDeleteDeck} onOpenChange={setShowDeleteDeck}>
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Delete Deck</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Are you sure you want to delete "{deck.name}"? This will delete all {deck.cards.length} cards in this deck. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDeck} className="bg-red-600 hover:bg-red-700">
              Delete Deck
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
