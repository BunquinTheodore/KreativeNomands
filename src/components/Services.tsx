'use client';

import { motion } from 'framer-motion';
import { Palette, Video, BarChart3, ArrowRight, Monitor, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SlideUp, StaggerContainer, StaggerItem } from '@/lib/animations';
import { useTheme } from '@/lib/theme-context';

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
  {
    id: 'it-services',
    icon: Monitor,
    title: 'Nomads for IT Services',
    description: 'Comprehensive technology solutions to power your digital transformation and drive innovation.',
    features: [
      'Web & mobile development',
      'Cloud infrastructure',
      'Cybersecurity solutions',
      'IT consulting & support',
    ],
    color: 'secondary',
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
  const { theme } = useTheme();
  
  return (
    <section
      id="services"
      className={cn(
        'relative py-20 sm:py-28 lg:py-32 overflow-hidden',
        theme === 'dark' ? 'bg-dark-900' : 'bg-white'
      )}
      aria-labelledby="services-heading"
    >
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-secondary-500/5 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header with enhanced animation */}
        <SlideUp className="text-center mb-16 sm:mb-20">
          <motion.span 
            className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-medium rounded-full border',
              theme === 'dark'
                ? 'text-primary-400 bg-primary-500/10 border-primary-500/20'
                : 'text-primary-600 bg-primary-500/10 border-primary-500/25'
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Sparkles className="w-4 h-4" />
            What We Do
          </motion.span>
          <motion.h2
            id="services-heading"
            className={cn(
              'text-3xl sm:text-4xl lg:text-display-md font-display font-bold mb-6',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our <span className="gradient-text">Solutions</span>
          </motion.h2>
          <motion.p 
            className={cn(
              'text-lg max-w-2xl mx-auto',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Comprehensive creative services tailored to elevate your brand and drive results.
          </motion.p>
        </SlideUp>

        {/* Services Grid with enhanced cards */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 lg:mb-28">
          {services.map((service, index) => (
            <StaggerItem key={service.id}>
              <motion.div
                className={cn(
                  'h-full p-7 rounded-3xl border transition-all duration-500 group relative overflow-hidden',
                  theme === 'dark'
                    ? 'bg-dark-950/50 border-primary-500/10 hover:border-primary-500/40'
                    : 'bg-white border-gray-200 hover:border-primary-300 shadow-sm hover:shadow-lg'
                )}
                whileHover={{ 
                  y: -8, 
                  boxShadow: theme === 'dark' 
                    ? '0 25px 50px rgba(61, 90, 90, 0.2)'
                    : '0 25px 50px rgba(61, 90, 90, 0.15)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Hover gradient with animation */}
                <motion.div 
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    theme === 'dark'
                      ? 'from-primary-500/10 via-transparent to-secondary-500/5'
                      : 'from-primary-100/50 via-transparent to-secondary-100/30'
                  )}
                />
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 shimmer" />
                </div>
                
                <div className="relative">
                  {/* Icon with animation */}
                  <motion.div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300',
                      theme === 'dark'
                        ? 'bg-primary-500/15 group-hover:bg-primary-500/25'
                        : 'bg-primary-50 group-hover:bg-primary-100'
                    )}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <service.icon className={cn(
                      "w-7 h-7",
                      theme === 'dark' ? 'text-primary-400' : 'text-primary-600'
                    )} />
                  </motion.div>

                  {/* Content */}
                  <h3 className={cn(
                    "text-lg font-display font-semibold mb-3 group-hover:text-primary-300 transition-colors",
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {service.title}
                  </h3>
                  <p className={cn(
                    "mb-5 leading-relaxed text-sm",
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {service.description}
                  </p>

                  {/* Features with stagger animation */}
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        className={cn(
                          "flex items-center gap-2 text-sm transition-colors",
                          theme === 'dark'
                            ? 'text-gray-500 group-hover:text-gray-400'
                            : 'text-gray-600 group-hover:text-gray-700'
                        )}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * featureIndex }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 group-hover:bg-primary-400 transition-colors" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Process Section with enhanced design */}
        <SlideUp className="text-center mb-12">
          <h3 className={cn(
            "text-2xl sm:text-3xl font-display font-semibold mb-4",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            How It <span className="gradient-text">Works</span>
          </h3>
          <p className={cn(
            "max-w-xl mx-auto",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            Our streamlined process ensures a smooth collaboration from start to finish.
          </p>
        </SlideUp>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => (
            <StaggerItem key={step.step}>
              <motion.div 
                className="relative"
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <motion.div 
                    className="hidden lg:block absolute top-8 left-full w-full h-px z-0"
                    style={{
                      background: 'linear-gradient(90deg, rgba(61, 90, 90, 0.5), transparent)'
                    }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                  />
                )}
                
                <div
                  className={cn(
                    'relative p-6 rounded-2xl border transition-all duration-300 group',
                    theme === 'dark'
                      ? 'bg-dark-950/50 border-primary-500/10 hover:border-primary-500/30'
                      : 'bg-white border-gray-200 hover:border-primary-300 shadow-sm hover:shadow-md'
                  )}
                >
                  {/* Glow effect on hover */}
                  <motion.div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: theme === 'dark' ? '0 0 30px rgba(61, 90, 90, 0.15)' : '0 0 30px rgba(61, 90, 90, 0.1)' }}
                  />
                  
                  {/* Step Number with animation */}
                  <motion.div 
                    className={cn(
                      "inline-flex items-center justify-center w-12 h-12 rounded-full font-display font-bold text-lg mb-4 border transition-colors",
                      theme === 'dark'
                        ? 'bg-primary-500/20 text-primary-400 border-primary-500/20 group-hover:border-primary-500/40'
                        : 'bg-primary-50 text-primary-600 border-primary-200 group-hover:border-primary-400'
                    )}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.step}
                  </motion.div>
                  
                  <h4 className={cn(
                    "text-lg font-display font-semibold mb-2 group-hover:text-primary-300 transition-colors",
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {step.title}
                  </h4>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA with enhanced styling */}
        <SlideUp className="text-center mt-16">
          <motion.a
            href="#contact"
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4 rounded-full',
              'bg-primary-500 hover:bg-primary-600 text-white font-semibold',
              'transition-all duration-300',
              'group'
            )}
            style={{ boxShadow: '0 15px 40px rgba(61, 90, 90, 0.35)' }}
            whileHover={{ scale: 1.05, y: -3, boxShadow: '0 20px 50px rgba(61, 90, 90, 0.45)' }}
            whileTap={{ scale: 0.98 }}
          >
            Let&apos;s Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </SlideUp>
      </div>
    </section>
  );
}
