'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Target, Lightbulb, Users, Compass, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
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

// Simple fade animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function About() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms for floating elements
  const bgLogo1Y = useTransform(scrollYProgress, [0, 1], ['50px', '-100px']);
  const bgLogo2Y = useTransform(scrollYProgress, [0, 1], ['100px', '-50px']);
  const bgLogo3Y = useTransform(scrollYProgress, [0, 1], ['0px', '-150px']);
  
  return (
    <section
      ref={sectionRef}
      id="about"
      className={cn(
        'relative py-20 sm:py-28 lg:py-32 overflow-hidden',
        theme === 'dark' ? 'bg-dark-950/80' : 'bg-cream-400/60'
      )}
      aria-labelledby="about-heading"
    >
      {/* Parallax Background Elements */}
      <motion.div
        className="absolute top-[10%] right-[5%] w-40 h-40 opacity-5 pointer-events-none"
        style={{ y: bgLogo1Y }}
      >
        <Image
          src="/logos/North-Star-Icon-Green_Kreativ-Nomads.png"
          alt=""
          fill
          sizes="160px"
          className="object-contain"
        />
      </motion.div>
      
      <motion.div
        className="absolute bottom-[20%] left-[3%] w-32 h-32 opacity-5 pointer-events-none"
        style={{ y: bgLogo2Y }}
      >
        <Image
          src="/logos/North-Star-Icon-Yellow_Kreativ-Nomads.png"
          alt=""
          fill
          sizes="128px"
          className="object-contain"
        />
      </motion.div>
      
      <motion.div
        className="absolute top-[40%] left-[50%] w-48 h-48 opacity-[0.03] pointer-events-none"
        style={{ y: bgLogo3Y }}
      >
        <Image
          src="/logos/Three-Line-Logo_Green.png"
          alt=""
          fill
          sizes="192px"
          className="object-contain"
        />
      </motion.div>

      {/* Simple gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

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
            Who We Are
          </span>
          <h2
            id="about-heading"
            className={cn(
              'text-3xl sm:text-4xl lg:text-display-md font-display font-bold mb-6',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
          >
            We Are <span className="gradient-text">Kreativ Nomads</span>
          </h2>
          <p 
            className={cn(
              'text-lg max-w-6xl mx-auto',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            Established in 2023, Kreativ Nomads is a creative agency comprised of
            experienced freelancers who are passionate about providing fresh and compelling
            creative assistance to address the marketing and communication challenges of
            our clients, wherever and whenever they arise.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch mb-12">
          {/* Left: Image */}
          <motion.div 
            className="lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src='/logos/Social-Media-DP-Green-BG.png'
                  alt="Kreativ Nomads - Creative Agency"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Simple decorative elements - no animation */}
              <div className="absolute -bottom-4 -right-4 w-28 h-28 border-2 border-primary-500/30 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-500/10 rounded-xl -z-10" />
            </div>
          </motion.div>

          {/* Right: Vision, Mission & Stats */}
          <div className="lg:order-2 flex flex-col space-y-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div 
                className={cn(
                  'p-5 rounded-xl border transition-colors duration-300 group',
                  theme === 'dark'
                    ? 'bg-dark-900/50 border-primary-500/10 hover:border-primary-500/30'
                    : 'bg-white border-primary-500/15 hover:border-primary-500/30'
                )}
              >
                <h3 className={cn(
                  'text-lg font-display font-semibold mb-2 flex items-center gap-3',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  <span className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary-400" />
                  </span>
                  Our Vision
                </h3>
                <p className={cn(
                  'leading-relaxed',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  To become the foremost creative services provider for local and international businesses.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div 
                className={cn(
                  'p-5 rounded-xl border transition-colors duration-300 group',
                  theme === 'dark'
                    ? 'bg-dark-900/50 border-primary-500/10 hover:border-primary-500/30'
                    : 'bg-white border-primary-500/15 hover:border-primary-500/30'
                )}
              >
                <h3 className={cn(
                  'text-lg font-display font-semibold mb-2 flex items-center gap-3',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  <span className="w-9 h-9 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                    <Compass className="w-4 h-4 text-secondary-400" />
                  </span>
                  Our Mission
                </h3>
                <p className={cn(
                  'leading-relaxed',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  To go beyond mere ideas, elevating businesses and the quality of freelancers 
                  in the Philippines. We empower them all to continuously strive for their North Stars.
                </p>
              </div>
            </motion.div>

            {/* Stats - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1 flex-grow">
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.1 } }
                  }}
                  className={cn(
                    "text-center p-4 rounded-lg border transition-colors duration-300 flex flex-col justify-center",
                    theme === 'dark'
                      ? 'bg-dark-900/30 border-primary-500/10 hover:border-primary-500/30'
                      : 'bg-white border-primary-500/15 hover:border-secondary-300'
                  )}
                >
                  <div className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className={cn(
                    "text-xs sm:text-sm",
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  )}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <motion.div
          className="mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className={cn(
            "text-2xl font-display font-semibold text-center mb-10",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            What Sets Us <span className="gradient-text">Apart</span>
          </h3>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.1 } }
              }}
              className={cn(
                'h-full p-6 rounded-2xl border transition-colors duration-300 group',
                theme === 'dark'
                  ? 'bg-dark-900/50 border-primary-500/10 hover:border-primary-500/30'
                  : 'bg-cream-100 border-cream-400 hover:border-secondary-300'
              )}
            >
              <div 
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                  theme === 'dark'
                    ? 'bg-primary-500/15 group-hover:bg-primary-500/25'
                    : 'bg-primary-50 group-hover:bg-primary-100'
                )}
              >
                <value.icon className={cn(
                  "w-6 h-6",
                  theme === 'dark' ? 'text-primary-400' : 'text-primary-600'
                )} />
              </div>
              <h4 className={cn(
                "text-lg font-display font-semibold mb-2 transition-colors",
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
          ))}
        </div>
      </div>
    </section>
  );
}
