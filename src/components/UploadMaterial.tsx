import { useState } from 'react';
import { Deck, Flashcard } from '../App';
import { ArrowLeft, Upload, FileText, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

type UploadMaterialProps = {
  onBack: () => void;
  onGenerateDeck: (deck: Deck) => void;
  theme: 'light' | 'dark';
};

export function UploadMaterial({ onBack, onGenerateDeck, theme }: UploadMaterialProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');
  const [deckName, setDeckName] = useState('');
  const [subject, setSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Extract name without extension
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setDeckName(nameWithoutExt);
    }
  };

  const generateFlashcards = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock flashcards based on the content
    const mockCards: Flashcard[] = [
      {
        id: Date.now().toString() + '-1',
        question: 'What is the main concept discussed in this material?',
        answer: 'Based on the uploaded content, this covers fundamental principles and key topics relevant to the subject area.',
        difficulty: 'medium',
        repetitions: 0,
        correctCount: 0,
        incorrectCount: 0,
      },
      {
        id: Date.now().toString() + '-2',
        question: 'What are the key terms introduced?',
        answer: 'The material introduces several important terms and definitions that form the foundation of understanding this topic.',
        difficulty: 'easy',
        repetitions: 0,
        correctCount: 0,
        incorrectCount: 0,
      },
      {
        id: Date.now().toString() + '-3',
        question: 'How does this concept apply in practice?',
        answer: 'Practical applications include real-world scenarios where these principles can be implemented and tested.',
        difficulty: 'hard',
        repetitions: 0,
        correctCount: 0,
        incorrectCount: 0,
      },
      {
        id: Date.now().toString() + '-4',
        question: 'What are common misconceptions about this topic?',
        answer: 'Students often confuse related concepts or misunderstand the relationships between key principles.',
        difficulty: 'medium',
        repetitions: 0,
        correctCount: 0,
        incorrectCount: 0,
      },
      {
        id: Date.now().toString() + '-5',
        question: 'What are the historical origins of this concept?',
        answer: 'This concept was developed over time through research and practical application by various experts in the field.',
        difficulty: 'medium',
        repetitions: 0,
        correctCount: 0,
        incorrectCount: 0,
      },
    ];

    const newDeck: Deck = {
      id: Date.now().toString(),
      name: deckName || 'AI Generated Deck',
      subject: subject || 'General',
      description: `AI-generated flashcards from ${uploadMethod === 'file' ? 'uploaded document' : 'text input'}`,
      color: 'bg-purple-500',
      cards: mockCards,
      createdAt: new Date(),
      totalStudyTime: 0,
      isAIGenerated: true,
    };

    onGenerateDeck(newDeck);
    setIsGenerating(false);
    onBack();
  };

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900 text-white px-6 pt-12 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6" />
          <h1 className="text-2xl">AI Generate Flashcards</h1>
        </div>
        <p className="text-white/80 text-sm">Upload materials and let AI create flashcards for you</p>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6 space-y-6">
            {/* Upload Method Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('file')}
                className="dark:border-gray-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'text' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('text')}
                className="dark:border-gray-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Paste Text
              </Button>
            </div>

            {/* File Upload */}
            {uploadMethod === 'file' && (
              <div>
                <Label htmlFor="file-upload" className="dark:text-white">
                  Upload Document
                </Label>
                <div className="mt-2">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-12 w-12 mb-3 text-gray-400" />
                      {fileName ? (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{fileName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Click to change file
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            PDF, DOCX, TXT, or lecture notes
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Note: This is a demo. File content analysis is simulated.
                </p>
              </div>
            )}

            {/* Text Input */}
            {uploadMethod === 'text' && (
              <div>
                <Label htmlFor="text-input" className="dark:text-white">
                  Paste Your Notes or Content
                </Label>
                <Textarea
                  id="text-input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your lecture notes, study materials, or any text you want to convert into flashcards..."
                  rows={10}
                  className="mt-2 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  AI will analyze your content and generate relevant flashcards
                </p>
              </div>
            )}

            {/* Deck Details */}
            <div className="pt-4 border-t dark:border-gray-700">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deck-name" className="dark:text-white">
                    Deck Name
                  </Label>
                  <Input
                    id="deck-name"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    placeholder="e.g., Biology Chapter 3"
                    className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="dark:text-white">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Biology"
                    className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-purple-900 dark:text-purple-300 mb-1">
                    AI-Powered Generation
                  </h4>
                  <p className="text-xs text-purple-700 dark:text-purple-400">
                    Our AI will analyze your material and automatically generate:
                  </p>
                  <ul className="text-xs text-purple-700 dark:text-purple-400 mt-2 space-y-1 ml-4 list-disc">
                    <li>Key concept questions</li>
                    <li>Definition cards</li>
                    <li>Practice problems</li>
                    <li>Detailed explanations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateFlashcards}
              disabled={
                isGenerating ||
                (uploadMethod === 'file' && !fileName) ||
                (uploadMethod === 'text' && !textInput.trim())
              }
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Flashcards...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Flashcards
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
