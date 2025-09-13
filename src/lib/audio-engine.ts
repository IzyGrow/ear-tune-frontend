// Web Audio API tabanlı ses işleme motoru
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private backgroundNoise: AudioBufferSourceNode | null = null;
  private speechSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private noiseGainNode: GainNode | null = null;
  private speechGainNode: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private isPlaying = false;

  // Frekans aralıkları (Hz)
  private static readonly FREQUENCY_RANGES = {
    '125-2000 Hz': { low: 125, high: 2000 },
    '200-3000 Hz': { low: 200, high: 3000 },
    '250-1500 Hz': { low: 250, high: 1500 },
    '250-3000 Hz': { low: 250, high: 3000 },
    '250-4000 Hz': { low: 250, high: 4000 },
    '500-2000 Hz': { low: 500, high: 2000 },
    '500-3000 Hz': { low: 500, high: 3000 },
    '500-4000 Hz': { low: 500, high: 4000 }
  };

  // Kelime-frekans eşleştirmesi
  private static readonly WORD_FREQUENCIES = {
    // Çocuk kelimeleri
    'oyun': 800,
    'öğretmen': 1200,
    'arkadaş': 1000,
    'kuş': 600,
    'çiçek': 900,
    'kahkaha': 1500,
    'karakter': 1300,
    
    // Erkek senaryoları
    'gol': 700,
    'skor': 900,
    'takım': 800,
    'klakson': 500,
    'motor': 400,
    'fren': 600,
    'uçuş': 1000,
    'kapı': 850,
    'bagaj': 750,
    
    // Kadın senaryoları
    'mağaza': 1200,
    'ürün': 1000,
    'fiyat': 1100,
    'sohbet': 900,
    'çay': 800,
    'hediye': 950,
    'kahve': 850,
    'müzik': 1100
  };

  async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Gain node'ları oluştur
      this.gainNode = this.audioContext.createGain();
      this.noiseGainNode = this.audioContext.createGain();
      this.speechGainNode = this.audioContext.createGain();
      
      // Band-pass filter oluştur (gerçek Web Audio API filtresi)
      this.noiseFilter = this.audioContext.createBiquadFilter();
      this.noiseFilter.type = "bandpass";
      this.noiseFilter.Q.value = 1; // Kalite faktörü
      
      // Bağlantıları kur
      this.gainNode.connect(this.audioContext.destination);
      this.noiseGainNode.connect(this.gainNode);
      this.speechGainNode.connect(this.gainNode);
      
      // Ses seviyelerini başlangıç değerlerine ayarla
      this.noiseGainNode.gain.value = 0.1;
      this.speechGainNode.gain.value = 0;
      this.gainNode.gain.value = 0.3;
      
    } catch (error) {
      console.error('Audio context initialization failed:', error);
      throw new Error('Ses sistemi başlatılamadı. Tarayıcınız Web Audio API desteklemiyor olabilir.');
    }
  }

  // Arka plan gürültüsü oluştur (gerçek white noise)
  private createBackgroundNoise(frequencyRange: string): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');
    
    const range = AudioEngine.FREQUENCY_RANGES[frequencyRange as keyof typeof AudioEngine.FREQUENCY_RANGES];
    if (!range) throw new Error('Geçersiz frekans aralığı');
    
    const sampleRate = this.audioContext.sampleRate;
    const duration = 5; // 5 saniye
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    // Saf white noise oluştur (performanslı)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1; // Düşük seviye white noise
    }
    
    return buffer;
  }


  // Konuşma sesi oluştur (sentetik)
  private createSpeechSound(word: string): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');
    
    const frequency = AudioEngine.WORD_FREQUENCIES[word as keyof typeof AudioEngine.WORD_FREQUENCIES] || 1000;
    const sampleRate = this.audioContext.sampleRate;
    const duration = 1.5; // 1.5 saniye
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    // Daha yumuşak konuşma benzeri ses oluştur
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 1.5); // Daha yumuşak zarf
      
      // Temel frekans - daha basit ve temiz
      let speech = 0;
      speech += Math.sin(2 * Math.PI * frequency * t) * 0.4;
      speech += Math.sin(2 * Math.PI * frequency * 2 * t) * 0.2;
      
      // Çok hafif formant
      speech += Math.sin(2 * Math.PI * (frequency * 1.5) * t) * 0.1;
      
      // Ses seviyesi sınırla
      data[i] = Math.max(-0.3, Math.min(0.3, speech * envelope * 0.4));
    }
    
    return buffer;
  }

  // Testi başlat
  async startTest(scenario: { frequencyRange: string; targetWords: string[] }): Promise<void> {
    if (!this.audioContext) await this.initialize();
    if (this.isPlaying) return;

    this.isPlaying = true;
    
    try {
      // Frekans aralığını ayarla
      const range = AudioEngine.FREQUENCY_RANGES[scenario.frequencyRange as keyof typeof AudioEngine.FREQUENCY_RANGES];
      if (range && this.noiseFilter) {
        const centerFreq = (range.low + range.high) / 2;
        this.noiseFilter.frequency.value = centerFreq;
        this.noiseFilter.Q.value = Math.max(0.5, Math.min(2, (range.high - range.low) / centerFreq));
      }
      
      // Arka plan gürültüsünü oluştur ve çal (gerçek filtre ile)
      const noiseBuffer = this.createBackgroundNoise(scenario.frequencyRange);
      this.backgroundNoise = this.audioContext!.createBufferSource();
      this.backgroundNoise.buffer = noiseBuffer;
      
      // White noise → Band-pass filter → Gain → Master
      this.backgroundNoise.connect(this.noiseFilter!);
      this.noiseFilter!.connect(this.noiseGainNode!);
      this.backgroundNoise.loop = true;
      this.backgroundNoise.start();

      // Ses seviyesini kademeli olarak artır
      await this.graduallyIncreaseVolume();

      // Rastgele kelime seç ve çal
      const randomWord = scenario.targetWords[Math.floor(Math.random() * scenario.targetWords.length)];
      console.log(`Selected word to play: ${randomWord}`);
      console.log(`Word frequency: ${AudioEngine.WORD_FREQUENCIES[randomWord as keyof typeof AudioEngine.WORD_FREQUENCIES]} Hz`);
      await this.playWord(randomWord);

    } catch (error) {
      console.error('Test başlatma hatası:', error);
      this.stopTest();
      throw error;
    }
  }

  // Ses seviyesini kademeli olarak artır
  private async graduallyIncreaseVolume(): Promise<void> {
    if (!this.noiseGainNode) return;

    const steps = 15;
    const stepDuration = 300; // 300ms per step
    const finalVolume = 0.4; // Çok daha düşük maksimum seviye

    for (let i = 0; i <= steps; i++) {
      const volume = (i / steps) * finalVolume;
      this.noiseGainNode.gain.setValueAtTime(
        this.noiseGainNode.gain.value,
        this.audioContext!.currentTime
      );
      this.noiseGainNode.gain.linearRampToValueAtTime(
        volume,
        this.audioContext!.currentTime + 0.1
      );
      
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  // Kelime çal
  private async playWord(word: string): Promise<void> {
    if (!this.audioContext) return;

    console.log(`Playing word: ${word}`);
    
    // Önce basit bir ton testi yap (daha net duyulabilir)
    await this.playSimpleTone(word);
    
    // Sonra gerçek konuşma sesini çal
    const speechBuffer = this.createSpeechSound(word);
    this.speechSource = this.audioContext.createBufferSource();
    this.speechSource.buffer = speechBuffer;
    this.speechSource.connect(this.speechGainNode!);

    // Konuşma sesini yavaşça artır
    this.speechGainNode!.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.speechGainNode!.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.5);

    this.speechSource.start();
    
    // Konuşma bittikten sonra ses seviyesini azalt
    setTimeout(() => {
      if (this.speechGainNode) {
        this.speechGainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 0.5);
      }
    }, 1000);
  }

  // Basit ton testi (kelimeyi temsil eden frekans)
  private async playSimpleTone(word: string): Promise<void> {
    if (!this.audioContext) return;

    const frequency = AudioEngine.WORD_FREQUENCIES[word as keyof typeof AudioEngine.WORD_FREQUENCIES] || 1000;
    
    // Oscillator oluştur
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.speechGainNode!);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Ses seviyesi kontrolü - çok daha düşük seviyeler
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.2);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1.0);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.8);
    
    console.log(`Playing tone at ${frequency}Hz for word: ${word}`);
  }

  // Testi durdur
  stopTest(): void {
    if (this.backgroundNoise) {
      this.backgroundNoise.stop();
      this.backgroundNoise = null;
    }
    if (this.speechSource) {
      this.speechSource.stop();
      this.speechSource = null;
    }
    
    this.isPlaying = false;
    
    // Ses seviyelerini initialize değerleri ile sıfırla (tutarlı)
    if (this.noiseGainNode) this.noiseGainNode.gain.value = 0.1;
    if (this.speechGainNode) this.speechGainNode.gain.value = 0;
  }

  // Kelime frekansını al
  static getWordFrequency(word: string): number {
    return AudioEngine.WORD_FREQUENCIES[word as keyof typeof AudioEngine.WORD_FREQUENCIES] || 1000;
  }

  // Frekans aralığını al
  static getFrequencyRange(rangeString: string): { low: number; high: number } | null {
    return AudioEngine.FREQUENCY_RANGES[rangeString as keyof typeof AudioEngine.FREQUENCY_RANGES] || null;
  }

  // Ses durumunu kontrol et
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Audio context'i temizle
  dispose(): void {
    this.stopTest();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null; // Tekrar initialize için temizle
  }
}
