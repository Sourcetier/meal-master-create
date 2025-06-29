
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center space-x-5">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="relative">
            {stepIdx !== steps.length - 1 && (
              <div
                className={`absolute top-4 left-8 -ml-px h-0.5 w-16 ${
                  step.id < currentStep ? 'bg-purple-600' : 'bg-gray-300'
                }`}
                aria-hidden="true"
              />
            )}
            <div className="relative flex items-center space-x-2">
              <div className="flex items-center">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step.id < currentStep
                      ? 'bg-purple-600 text-white'
                      : step.id === currentStep
                      ? 'bg-purple-100 border-2 border-purple-600 text-purple-600'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </span>
              </div>
              <div className="flex flex-col text-sm">
                <span
                  className={`font-medium ${
                    step.id <= currentStep ? 'text-purple-600' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
                <span className="text-gray-500 text-xs">{step.description}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;
