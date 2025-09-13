import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTest } from '@/context/TestContext';
import { ArrowLeft, CheckCircle, TrendingUp, Mail, Phone } from 'lucide-react';

const ResultScreen: React.FC = () => {
  const { testResult, setCurrentStep } = useTest();

  if (!testResult) {
    setCurrentStep(0);
    return null;
  }

  const handleContinue = () => {
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep(2);
  };

  const getFrequencyDescription = (frequency: string) => {
    const descriptions: Record<string, string> = {
      '125-2000 Hz': 'Düşük-orta frekans aralığı, günlük konuşma sesleri',
      '200-3000 Hz': 'Geniş frekans aralığı, çoğu ortam sesi',
      '250-1500 Hz': 'Düşük frekans aralığı, derin sesler',
      '250-3000 Hz': 'Orta-geniş frekans aralığı, konuşma ve çevre sesleri',
      '250-4000 Hz': 'Geniş frekans aralığı, detaylı ses algısı',
      '500-2000 Hz': 'Orta frekans aralığı, net konuşma sesleri',
      '500-3000 Hz': 'Orta-yüksek frekans aralığı, açık sesler',
      '500-4000 Hz': 'Yüksek frekans aralığı, ince detaylar',
    };
    return descriptions[frequency] || 'Özel frekans aralığı';
  };

  const getResultMessage = (word: string) => {
    const messages = [
      `Harika! "${word}" kelimesini net bir şekilde duydunuz.`,
      `Tebrikler! "${word}" kelimesini başarıyla ayırt ettiniz.`,
      `Mükemmel! "${word}" kelimesini doğru tespit ettiniz.`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="audio-visualizer w-24 h-24 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
            Test Tamamlandı!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {getResultMessage(testResult.selectedWord)}
          </p>
        </div>

        {/* Results Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Selected Word Card */}
          <Card className="hearing-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold mb-3 text-primary">
                Seçilen Kelime
              </h3>
              <div className="bg-primary/10 rounded-2xl p-6 mb-4">
                <span className="text-3xl font-bold text-primary">
                  "{testResult.selectedWord}"
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Bu kelime {testResult.scenario} senaryosunda 
                başarıyla tespit edildi.
              </p>
            </div>
          </Card>

          {/* Frequency Analysis Card */}
          <Card className="hearing-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold mb-3 text-secondary">
                Frekans Analizi
              </h3>
              <div className="bg-secondary/10 rounded-2xl p-6 mb-4">
                <div className="text-2xl font-bold text-secondary mb-2">
                  {testResult.estimatedFrequency}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>{getFrequencyDescription(testResult.estimatedFrequency)}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Bu frekans aralığında iyi bir işitme performansı 
                sergiledğiniz görülüyor.
              </p>
            </div>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card className="hearing-card text-center mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-xl font-semibold mb-4">Kişiselleştirilmiş Değerlendirme</h3>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Test Senaryosu:</span> {testResult.scenario}
            </p>
            <p>
              <span className="font-medium text-foreground">Yaş Grubu:</span> {
                testResult.userProfile.ageGroup === 'child' ? 'Çocuk' :
                testResult.userProfile.ageGroup === 'young-adult' ? 'Genç/Orta Yaş' : 'Yaşlı'
              }
            </p>
            <p>
              Bu sonuçlar, yaş grubunuz ve seçilen senaryo için normal değerler içerisindedir.
              Daha detaylı bir analiz için uzman görüşü almanızı öneriyoruz.
            </p>
          </div>
        </Card>

        {/* Contact Information Request */}
        <Card className="hearing-card text-center mb-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="space-y-4">
            <div className="flex justify-center gap-4 text-4xl mb-4">
              <Mail className="w-10 h-10 text-primary" />
              <Phone className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">Daha Fazla Bilgi İster misiniz?</h3>
            <p className="text-muted-foreground">
              Size kişiselleştirilmiş bir rapor gönderebilir ve 
              işitme sağlığınız hakkında daha detaylı bilgi verebiliriz.
            </p>
            <div className="flex justify-center gap-3 text-sm text-muted-foreground">
              <span>✓ Ücretsiz Rapor</span>
              <span>✓ Uzman Tavsiyeleri</span>
              <span>✓ Kişiselleştirilmiş İçerik</span>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Testi Tekrarla
          </Button>

          <button
            onClick={handleContinue}
            className="hearing-button-primary px-8 py-3"
          >
            Rapor Al
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;