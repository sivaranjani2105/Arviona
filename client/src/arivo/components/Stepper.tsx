
import React from 'react';
import { motion } from 'framer-motion';
import { OnboardingStep } from '../types';

interface StepperProps {
  currentStep: OnboardingStep;
}

const steps = [
  { id: OnboardingStep.ABOUT_YOU, label: 'About You' },
  { id: OnboardingStep.SUBJECTS, label: 'Subjects' },
  { id: OnboardingStep.PREFERENCES, label: 'Preferences' }
];

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-12 px-4 overflow-hidden">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-110' 
                    : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white text-slate-300 border-2 border-slate-100'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span className={`text-xs mt-3 font-bold uppercase tracking-widest transition-colors duration-500 ${
                isActive ? 'text-indigo-600' : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
            
            {idx < steps.length - 1 && (
              <div className="w-16 md:w-24 h-1 bg-slate-100 rounded-full overflow-hidden mb-6">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  className="h-full bg-indigo-600"
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
