import React from 'react';
import { Brain, Video, BarChart, Shield } from 'lucide-react';

interface HomePageProps {
  onLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLogin }) => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced Emotion Detection',
      description: 'AI-powered analysis of facial expressions, voice tone, and text sentiment to understand emotional states in real-time.'
    },
    {
      icon: Video,
      title: 'Live Supervision',
      description: 'Real-time monitoring of customer service interactions with instant feedback and coaching opportunities.'
    },
    {
      icon: BarChart,
      title: 'Performance Tracking',
      description: 'Comprehensive analytics and reporting on service quality, emotional intelligence, and customer satisfaction metrics.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Enterprise-grade security with full compliance to privacy regulations and ethical AI practices.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F2EFE7]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Transform Customer</span>
                  <span className="block text-[#006A71] xl:inline"> Service with AI</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  EmotionCare AI revolutionizes customer service by providing real-time emotion analysis, 
                  live supervision, and comprehensive performance tracking to enhance customer experiences 
                  and employee development.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button 
                      onClick={onLogin}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#006A71] hover:bg-[#004a51] md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Get Started
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#006A71] bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors border-[#006A71]">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-[#48A6A7] to-[#9ACBD0] sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <Video className="w-24 h-24 mx-auto mb-4 opacity-80" />
              <p className="text-lg font-medium">Live Monitoring Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-[#48A6A7] font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Intelligent Customer Service Solutions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Leverage the power of artificial intelligence to enhance every customer interaction 
              and drive exceptional service experiences.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#006A71] text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#006A71]">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to enhance your</span>
            <span className="block">customer service?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-[#9ACBD0]">
            Join leading organizations who trust EmotionCare AI to deliver exceptional customer experiences.
          </p>
          <button 
            onClick={onLogin}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#006A71] bg-white hover:bg-gray-50 sm:w-auto transition-colors"
          >
            Start Your Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};