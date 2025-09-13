import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTest } from '@/context/TestContext';
import { TestResult } from '@/types/hearing-test';
import { ArrowLeft, Volume2, Waves } from 'lucide-react';

const TestScreen: React.FC = () => {
  const { 
    userProfile, 
    selectedScenario, 
    setTestResult, 
    setCurrentStep 
  } = useTest();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [testPhase, setTestPhase] = useState<'instructions' | 'playing' | 'selection'>('instructions');
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      // Simulate audio level visualization
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  if (!userProfile || !selectedScenario) {
    setCurrentStep(0);
    return null;
  }

  const handleStartTest = () => {
    setTestPhase('playing');
    setIsPlaying(true);
    
    // Simulate test duration (5 seconds)
    setTimeout(() => {
      setIsPlaying(false);
      setTestPhase('selection');
    }, 5000);
  };

  const handleWordSelection = (word: string) => {
    setSelectedWord(word);
    
    // Create test result
    const result: TestResult = {
      selectedWord: word,
      estimatedFrequency: selectedScenario.frequencyRange,
      scenario: selectedScenario.name,
      userProfile,
    };
    
    setTestResult(result);
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const getScenarioIcon = (scenarioId: string) => {
    const icons: Record<string, string> = {
      kindergarten: '🏫',
      park: '🌳',
      cartoon: '🎭',
      stadium: '⚽',
      traffic: '🚗',
      airport: '✈️',
      mall: '🛍️',
      'family-visit': '🏠',
      cafe: '☕',
    };
    return icons[scenarioId] || '🎵';
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-4">{getScenarioIcon(selectedScenario.id)}</div>
          <h1 className="text-3xl font-bold mb-2 text-primary">
            {selectedScenario.name} Testi
          </h1>
          <p className="text-muted-foreground">
            {selectedScenario.description}
          </p>
        </div>

        {/* Instructions Phase */}
        {testPhase === 'instructions' && (
          <Card className="hearing-card text-center mb-8 animate-fade-in">
            <div className="space-y-6">
              <div className="text-8xl">🎧</div>
              <h2 className="text-2xl font-semibold">Test Talimatları</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>• Kulaklığınızı takın veya ses seviyesini ayarlayın</p>
                <p>• {selectedScenario.soundEnvironment} sesleri çalacak</p>
                <p>• Arka plan gürültüsü artarken kelimeler duyacaksınız</p>
                <p>• Duyduğunuz ilk kelimeyi seçin</p>
              </div>
              <button
                onClick={handleStartTest}
                className="hearing-button-primary text-lg px-8 py-4"
              >
                Testi Başlat
              </button>
            </div>
          </Card>
        )}

        {/* Audio Playing Phase */}
        {testPhase === 'playing' && (
          <Card className="hearing-card text-center mb-8 animate-fade-in">
            <div className="space-y-6">
              <div className="relative">
                <div className="audio-visualizer w-32 h-32 mx-auto flex items-center justify-center">
                  <Volume2 className="w-16 h-16 text-primary-foreground animate-pulse" />
                </div>
                {/* Audio Visualization */}
                <div className="mt-6 flex justify-center gap-1">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-primary rounded-full transition-all duration-100"
                      style={{
                        height: `${20 + (Math.sin((audioLevel + i * 10) / 10) + 1) * 15}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <h2 className="text-2xl font-semibold">Test Çalıyor...</h2>
              <p className="text-muted-foreground">
                Dikkatli dinleyin ve duyduğunuz kelimelere odaklanın
              </p>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Waves className="w-5 h-5 animate-bounce" />
                <span className="font-medium">Ses seviyeleri artıyor</span>
                <Waves className="w-5 h-5 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </Card>
        )}

        {/* Word Selection Phase */}
        {testPhase === 'selection' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="hearing-card text-center">
              <h2 className="text-2xl font-semibold mb-4">Hangi Kelimeyi Duydunuz?</h2>
              <p className="text-muted-foreground mb-6">
                Testte duyduğunuz ilk ve en net kelimeyi seçin
              </p>
            </Card>

            {/* Word Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedScenario.targetWords.map((word, index) => (
                <button
                  key={word}
                  onClick={() => handleWordSelection(word)}
                  className="test-word-button animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {word}
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Emin değilseniz, en çok benzer olanı seçin
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 animate-fade-in">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center gap-2"
            disabled={testPhase === 'playing'}
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Button>
          
          {testPhase === 'playing' && (
            <div className="text-muted-foreground text-sm">
              Test yaklaşık 5 saniye sürer...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestScreen;