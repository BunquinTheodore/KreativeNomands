'use client';

import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SlideUp, StaggerContainer, StaggerItem } from '@/lib/animations';

const stats = [
  { value: '2023', label: 'Established' },
  { value: '50+', label: 'Projects Delivered' },
  { value: '20+', label: 'Happy Clients' },
  { value: '5+', label: 'Industries Served' },
];

const values = [
  {
    icon: Compass,
    title: 'Your North Star',
    description: 'We prioritize your business goals and assist you in navigating every stage of your journey.',
  },
  {
    icon: Lightbulb,
    title: 'Creative Excellence',
    description: 'Fresh and compelling creative solutions that address your marketing challenges.',
  },
  {
    icon: Users,
    title: 'Collaboration First',
    description: 'Strong communication with clients and freelancers sets us apart from other agencies.',
  },
  {
    icon: Target,
    title: 'Results Driven',
    description: 'We go beyond mere ideas, elevating businesses through strategic creative work.',
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative py-20 sm:py-28 lg:py-32 bg-dark-950"
      aria-labelledby="about-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <SlideUp className="text-center mb-16 sm:mb-20">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20">
            Who We Are
          </span>
          <h2
            id="about-heading"
            className="text-3xl sm:text-4xl lg:text-display-md font-display font-bold text-white mb-6"
          >
            We Are Kreativ Nomads
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Established in 2023, Kreativ Nomads is a creative agency comprised of
            experienced freelancers who are passionate about providing fresh and compelling
            creative assistance to address the marketing and communication challenges of
            our clients, wherever and whenever they arise.
          </p>
        </SlideUp>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Left: Image/Visual */}
          <SlideUp className="order-2 lg:order-1">
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-dark-800">
                {/* Placeholder for team/agency image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <span className="text-4xl font-display font-bold text-primary-400">KN</span>
                    </div>
                    <p className="text-gray-400 text-sm">Creative Agency</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-primary-500/30 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-500/10 rounded-xl -z-10" />
            </div>
          </SlideUp>

          {/* Right: Vision & Mission */}
          <div className="order-1 lg:order-2 space-y-8">
            <SlideUp delay={0.1}>
              <div className="p-6 rounded-2xl bg-dark-900/50 border border-white/5">
                <h3 className="text-xl font-display font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary-400" />
                  </span>
                  Our Vision
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  To become the foremost creative services provider for local and international businesses.
                </p>
              </div>
            </SlideUp>

            <SlideUp delay={0.2}>
              <div className="p-6 rounded-2xl bg-dark-900/50 border border-white/5">
                <h3 className="text-xl font-display font-semibold text-white mb-3 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-secondary-400" />
                  </span>
                  Our Mission
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  To go beyond mere ideas, elevating businesses and the quality of freelancers 
                  in the Philippines. We empower them all to continuously strive for their North Stars.
                </p>
              </div>
            </SlideUp>
          </div>
        </div>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="text-center p-6 rounded-2xl bg-dark-900/30 border border-white/5">
                <div className="text-3xl sm:text-4xl font-display font-bold text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Values */}
        <SlideUp>
          <h3 className="text-2xl font-display font-semibold text-white text-center mb-10">
            What Sets Us Apart
          </h3>
        </SlideUp>
        
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <StaggerItem key={value.title}>
              <div
                className={cn(
                  'h-full p-6 rounded-2xl bg-dark-900/50 border border-white/5',
                  'hover:border-primary-500/30 transition-colors duration-300',
                  'group'
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <value.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h4 className="text-lg font-display font-semibold text-white mb-2">
                  {value.title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
