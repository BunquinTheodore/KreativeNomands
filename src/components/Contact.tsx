'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';
import Image from 'next/image';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@kreativnomads.com.ph',
    href: 'mailto:contact@kreativnomads.com.ph',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+63 917 312 5071',
    href: 'tel:+639173125071',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: '2404 Discovery Suites, ADB Avenue, Ortigas Center, Pasig City',
    href: 'https://maps.google.com/?q=Discovery+Suites+Ortigas',
  },
];

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

// Simple fade animation
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const bgLogo1Y = useTransform(scrollYProgress, [0, 1], ['50px', '-80px']);
  const bgLogo2Y = useTransform(scrollYProgress, [0, 1], ['80px', '-50px']);
  const bgLogo3Y = useTransform(scrollYProgress, [0, 1], ['30px', '-100px']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus({
        type: 'success',
        message: 'Thank you! We\'ll get back to you soon.',
      });
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch {
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
    }
  };

  const isFormValid = formData.name && formData.email && formData.message;
  const { theme } = useTheme();

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={cn(
        'relative py-20 sm:py-28 lg:py-32 overflow-hidden',
        theme === 'dark' ? 'bg-dark-900/80' : 'bg-cream-300/80'
      )}
      aria-labelledby="contact-heading"
    >
      {/* Parallax Background Elements */}
      <motion.div
        className="absolute top-[15%] right-[8%] w-36 h-36 opacity-[0.04] pointer-events-none"
        style={{ y: bgLogo1Y }}
      >
        <Image
          src="/logos/North-Star-Icon-Green_Kreativ-Nomads.png"
          alt=""
          fill
          sizes="144px"
          className="object-contain"
        />
      </motion.div>
      
      <motion.div
        className="absolute bottom-[25%] left-[5%] w-28 h-28 opacity-[0.04] pointer-events-none"
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
        className="absolute top-[40%] left-[45%] w-48 h-48 opacity-[0.025] pointer-events-none"
        style={{ y: bgLogo3Y }}
      >
        <Image
          src="/logos/Two-Line-Logo_Green.png"
          alt=""
          fill
          sizes="192px"
          className="object-contain"
        />
      </motion.div>

      {/* Simple gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span 
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-medium rounded-full",
              theme === 'dark' 
                ? 'text-primary-400 bg-primary-500/10 border border-primary-500/20'
                : 'text-primary-600 bg-primary-50 border border-primary-200'
            )}
          >
            <Sparkles className="w-4 h-4" />
            Contact Us
          </span>
          <h2
            id="contact-heading"
            className={cn(
              "text-3xl sm:text-4xl lg:text-display-md font-display font-bold mb-6",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
          >
            Let&apos;s Get <span className="gradient-text">Started</span>
          </h2>
          <p 
            className={cn(
              "text-lg max-w-2xl mx-auto",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}
          >
            We&apos;re excited to know about your brand and creative needs. 
            Send us an email or fill out the form below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.label === 'Location' ? '_blank' : undefined}
                  rel={item.label === 'Location' ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'flex items-start gap-4 p-5 rounded-2xl border transition-colors duration-300 group',
                    theme === 'dark'
                      ? 'bg-dark-950/50 border-primary-500/10 hover:border-primary-500/30'
                      : 'bg-cream-100 border-cream-400 hover:border-secondary-300'
                  )}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.1 } }
                  }}
                >
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                      theme === 'dark'
                        ? 'bg-primary-500/15 group-hover:bg-primary-500/25'
                        : 'bg-primary-50 group-hover:bg-primary-100'
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5",
                      theme === 'dark' ? 'text-primary-400' : 'text-primary-600'
                    )} />
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm mb-1",
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    )}>{item.label}</p>
                    <p className={cn(
                      "font-medium group-hover:text-primary-400 transition-colors",
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* CTA Card */}
            <motion.div 
              className={cn(
                "mt-8 p-6 rounded-2xl border",
                theme === 'dark'
                  ? 'border-primary-500/20 bg-gradient-to-br from-primary-500/10 to-primary-500/5'
                  : 'border-primary-200 bg-gradient-to-br from-primary-50 to-white'
              )}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h3 className={cn(
                "text-lg font-display font-semibold mb-2",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                Ready to elevate your brand?
              </h3>
              <p className={cn(
                "text-sm mb-4",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                Schedule a free consultation call to discuss your creative needs.
              </p>
              <a
                href="mailto:contact@kreativnomads.com.ph?subject=Consultation%20Request"
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-medium',
                  'hover:text-primary-300 transition-colors group',
                  theme === 'dark' ? 'text-primary-400' : 'text-primary-600'
                )}
              >
                Book a Call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <form
              onSubmit={handleSubmit}
              className={cn(
                "p-6 sm:p-8 rounded-3xl border",
                theme === 'dark'
                  ? 'bg-dark-950/50 border-white/5'
                  : 'bg-cream-100 border-cream-400'
              )}
            >
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className={cn(
                      "block text-sm font-medium mb-2",
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    Full Name <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border transition-colors duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent',
                      theme === 'dark'
                        ? 'bg-dark-800 border-white/10 text-white placeholder:text-gray-500'
                        : 'bg-cream-50 border-cream-400 text-gray-900 placeholder:text-gray-400'
                    )}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className={cn(
                      "block text-sm font-medium mb-2",
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}
                  >
                    Email Address <span className="text-primary-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@company.com"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border transition-colors duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent',
                      theme === 'dark'
                        ? 'bg-dark-800 border-white/10 text-white placeholder:text-gray-500'
                        : 'bg-cream-50 border-cream-400 text-gray-900 placeholder:text-gray-400'
                    )}
                  />
                </div>
              </div>

              {/* Company */}
              <div className="mb-5">
                <label
                  htmlFor="company"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  Company / Brand
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company Name"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent',
                    theme === 'dark'
                      ? 'bg-dark-800 border-white/10 text-white placeholder:text-gray-500'
                      : 'bg-cream-50 border-cream-400 text-gray-900 placeholder:text-gray-400'
                  )}
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  Tell us about your project <span className="text-primary-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe your creative needs, goals, and timeline..."
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border resize-none transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent',
                    theme === 'dark'
                      ? 'bg-dark-800 border-white/10 text-white placeholder:text-gray-500'
                      : 'bg-cream-50 border-cream-400 text-gray-900 placeholder:text-gray-400'
                  )}
                />
              </div>

              {/* Status Messages */}
              {status.type === 'success' && (
                <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-green-400 text-sm">{status.message}</p>
                </div>
              )}

              {status.type === 'error' && (
                <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400 text-sm">{status.message}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || status.type === 'loading'}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full',
                  'bg-secondary-500 hover:bg-secondary-600 text-white font-semibold',
                  'transition-all duration-200 hover:-translate-y-0.5',
                  'shadow-lg hover:shadow-xl',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
                  'focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2',
                  theme === 'dark' ? 'focus:ring-offset-dark-950' : 'focus:ring-offset-cream-500'
                )}
              >
                {status.type === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
