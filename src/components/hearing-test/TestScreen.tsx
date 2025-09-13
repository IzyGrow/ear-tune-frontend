import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTest } from '@/context/TestContext';
import { TestResult } from '@/types/hearing-test';
import { ArrowLeft, Volume2, Waves } from 'lucide-react';
import { AudioEngine } from '@/lib/audio-engine';

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
  const [testError, setTestError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const playedWordRef = useRef<string | null>(null);

  useEffect(() => {
    // Audio engine'i başlat
    const initializeAudio = async () => {
      try {
        audioEngineRef.current = new AudioEngine();
        await audioEngineRef.current.initialize();
        console.log('Audio engine initialized successfully');
      } catch (error) {
        console.error('Audio initialization error:', error);
        setTestError('Ses sistemi başlatılamadı. Lütfen tarayıcınızı güncelleyin.');
      }
    };

    initializeAudio();

    // Cleanup
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      // Gerçek zamanlı ses seviyesi görselleştirmesi
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

  const handleStartTest = async () => {
    if (!audioEngineRef.current || !selectedScenario) return;
    
    setIsLoading(true);
    setTestError(null);
    
    try {
      setTestPhase('playing');
      setIsPlaying(true);
      
      console.log('Starting test with scenario:', selectedScenario);
      console.log('Target words:', selectedScenario.targetWords);
      
      // Gerçek ses testini başlat
      await audioEngineRef.current.startTest(selectedScenario);
      
      // Test tamamlandıktan sonra
      setTimeout(() => {
        console.log('Test completed, moving to selection phase');
        setIsPlaying(false);
        setTestPhase('selection');
        setIsLoading(false);
      }, 6000); // 6 saniye (4s ses + 2s geçiş)
      
    } catch (error) {
      console.error('Test başlatma hatası:', error);
      setTestError(`Test başlatılamadı: ${error.message || 'Bilinmeyen hata'}`);
      setIsPlaying(false);
      setIsLoading(false);
      setTestPhase('instructions');
    }
  };

  const handleWordSelection = (word: string) => {
    setSelectedWord(word);
    
    // Gerçek frekans değerini hesapla
    const wordFrequency = AudioEngine.getWordFrequency(word);
    
    // Test sonucunu oluştur
    const result: TestResult = {
      selectedWord: word,
      estimatedFrequency: `${wordFrequency} Hz (${selectedScenario.frequencyRange})`,
      scenario: selectedScenario.name,
      userProfile,
    };
    
    setTestResult(result);
    
    // Ses testini durdur
    if (audioEngineRef.current) {
      audioEngineRef.current.stopTest();
    }
    
    setCurrentStep(3);
  };

  const handleBack = () => {
    // Ses testini durdur
    if (audioEngineRef.current) {
      audioEngineRef.current.stopTest();
    }
    setIsPlaying(false);
    setTestPhase('instructions');
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
                disabled={isLoading || !!testError}
                className="hearing-button-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Başlatılıyor...' : 'Testi Başlat'}
              </button>
              
              {testError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <p className="font-medium">Hata:</p>
                  <p className="text-sm">{testError}</p>
                  <button
                    onClick={() => setTestError(null)}
                    className="mt-2 text-xs underline hover:no-underline"
                  >
                    Tekrar dene
                  </button>
                </div>
              )}
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