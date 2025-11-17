import { Deck } from '../App';
import { ArrowLeft, Moon, Sun, Trash2, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

type SettingsProps = {
  onBack: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
};

export function Settings({ onBack, theme, onThemeChange }: SettingsProps) {
  const handleExportData = () => {
    const data = localStorage.getItem('flashcard-decks');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashcard-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('flashcard-decks');
      window.location.reload();
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
        <h1 className="text-2xl mb-2">Settings</h1>
        <p className="text-white/80 text-sm">Customize your experience</p>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 space-y-4">
        {/* Appearance */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Appearance</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Customize how the app looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
                <div>
                  <Label htmlFor="dark-mode" className="dark:text-white">Dark Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Switch between light and dark theme
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Data Management</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Manage your flashcard data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start dark:border-gray-700 dark:text-white"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 px-1">
              Download a backup of all your decks and cards
            </p>
          </CardContent>
        </Card>

        {/* Study Settings */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Study Settings</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Customize your study experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="dark:text-white">Auto-flip Cards</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically reveal answers after 3 seconds
                </p>
              </div>
              <Switch disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="dark:text-white">Shuffle Cards</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Randomize card order during study
                </p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="dark:text-white">Study Reminders</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when cards are due
                </p>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Version</span>
              <span className="text-sm dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">App</span>
              <span className="text-sm dark:text-white">Cortex Cards</span>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-900 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full justify-start border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleClearData}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2 px-1">
              This will permanently delete all your decks and cards
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
