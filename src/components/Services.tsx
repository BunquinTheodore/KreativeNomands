'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Palette, Video, BarChart3, ArrowRight, Monitor, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';
import Image from 'next/image';

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

// Simple fade animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Services() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const bgLogo1Y = useTransform(scrollYProgress, [0, 1], ['80px', '-120px']);
  const bgLogo2Y = useTransform(scrollYProgress, [0, 1], ['40px', '-80px']);
  const bgLogo3Y = useTransform(scrollYProgress, [0, 1], ['100px', '-60px']);
  
  return (
    <section
      ref={sectionRef}
      id="services"
      className={cn(
        'relative py-20 sm:py-28 lg:py-32 overflow-hidden',
        theme === 'dark' ? 'bg-dark-900/80' : 'bg-cream-300/80'
      )}
      aria-labelledby="services-heading"
    >
      {/* Parallax Background Elements */}
      <motion.div
        className="absolute top-[5%] left-[8%] w-36 h-36 opacity-[0.04] pointer-events-none"
        style={{ y: bgLogo1Y }}
      >
        <Image
          src="/logos/North-Star-Icon-Black_Kreativ-Nomads.png"
          alt=""
          fill
          sizes="144px"
          className="object-contain"
        />
      </motion.div>
      
      <motion.div
        className="absolute top-[30%] right-[5%] w-28 h-28 opacity-[0.04] pointer-events-none"
        style={{ y: bgLogo2Y }}
      >
        <Image
          src="/logos/North-Star-Icon-Yellow_Kreativ-Nomads.png"
          alt=""
          fill
          sizes="112px"
          className="object-contain"
        />
      </motion.div>
      
      <motion.div
        className="absolute bottom-[15%] left-[50%] w-44 h-44 opacity-[0.03] pointer-events-none"
        style={{ y: bgLogo3Y }}
      >
        <Image
          src="/logos/Two-Line-Logo_Green.png"
          alt=""
          fill
          sizes="176px"
          className="object-contain"
        />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 sm:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span 
            className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-medium rounded-full border',
              theme === 'dark'
                ? 'text-primary-400 bg-primary-500/10 border-primary-500/20'
                : 'text-primary-600 bg-primary-500/10 border-primary-500/25'
            )}
          >
            <Sparkles className="w-4 h-4" />
            What We Do
          </span>
          <h2
            id="services-heading"
            className={cn(
              'text-3xl sm:text-4xl lg:text-display-md font-display font-bold mb-6',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
          >
            Our <span className="gradient-text">Solutions</span>
          </h2>
          <p 
            className={cn(
              'text-lg max-w-2xl mx-auto',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            Comprehensive creative services tailored to elevate your brand and drive results.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 lg:mb-28">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.1 } }
              }}
              className={cn(
                'h-full p-7 rounded-3xl border transition-colors duration-300 group',
                theme === 'dark'
                  ? 'bg-dark-950/50 border-primary-500/10 hover:border-primary-500/40'
                  : 'bg-cream-100 border-cream-400 hover:border-secondary-300'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300',
                  theme === 'dark'
                    ? 'bg-primary-500/15 group-hover:bg-primary-500/25'
                    : 'bg-primary-50 group-hover:bg-primary-100'
                )}
              >
                <service.icon className={cn(
                  "w-7 h-7",
                  theme === 'dark' ? 'text-primary-400' : 'text-primary-600'
                )} />
              </div>

              {/* Content */}
              <h3 className={cn(
                "text-lg font-display font-semibold mb-3 transition-colors",
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

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
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
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => (
            <motion.div 
              key={step.step}
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.1 } }
              }}
            >
              {/* Connector Line */}
              {index < processSteps.length - 1 && (
                <div 
                  className="hidden lg:block absolute top-8 left-full w-full h-px z-0 bg-gradient-to-r from-primary-500/30 to-transparent"
                />
              )}
              
              <div
                className={cn(
                  'relative p-6 rounded-2xl border transition-colors duration-300 group',
                  theme === 'dark'
                    ? 'bg-dark-950/50 border-primary-500/10 hover:border-primary-500/30'
                    : 'bg-cream-100 border-cream-400 hover:border-secondary-300'
                )}
              >
                {/* Step Number */}
                <div 
                  className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-full font-display font-bold text-lg mb-4 border transition-colors",
                    theme === 'dark'
                      ? 'bg-primary-500/20 text-primary-400 border-primary-500/20 group-hover:border-primary-500/40'
                      : 'bg-primary-50 text-primary-600 border-primary-200 group-hover:border-primary-400'
                  )}
                >
                  {step.step}
                </div>
                
                <h4 className={cn(
                  "text-lg font-display font-semibold mb-2 transition-colors",
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
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <a
            href="#contact"
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4 rounded-full',
              'bg-secondary-500 hover:bg-secondary-600 text-white font-semibold',
              'transition-all duration-300 hover:-translate-y-1',
              'group shadow-lg hover:shadow-xl'
            )}
          >
            Let&apos;s Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
