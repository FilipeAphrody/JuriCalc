import React from 'react';
import styles from './Stepper.module.css';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className={styles.stepperContainer}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={step.id} className={styles.stepWrapper}>
            <div className={styles.stepIndicator}>
              <div
                className={`${styles.circle} ${isActive ? styles.active : ''} ${
                  isCompleted ? styles.completed : ''
                }`}
              >
                {isCompleted ? <Check size={16} /> : index + 1}
              </div>
              <span
                className={`${styles.label} ${
                  isActive || isCompleted ? styles.labelActive : ''
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`${styles.line} ${
                  isCompleted ? styles.lineCompleted : ''
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
