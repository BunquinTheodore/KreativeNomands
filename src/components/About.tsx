'use client';

import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, Compass, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SlideUp, StaggerContainer, StaggerItem } from '@/lib/animations';
import { useTheme } from '@/lib/theme-context';

const stats = [
  { value: '2023', label: 'Established' },
  { value: '50+', label: 'Projects Delivered' },
  { value: '20+', label: 'Happy Clients' },
  { value: '6+', label: 'Industries Served' },
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
  const { theme } = useTheme();
  
  return (
    <section
      id="about"
      className={cn(
        'relative py-20 sm:py-28 lg:py-32 overflow-hidden',
        theme === 'dark' ? 'bg-dark-950' : 'bg-gray-50'
      )}
      aria-labelledby="about-heading"
    >
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(61, 90, 90, 0.5), transparent)'
          }}
        />
        <motion.div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-primary-500/5 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 left-0 w-[300px] h-[300px] rounded-full bg-secondary-500/5 blur-[80px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
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
            Who We Are
          </motion.span>
          <motion.h2
            id="about-heading"
            className={cn(
              'text-3xl sm:text-4xl lg:text-display-md font-display font-bold mb-6',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We Are <span className="gradient-text">Kreativ Nomads</span>
          </motion.h2>
          <motion.p 
            className={cn(
              'text-lg max-w-3xl mx-auto',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Established in 2023, Kreativ Nomads is a creative agency comprised of
            experienced freelancers who are passionate about providing fresh and compelling
            creative assistance to address the marketing and communication challenges of
            our clients, wherever and whenever they arise.
          </motion.p>
        </SlideUp>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Left: Image/Visual with enhanced design */}
          <SlideUp className="order-2 lg:order-1">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-dark-800 border border-primary-500/10">
                {/* Animated gradient background */}
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(61, 90, 90, 0.2) 0%, rgba(45, 69, 69, 0.2) 50%, rgba(66, 143, 134, 0.2) 100%)',
                    backgroundSize: '200% 200%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="text-center p-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div 
                      className="w-28 h-28 mx-auto mb-4 rounded-full flex items-center justify-center border-2 border-primary-500/30"
                      style={{ background: 'linear-gradient(135deg, rgba(61, 90, 90, 0.3) 0%, rgba(45, 69, 69, 0.2) 100%)' }}
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(61, 90, 90, 0.2)',
                          '0 0 40px rgba(61, 90, 90, 0.4)',
                          '0 0 20px rgba(61, 90, 90, 0.2)',
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <span className="text-4xl font-display font-bold gradient-text">KN</span>
                    </motion.div>
                    <p className={cn(
                      "text-sm",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>Creative Agency</p>
                  </motion.div>
                </div>
              </div>
              
              {/* Enhanced decorative elements */}
              <motion.div 
                className="absolute -bottom-4 -right-4 w-28 h-28 border-2 border-primary-500/30 rounded-2xl -z-10"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="absolute -top-4 -left-4 w-20 h-20 bg-primary-500/10 rounded-xl -z-10"
                animate={{ rotate: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </SlideUp>

          {/* Right: Vision & Mission with enhanced design */}
          <div className="order-1 lg:order-2 space-y-8">
            <SlideUp delay={0.1}>
              <motion.div 
                className={cn(
                  'p-6 rounded-2xl border transition-all duration-300 group',
                  theme === 'dark'
                    ? 'bg-dark-900/50 border-primary-500/10 hover:border-primary-500/30'
                    : 'bg-white border-primary-500/15 hover:border-primary-500/30 hover:shadow-lg'
                )}
                whileHover={{ y: -5, boxShadow: theme === 'dark' ? '0 20px 40px rgba(61, 90, 90, 0.15)' : '0 20px 40px rgba(61, 90, 90, 0.12)' }}
              >
                <h3 className={cn(
                  'text-xl font-display font-semibold mb-3 flex items-center gap-3',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  <motion.span 
                    className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Target className="w-5 h-5 text-primary-400" />
                  </motion.span>
                  Our Vision
                </h3>
                <p className={cn(
                  'leading-relaxed',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  To become the foremost creative services provider for local and international businesses.
                </p>
              </motion.div>
            </SlideUp>

            <SlideUp delay={0.2}>
              <motion.div 
                className={cn(
                  'p-6 rounded-2xl border transition-all duration-300 group',
                  theme === 'dark'
                    ? 'bg-dark-900/50 border-primary-500/10 hover:border-primary-500/30'
                    : 'bg-white border-primary-500/15 hover:border-primary-500/30 hover:shadow-lg'
                )}
                whileHover={{ y: -5, boxShadow: theme === 'dark' ? '0 20px 40px rgba(61, 90, 90, 0.15)' : '0 20px 40px rgba(61, 90, 90, 0.12)' }}
              >
                <h3 className={cn(
                  'text-xl font-display font-semibold mb-3 flex items-center gap-3',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  <motion.span 
                    className="w-10 h-10 rounded-lg bg-secondary-500/20 flex items-center justify-center group-hover:bg-secondary-500/30 transition-colors"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Compass className="w-5 h-5 text-secondary-400" />
                  </motion.span>
                  Our Mission
                </h3>
                <p className={cn(
                  'leading-relaxed',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  To go beyond mere ideas, elevating businesses and the quality of freelancers 
                  in the Philippines. We empower them all to continuously strive for their North Stars.
                </p>
              </motion.div>
            </SlideUp>
          </div>
        </div>

        {/* Stats with enhanced animation */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <StaggerItem key={stat.label}>
              <motion.div 
                className={cn(
                  "text-center p-6 rounded-2xl border transition-all duration-300",
                  theme === 'dark'
                    ? 'bg-dark-900/30 border-primary-500/10 hover:border-primary-500/30'
                    : 'bg-white border-gray-200 hover:border-primary-300 shadow-sm'
                )}
                whileHover={{ 
                  y: -5, 
                  boxShadow: theme === 'dark' ? '0 15px 30px rgba(61, 90, 90, 0.15)' : '0 15px 30px rgba(61, 90, 90, 0.1)'
                }}
              >
                <motion.div 
                  className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 200, 
                    delay: index * 0.1 
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className={cn(
                  "text-sm",
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                )}>{stat.label}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Values with enhanced design */}
        <SlideUp>
          <h3 className={cn(
            "text-2xl font-display font-semibold text-center mb-10",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            What Sets Us <span className="gradient-text">Apart</span>
          </h3>
        </SlideUp>
        
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <StaggerItem key={value.title}>
              <motion.div
                className={cn(
                  'h-full p-6 rounded-2xl border transition-all duration-300 group',
                  theme === 'dark'
                    ? 'bg-dark-900/50 border-primary-500/10 hover:border-primary-500/30'
                    : 'bg-white border-gray-200 hover:border-primary-300 shadow-sm'
                )}
                whileHover={{ 
                  y: -8, 
                  boxShadow: theme === 'dark' ? '0 20px 40px rgba(61, 90, 90, 0.15)' : '0 20px 40px rgba(61, 90, 90, 0.1)'
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div 
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                    theme === 'dark'
                      ? 'bg-primary-500/15 group-hover:bg-primary-500/25'
                      : 'bg-primary-50 group-hover:bg-primary-100'
                  )}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <value.icon className={cn(
                    "w-6 h-6",
                    theme === 'dark' ? 'text-primary-400' : 'text-primary-600'
                  )} />
                </motion.div>
                <h4 className={cn(
                  "text-lg font-display font-semibold mb-2 group-hover:text-primary-300 transition-colors",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {value.title}
                </h4>
                <p className={cn(
                  "text-sm leading-relaxed",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {value.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
