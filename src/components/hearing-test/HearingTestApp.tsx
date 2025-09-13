import React from 'react';
import { TestProvider, useTest } from '@/context/TestContext';
import WelcomeScreen from './WelcomeScreen';
import ScenarioSelection from './ScenarioSelection';
import TestScreen from './TestScreen';
import ResultScreen from './ResultScreen';
import ContactForm from './ContactForm';

const HearingTestContent: React.FC = () => {
  const { currentStep } = useTest();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen />;
      case 1:
        return <ScenarioSelection />;
      case 2:
        return <TestScreen />;
      case 3:
        return <ResultScreen />;
      case 4:
        return <ContactForm />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
    </div>
  );
};

const HearingTestApp: React.FC = () => {
  return (
    <TestProvider>
      <HearingTestContent />
    </TestProvider>
  );
};

export default HearingTestApp;