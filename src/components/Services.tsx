'use client';

import { motion } from 'framer-motion';
import { Palette, Video, BarChart3, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SlideUp, StaggerContainer, StaggerItem } from '@/lib/animations';

const services = [
  {
    id: 'content-strategy',
    icon: BarChart3,
    title: 'Nomads for Content Strategy',
    description: 'Driving your brand\'s success with content strategies that captivate based on your current business goals.',
    features: [
      'Brand messaging & positioning',
      'Content calendar planning',
      'Campaign strategy',
      'Social media management',
    ],
    color: 'primary',
  },
  {
    id: 'graphic-design',
    icon: Palette,
    title: 'Nomads for Graphic Design',
    description: 'Transforming your vision into stunning visual experiences that leave a lasting impression.',
    features: [
      'Brand identity design',
      'Social media graphics',
      'Marketing collaterals',
      'Presentation design',
    ],
    color: 'secondary',
  },
  {
    id: 'post-production',
    icon: Video,
    title: 'Nomads for Photo & Video Post-Production',
    description: 'Elevating your visuals with meticulous post-production to create captivating imagery and engaging videos.',
    features: [
      'Video editing & color grading',
      'Photo retouching & enhancement',
      'Motion graphics',
      'Real estate photo editing',
    ],
    color: 'primary',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Introduce Your Brand',
    description: 'Tell us everything about your brand and creative needs, goals, and vision.',
  },
  {
    step: '02',
    title: 'Project Detail Finalization',
    description: 'Complete the brief form or schedule a meeting. Provide all brand and project assets.',
  },
  {
    step: '03',
    title: 'Project Pitch & Test',
    description: 'Once confirmed, invite us for a project pitch or test if necessary.',
  },
  {
    step: '04',
    title: 'Project Execution',
    description: 'Sit back and wait for drafts within the agreed timeline while focusing on your business.',
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-20 sm:py-28 lg:py-32 bg-dark-900"
      aria-labelledby="services-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <SlideUp className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20">
            What We Do
          </span>
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl lg:text-display-md font-display font-bold text-white mb-6"
          >
            Our Solutions
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive creative services tailored to elevate your brand and drive results.
          </p>
        </SlideUp>

        {/* Services Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 lg:mb-28">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <div
                className={cn(
                  'h-full p-8 rounded-3xl bg-dark-950/50 border border-white/5',
                  'hover:border-primary-500/30 transition-all duration-300',
                  'group relative overflow-hidden'
                )}
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center mb-6',
                      'bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors'
                    )}
                  >
                    <service.icon className="w-7 h-7 text-primary-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-semibold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Process Section */}
        <SlideUp className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-display font-semibold text-white mb-4">
            How It Works
          </h3>
          <p className="text-gray-400 max-w-xl mx-auto">
            Our streamlined process ensures a smooth collaboration from start to finish.
          </p>
        </SlideUp>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => (
            <StaggerItem key={step.step}>
              <div className="relative">
                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary-500/50 to-transparent z-0" />
                )}
                
                <div
                  className={cn(
                    'relative p-6 rounded-2xl bg-dark-950/30 border border-white/5',
                    'hover:border-primary-500/20 transition-colors duration-300'
                  )}
                >
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-500/20 text-primary-400 font-display font-bold text-lg mb-4">
                    {step.step}
                  </div>
                  
                  <h4 className="text-lg font-display font-semibold text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <SlideUp className="text-center mt-16">
          <a
            href="#contact"
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4 rounded-full',
              'bg-primary-500 hover:bg-primary-600 text-white font-semibold',
              'transform hover:scale-105 transition-all duration-200',
              'shadow-lg shadow-primary-500/25',
              'group'
            )}
          >
            Let&apos;s Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </SlideUp>
      </div>
    </section>
  );
}
