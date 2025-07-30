
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, AlertCircle } from 'lucide-react';
import { ContactFormData } from '@/lib/types';

interface ContactFormProps {
  selectedService?: string;
}

export function ContactForm({ selectedService }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    serviceType: selectedService || '',
    subject: '',
    message: '',
    budget: '',
    timeline: '',
    experience: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'success-pending' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const serviceTypes = [
    { value: 'game-development', label: 'Full-Cycle Development' },
    { value: 'game-acquisition', label: 'Game Acquisition & Buyouts' },
    { value: 'growth-services', label: 'Growth & Live Operations' },
    { value: 'developer-recruitment', label: 'Developer Recruitment' },
    { value: 'investment', label: 'Investment Opportunities' },
    { value: 'networking', label: 'Professional Networking' },
    { value: 'general', label: 'General Inquiry' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if email was sent successfully or just saved
        if (data.warning) {
          setSubmitStatus('success-pending');
          setSubmitMessage('Form submitted successfully! Email delivery is pending - we\'ll get back to you soon.');
        } else {
          setSubmitStatus('success');
          setSubmitMessage('Message sent successfully! We\'ve received your inquiry and will respond shortly.');
        }
        
        // Clear form on success
        setFormData({
          name: '',
          email: '',
          company: '',
          serviceType: '',
          subject: '',
          message: '',
          budget: '',
          timeline: '',
          experience: ''
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Failed to send message. Please try again or contact us directly.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 7000); // Show message longer for better UX
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
            Company/Studio (Optional)
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
            placeholder="Your company or studio name"
          />
        </div>

        {/* Service Type */}
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-300 mb-2">
            Service Interest *
          </label>
          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
          >
            <option value="">Select a service...</option>
            {serviceTypes?.map(service => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject */}
      <div className="mb-6">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
          placeholder="Brief description of your inquiry"
        />
      </div>

      {/* Message */}
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={5}
          className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors resize-none"
          placeholder="Please provide details about your project, goals, and any specific requirements..."
        />
      </div>

      {/* Conditional Fields Based on Service Type */}
      <div className="mb-8">
        <div className={`grid gap-6 ${
          // Calculate number of visible fields
          (() => {
            let visibleFields = 1; // Always show experience field
            if (formData.serviceType === 'investment') visibleFields++;
            if (formData.serviceType === 'game-development' || formData.serviceType === 'developer-recruitment') visibleFields++;
            return visibleFields === 3 ? 'md:grid-cols-3' : visibleFields === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1';
          })()
        }`}>
          {/* Budget Range - Only show for Investment */}
          {formData.serviceType === 'investment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                Budget Range *
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
              >
                <option value="">Select investment budget...</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10k-50k">$10,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k-500k">$100,000 - $500,000</option>
                <option value="500k-plus">$500,000+</option>
                <option value="discuss">Prefer to discuss</option>
              </select>
            </motion.div>
          )}

          {/* Timeline - Only show for Game Development and Developer Recruitment */}
          {(formData.serviceType === 'game-development' || formData.serviceType === 'developer-recruitment') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
                {formData.serviceType === 'game-development' ? 'Project Timeline *' : 'Recruitment Timeline *'}
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
              >
                <option value="">Select timeline...</option>
                <option value="urgent">ASAP (Rush project)</option>
                <option value="1-month">Within 1 month</option>
                <option value="2-3-months">2-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-months-plus">6+ months</option>
                <option value="flexible">Flexible timeline</option>
              </select>
            </motion.div>
          )}

          {/* Roblox Experience - Always visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-2">
              Roblox Experience
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
            >
              <option value="">Select your experience level...</option>
              <option value="beginner">New to Roblox development</option>
              <option value="some-experience">Some experience with Roblox</option>
              <option value="experienced">Experienced Roblox developer</option>
              <option value="studio-owner">Studio owner/Game publisher</option>
              <option value="investor">Investor/Business partner</option>
            </select>
          </motion.div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start text-green-400"
          >
            <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Message sent successfully!</div>
              <div className="text-sm text-green-300 mt-1">
                {submitMessage || "We've received your inquiry and will respond shortly."}
              </div>
            </div>
          </motion.div>
        )}
        
        {submitStatus === 'success-pending' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start text-yellow-400"
          >
            <div className="animate-pulse">
              <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            </div>
            <div>
              <div className="font-medium">Form submitted successfully!</div>
              <div className="text-sm text-yellow-300 mt-1">
                {submitMessage || "Email delivery is pending - we'll get back to you soon."}
              </div>
            </div>
          </motion.div>
        )}
        
        {submitStatus === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start text-red-400"
          >
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Submission failed</div>
              <div className="text-sm text-red-300 mt-1">
                {submitMessage || "Please try again or contact us directly."}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.form>
  );
}
