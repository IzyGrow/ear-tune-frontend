import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, Scenario, TestResult, ContactForm } from '@/types/hearing-test';

interface TestContextType {
  // User data
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  
  // Test flow
  selectedScenario: Scenario | null;
  setSelectedScenario: (scenario: Scenario) => void;
  
  testResult: TestResult | null;
  setTestResult: (result: TestResult) => void;
  
  contactForm: ContactForm | null;
  setContactForm: (form: ContactForm) => void;
  
  // Navigation state
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  // Utility functions
  resetTest: () => void;
  canNavigateNext: () => boolean;
  canNavigatePrevious: () => boolean;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

interface TestProviderProps {
  children: ReactNode;
}

export const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [contactForm, setContactForm] = useState<ContactForm | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const resetTest = () => {
    setUserProfile(null);
    setSelectedScenario(null);
    setTestResult(null);
    setContactForm(null);
    setCurrentStep(0);
  };

  const canNavigateNext = () => {
    switch (currentStep) {
      case 0: // Welcome/User Profile
        return userProfile !== null;
      case 1: // Scenario Selection
        return selectedScenario !== null;
      case 2: // Test
        return testResult !== null;
      case 3: // Results
        return true;
      case 4: // Contact Form
        return contactForm !== null && contactForm.kvkkConsent;
      default:
        return false;
    }
  };

  const canNavigatePrevious = () => {
    return currentStep > 0;
  };

  return (
    <TestContext.Provider
      value={{
        userProfile,
        setUserProfile,
        selectedScenario,
        setSelectedScenario,
        testResult,
        setTestResult,
        contactForm,
        setContactForm,
        currentStep,
        setCurrentStep,
        resetTest,
        canNavigateNext,
        canNavigatePrevious,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};