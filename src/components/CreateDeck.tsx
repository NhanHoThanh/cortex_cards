import { useState } from 'react';
import { Deck } from '../App';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

type CreateDeckProps = {
  onBack: () => void;
  onCreateDeck: (deck: Deck) => void;
  theme: 'light' | 'dark';
};

const COLORS = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Cyan', value: 'bg-cyan-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
];

const SUBJECTS = [
  'Mathematics',
  'Science',
  'History',
  'Languages',
  'Computer Science',
  'Biology',
  'Chemistry',
  'Physics',
  'Literature',
  'Geography',
  'Economics',
  'Art',
  'Music',
  'Other',
];

export function CreateDeck({ onBack, onCreateDeck, theme }: CreateDeckProps) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    color: 'bg-blue-500',
  });

  const handleSubmit = () => {
    if (formData.name.trim() && formData.subject.trim()) {
      const newDeck: Deck = {
        id: Date.now().toString(),
        name: formData.name,
        subject: formData.subject,
        description: formData.description,
        color: formData.color,
        cards: [],
        createdAt: new Date(),
        totalStudyTime: 0,
      };
      onCreateDeck(newDeck);
      onBack();
    }
  };

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
        <h1 className="text-2xl mb-2">Create New Deck</h1>
        <p className="text-white/80 text-sm">Build your custom flashcard collection</p>
      </div>

      {/* Form */}
      <div className="px-6 -mt-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6 space-y-6">
            {/* Deck Name */}
            <div>
              <Label htmlFor="deck-name" className="dark:text-white">Deck Name</Label>
              <Input
                id="deck-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Spanish Vocabulary"
                className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>

            {/* Subject */}
            <div>
              <Label htmlFor="subject" className="dark:text-white">Subject</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {SUBJECTS.map(subject => (
                  <Button
                    key={subject}
                    type="button"
                    variant={formData.subject === subject ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, subject })}
                    className="justify-start dark:border-gray-700"
                  >
                    {subject}
                  </Button>
                ))}
              </div>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Or type a custom subject"
                className="mt-2 dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="dark:text-white">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this deck..."
                rows={3}
                className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
              />
            </div>

            {/* Color */}
            <div>
              <Label className="dark:text-white">Deck Color</Label>
              <div className="grid grid-cols-4 gap-3 mt-2">
                {COLORS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`h-16 rounded-lg ${color.value} relative transition-transform hover:scale-105 ${
                      formData.color === color.value ? 'ring-4 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800' : ''
                    }`}
                  >
                    {formData.color === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label className="dark:text-white">Preview</Label>
              <div className={`${formData.color} rounded-lg p-6 text-white mt-2`}>
                <h3 className="text-xl mb-1">
                  {formData.name || 'Deck Name'}
                </h3>
                <p className="text-white/80 text-sm">
                  {formData.subject || 'Subject'}
                </p>
                {formData.description && (
                  <p className="text-white/70 text-sm mt-2">
                    {formData.description}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim() || !formData.subject.trim()}
              className="w-full h-12"
            >
              Create Deck
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
