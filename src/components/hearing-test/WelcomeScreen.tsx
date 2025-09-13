import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTest } from '@/context/TestContext';
import { AgeGroup, Gender, UserProfile } from '@/types/hearing-test';
import { HeadphonesIcon, Users, Heart } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const { setUserProfile, setCurrentStep } = useTest();
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const handleSubmit = () => {
    if (selectedAge && selectedGender) {
      const profile: UserProfile = {
        ageGroup: selectedAge,
        gender: selectedGender,
      };
      setUserProfile(profile);
      setCurrentStep(1);
    }
  };

  const ageGroups = [
    { id: 'child' as AgeGroup, label: 'Çocuk (0-12 yaş)', icon: '🧒' },
    { id: 'young-adult' as AgeGroup, label: 'Genç/Orta Yaş (13-64 yaş)', icon: '🧑' },
    { id: 'elderly' as AgeGroup, label: 'Yaşlı (65+ yaş)', icon: '👴' },
  ];

  const genders = [
    { id: 'female' as Gender, label: 'Kadın', icon: '👩' },
    { id: 'male' as Gender, label: 'Erkek', icon: '👨' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="audio-visualizer w-24 h-24 flex items-center justify-center">
              <HeadphonesIcon className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            İşitme Testi Uygulaması
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Bu test senin işitme duyunu günlük hayattan seslerle ölçüyor. 
            Farklı ortamlarda ne kadar iyi duyduğunu keşfedelim!
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Age Group Selection */}
          <Card className="hearing-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Yaş Grubunu Seç</h2>
            </div>
            <div className="space-y-3">
              {ageGroups.map((age) => (
                <button
                  key={age.id}
                  onClick={() => setSelectedAge(age.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedAge === age.id
                      ? 'border-primary bg-primary/10 shadow-lg scale-105'
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{age.icon}</span>
                    <span className="font-medium">{age.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Gender Selection */}
          <Card className="hearing-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-semibold">Cinsiyetini Seç</h2>
            </div>
            <div className="space-y-3">
              {genders.map((gender) => (
                <button
                  key={gender.id}
                  onClick={() => setSelectedGender(gender.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedGender === gender.id
                      ? 'border-secondary bg-secondary/10 shadow-lg scale-105'
                      : 'border-border hover:border-secondary/50 hover:bg-secondary/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{gender.icon}</span>
                    <span className="font-medium">{gender.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={handleSubmit}
            disabled={!selectedAge || !selectedGender}
            className="hearing-button-primary text-lg px-12 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Teste Başla
          </button>
          {(!selectedAge || !selectedGender) && (
            <p className="mt-4 text-sm text-muted-foreground">
              Devam etmek için yaş grubu ve cinsiyet seçimi yapın
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;