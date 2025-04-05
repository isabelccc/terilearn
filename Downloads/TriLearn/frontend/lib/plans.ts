export type PlanType = 'free' | 'basic' | 'business';

export interface Plan {
  name: PlanType;
  title: string;
  description: string;
  price: number;
  maxFiles: number;
  features: string[];
  buttonLabel: string;
  color: string;
  ctaClass: string;
}

export const plans: Plan[] = [
  {
    name: 'free',
    title: 'Free',
    description: 'Try it out with limited features.',
    price: 0,
    maxFiles: 3,
    features: [
      'Up to 3 files',
      'Basic file types supported',
      'Basic AI analysis',
      'Web access only'
    ],
    buttonLabel: 'Start for Free',
    color: 'text-gray-700',
    ctaClass: 'border border-gray-300 hover:bg-gray-100'
  },
  {
    name: 'basic',
    title: 'Basic',
    description: 'Best for personal use.',
    price: 9.9,
    maxFiles: 999,
    features: [
      'Up to 999 files',
      'All file types supported',
      'Advanced AI analysis',
      'Web and mobile access',
      'Priority support'
    ],
    buttonLabel: 'Get Started',
    color: 'text-gray-900',
    ctaClass: 'bg-gray-100 hover:bg-gray-200'
  },
  {
    name: 'business',
    title: 'Business',
    description: 'Best for business owners.',
    price: 39,
    maxFiles: 9999,
    features: [
      'Up to 9,999 files',
      'All file types supported',
      'Premium AI analysis',
      'Web and mobile access',
      'Priority support',
      'Team collaboration',
      'Analytics dashboard',
      'API access'
    ],
    buttonLabel: 'Get Started',
    color: 'text-white',
    ctaClass: 'bg-black hover:bg-gray-800 text-white'
  }
];

export function getPlanByName(planName: PlanType): Plan {
  return plans.find(plan => plan.name === planName) || plans[0];
}

export function getMaxFilesByPlanName(planName: PlanType): number {
  return getPlanByName(planName).maxFiles;
} 