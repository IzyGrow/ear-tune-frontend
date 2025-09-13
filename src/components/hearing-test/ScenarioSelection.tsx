import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTest } from '@/context/TestContext';
import { SCENARIOS } from '@/types/hearing-test';
import { ArrowLeft, PlayCircle, Volume2 } from 'lucide-react';

const ScenarioSelection: React.FC = () => {
  const { userProfile, setSelectedScenario, setCurrentStep, selectedScenario } = useTest();

  if (!userProfile) {
    setCurrentStep(0);
    return null;
  }

  const availableScenarios = SCENARIOS.filter(
    (scenario) =>
      scenario.ageGroups.includes(userProfile.ageGroup) &&
      scenario.genders.includes(userProfile.gender)
  );

  const handleScenarioSelect = (scenario: typeof SCENARIOS[0]) => {
    setSelectedScenario(scenario);
  };

  const handleContinue = () => {
    if (selectedScenario) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
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
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="audio-visualizer w-20 h-20 flex items-center justify-center">
              <Volume2 className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Test Senaryosunu Seç
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hangi ortamda işitme testini yapmak istiyorsun? 
            Her senaryo farklı sesler ve kelimeler içerir.
          </p>
        </div>

        {/* Scenario Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {availableScenarios.map((scenario, index) => (
            <Card
              key={scenario.id}
              className={`scenario-card cursor-pointer animate-fade-in ${
                selectedScenario?.id === scenario.id
                  ? 'ring-2 ring-primary shadow-glow'
                  : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleScenarioSelect(scenario)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{getScenarioIcon(scenario.id)}</div>
                <h3 className="text-xl font-semibold mb-3 text-primary">
                  {scenario.name}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {scenario.description}
                </p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    <span>{scenario.soundEnvironment}</span>
                  </div>
                  <div className="bg-muted rounded-lg p-2">
                    <span className="font-medium">Hedef Kelimeler:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {scenario.targetWords.map((word) => (
                        <span
                          key={word}
                          className="bg-primary/20 text-primary px-2 py-1 rounded text-xs"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-secondary font-medium">
                    {scenario.frequencyRange}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Button>

          <button
            onClick={handleContinue}
            disabled={!selectedScenario}
            className="hearing-button-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Teste Geç
          </button>
        </div>

        {!selectedScenario && (
          <p className="text-center mt-4 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.8s' }}>
            Devam etmek için bir senaryo seçin
          </p>
        )}
      </div>
    </div>
  );
};

export default ScenarioSelection;