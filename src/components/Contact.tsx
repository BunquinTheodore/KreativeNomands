'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SlideUp, StaggerContainer, StaggerItem } from '@/lib/animations';
import { useTheme } from '@/lib/theme-context';

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

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading' });

    // Simulate form submission
    // In production, replace with actual API call
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
      id="contact"
      className={cn(
        'relative py-20 sm:py-28 lg:py-32 overflow-hidden',
        theme === 'dark' ? 'bg-dark-900' : 'bg-white'
      )}
      aria-labelledby="contact-heading"
    >
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(61, 90, 90, 0.5), transparent)' }}
        />
        <motion.div 
          className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-secondary-500/5 rounded-full blur-[80px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Section Header */}
        <SlideUp className="text-center mb-16">
          <motion.span 
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-medium rounded-full",
              theme === 'dark' 
                ? 'text-primary-400 bg-primary-500/10 border border-primary-500/20'
                : 'text-primary-600 bg-primary-50 border border-primary-200'
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Sparkles className="w-4 h-4" />
            Contact Us
          </motion.span>
          <motion.h2
            id="contact-heading"
            className={cn(
              "text-3xl sm:text-4xl lg:text-display-md font-display font-bold mb-6",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Let&apos;s Get <span className="gradient-text">Started</span>
          </motion.h2>
          <motion.p 
            className={cn(
              "text-lg max-w-2xl mx-auto",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We&apos;re excited to know about your brand and creative needs. 
            Send us an email or fill out the form below.
          </motion.p>
        </SlideUp>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Enhanced Contact Info */}
          <div className="lg:col-span-2">
            <StaggerContainer className="space-y-6">
              {contactInfo.map((item, index) => (
                <StaggerItem key={item.label}>
                  <motion.a
                    href={item.href}
                    target={item.label === 'Location' ? '_blank' : undefined}
                    rel={item.label === 'Location' ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 group',
                      theme === 'dark'
                        ? 'bg-dark-950/50 border-primary-500/10 hover:border-primary-500/30'
                        : 'bg-white border-gray-200 hover:border-primary-300 shadow-sm hover:shadow-md'
                    )}
                    whileHover={{ y: -5, boxShadow: theme === 'dark' ? '0 15px 30px rgba(61, 90, 90, 0.15)' : '0 15px 30px rgba(61, 90, 90, 0.1)' }}
                  >
                    <motion.div 
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                        theme === 'dark'
                          ? 'bg-primary-500/15 group-hover:bg-primary-500/25'
                          : 'bg-primary-50 group-hover:bg-primary-100'
                      )}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className={cn(
                        "w-5 h-5",
                        theme === 'dark' ? 'text-primary-400' : 'text-primary-600'
                      )} />
                    </motion.div>
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
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Enhanced CTA Card */}
            <SlideUp delay={0.3} className="mt-8">
              <motion.div 
                className={cn(
                  "p-6 rounded-2xl border",
                  theme === 'dark'
                    ? 'border-primary-500/20'
                    : 'border-primary-200 bg-gradient-to-br from-primary-50 to-white'
                )}
                style={theme === 'dark' ? { 
                  background: 'linear-gradient(135deg, rgba(61, 90, 90, 0.2) 0%, rgba(45, 69, 69, 0.1) 100%)'
                } : undefined}
                whileHover={{ boxShadow: theme === 'dark' ? '0 20px 40px rgba(61, 90, 90, 0.15)' : '0 20px 40px rgba(61, 90, 90, 0.1)' }}
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
            </SlideUp>
          </div>

          {/* Contact Form */}
          <SlideUp delay={0.2} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className={cn(
                "p-6 sm:p-8 rounded-3xl border",
                theme === 'dark'
                  ? 'bg-dark-950/50 border-white/5'
                  : 'bg-white border-gray-200 shadow-lg'
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
                      'w-full px-4 py-3 rounded-xl border transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                      theme === 'dark'
                        ? 'bg-dark-800 border-white/10 text-white placeholder:text-gray-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400'
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
                      'w-full px-4 py-3 rounded-xl border transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                      theme === 'dark'
                        ? 'bg-dark-800 border-white/10 text-white placeholder:text-gray-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400'
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
                    'w-full px-4 py-3 rounded-xl border transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    theme === 'dark'
                      ? 'bg-dark-800 border-white/10 text-white placeholder:text-gray-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400'
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
                    'w-full px-4 py-3 rounded-xl border resize-none transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    theme === 'dark'
                      ? 'bg-dark-800 border-white/10 text-white placeholder:text-gray-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400'
                  )}
                />
              </div>

              {/* Status Messages */}
              {status.type === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-green-400 text-sm">{status.message}</p>
                </motion.div>
              )}

              {status.type === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400 text-sm">{status.message}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || status.type === 'loading'}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full',
                  'bg-primary-500 hover:bg-primary-600 text-white font-semibold',
                  'transform hover:scale-[1.02] transition-all duration-200',
                  'shadow-lg shadow-primary-500/25',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  theme === 'dark' ? 'focus:ring-offset-dark-950' : 'focus:ring-offset-white'
                )}
              >
                {status.type === 'loading' ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
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
          </SlideUp>
        </div>
      </div>
    </section>
  );
}
