export type AgeGroup = 'child' | 'young-adult' | 'elderly';
export type Gender = 'male' | 'female';

export interface UserProfile {
  ageGroup: AgeGroup;
  gender: Gender;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  soundEnvironment: string;
  targetWords: string[];
  frequencyRange: string;
  ageGroups: AgeGroup[];
  genders: Gender[];
}

export interface TestResult {
  selectedWord: string;
  estimatedFrequency: string;
  scenario: string;
  userProfile: UserProfile;
}

export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kvkkConsent: boolean;
}

export const SCENARIOS: Scenario[] = [
  // Child scenarios
  {
    id: 'kindergarten',
    name: 'Anaokulu',
    description: 'Çocuk sesleri ve oyun ortamı',
    soundEnvironment: 'Çocuk parkı atmosferi',
    targetWords: ['oyun', 'öğretmen', 'arkadaş'],
    frequencyRange: '500-2000 Hz',
    ageGroups: ['child'],
    genders: ['male', 'female']
  },
  {
    id: 'park',
    name: 'Park',
    description: 'Açık hava ve doğa sesleri',
    soundEnvironment: 'Park ortamı',
    targetWords: ['kuş', 'çiçek', 'oyun'],
    frequencyRange: '250-1500 Hz',
    ageGroups: ['child'],
    genders: ['male', 'female']
  },
  {
    id: 'cartoon',
    name: 'Çizgi Film',
    description: 'Eğlenceli karakterler ve müzik',
    soundEnvironment: 'Çizgi film ortamı',
    targetWords: ['kahkaha', 'müzik', 'karakter'],
    frequencyRange: '500-3000 Hz',
    ageGroups: ['child'],
    genders: ['male', 'female']
  },
  
  // Young/Middle-aged Male scenarios
  {
    id: 'stadium',
    name: 'Stadyum',
    description: 'Spor maçı ve taraftar sesleri',
    soundEnvironment: 'Stadyum ortamı',
    targetWords: ['gol', 'skor', 'takım'],
    frequencyRange: '250-4000 Hz',
    ageGroups: ['young-adult'],
    genders: ['male']
  },
  {
    id: 'traffic',
    name: 'Trafik',
    description: 'Şehir trafiği ve araç sesleri',
    soundEnvironment: 'Trafik ortamı',
    targetWords: ['klakson', 'motor', 'fren'],
    frequencyRange: '125-2000 Hz',
    ageGroups: ['young-adult', 'elderly'],
    genders: ['male']
  },
  {
    id: 'airport',
    name: 'Havalimanı',
    description: 'Uçak ve terminal sesleri',
    soundEnvironment: 'Havalimanı ortamı',
    targetWords: ['uçuş', 'kapı', 'bagaj'],
    frequencyRange: '200-3000 Hz',
    ageGroups: ['young-adult', 'elderly'],
    genders: ['male']
  },
  
  // Young/Middle-aged & Elderly Female scenarios
  {
    id: 'mall',
    name: 'AVM',
    description: 'Alışveriş merkezi ortamı',
    soundEnvironment: 'AVM ortamı',
    targetWords: ['mağaza', 'ürün', 'fiyat'],
    frequencyRange: '500-4000 Hz',
    ageGroups: ['young-adult', 'elderly'],
    genders: ['female']
  },
  {
    id: 'family-visit',
    name: 'Bayram Ziyareti',
    description: 'Aile toplantısı ve sohbet',
    soundEnvironment: 'Aile ortamı',
    targetWords: ['sohbet', 'çay', 'hediye'],
    frequencyRange: '250-3000 Hz',
    ageGroups: ['young-adult', 'elderly'],
    genders: ['female']
  },
  {
    id: 'cafe',
    name: 'Cafe',
    description: 'Kahve dükkanı ve müzik',
    soundEnvironment: 'Cafe ortamı',
    targetWords: ['kahve', 'müzik', 'sohbet'],
    frequencyRange: '500-4000 Hz',
    ageGroups: ['young-adult', 'elderly'],
    genders: ['female']
  }
];