'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SlideUp, StaggerContainer, StaggerItem } from '@/lib/animations';

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

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-28 lg:py-32 bg-dark-900"
      aria-labelledby="contact-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <SlideUp className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20">
            Contact Us
          </span>
          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl lg:text-display-md font-display font-bold text-white mb-6"
          >
            Let&apos;s Get Started
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We&apos;re excited to know about your brand and creative needs. 
            Send us an email or fill out the form below.
          </p>
        </SlideUp>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <StaggerContainer className="space-y-6">
              {contactInfo.map((item) => (
                <StaggerItem key={item.label}>
                  <a
                    href={item.href}
                    target={item.label === 'Location' ? '_blank' : undefined}
                    rel={item.label === 'Location' ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'flex items-start gap-4 p-5 rounded-2xl bg-dark-950/50 border border-white/5',
                      'hover:border-primary-500/30 transition-colors duration-300 group'
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                      <p className="text-white font-medium group-hover:text-primary-400 transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* CTA Card */}
            <SlideUp delay={0.3} className="mt-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/20">
                <h3 className="text-lg font-display font-semibold text-white mb-2">
                  Ready to elevate your brand?
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Schedule a free consultation call to discuss your creative needs.
                </p>
                <a
                  href="mailto:contact@kreativnomads.com.ph?subject=Consultation%20Request"
                  className={cn(
                    'inline-flex items-center gap-2 text-sm font-medium text-primary-400',
                    'hover:text-primary-300 transition-colors group'
                  )}
                >
                  Book a Call
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </SlideUp>
          </div>

          {/* Contact Form */}
          <SlideUp delay={0.2} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-3xl bg-dark-950/50 border border-white/5"
            >
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
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
                      'w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/10',
                      'text-white placeholder:text-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                      'transition-all duration-200'
                    )}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
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
                      'w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/10',
                      'text-white placeholder:text-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                      'transition-all duration-200'
                    )}
                  />
                </div>
              </div>

              {/* Company */}
              <div className="mb-5">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-300 mb-2"
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
                    'w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/10',
                    'text-white placeholder:text-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200'
                  )}
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2"
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
                    'w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/10',
                    'text-white placeholder:text-gray-500 resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                    'transition-all duration-200'
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
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-950'
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
