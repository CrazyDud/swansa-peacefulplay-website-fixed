
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Clock, MessageSquare, MessageCircle, Twitter, Users, Music } from 'lucide-react';
import { ContactForm } from './contact-form';
import { CONTACT_INFO, SOCIAL_LINKS, TEAM_CONTACTS } from '@/lib/constants';

export function ContactSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      description: CONTACT_INFO.email,
      action: `mailto:${CONTACT_INFO.email}`
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Discord Server",
      description: "Join our community",
      action: SOCIAL_LINKS.discord
    },
    {
      icon: <Twitter className="h-6 w-6" />,
      title: "Twitter",
      description: "@SwansaXPPlay",
      action: SOCIAL_LINKS.twitter
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "TikTok",
      description: "@imaginze8",
      action: SOCIAL_LINKS.tiktok
    }
  ];

  const teamContacts = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Technical Lead",
      name: TEAM_CONTACTS.technical.name,
      role: TEAM_CONTACTS.technical.role,
      action: `https://discord.com/users/${TEAM_CONTACTS.technical.discord}`
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Creative Lead", 
      name: TEAM_CONTACTS.creative.name,
      role: TEAM_CONTACTS.creative.role,
      action: `https://discord.com/users/${TEAM_CONTACTS.creative.discord}`
    }
  ];

  return (
    <section id="contact" className="py-20 bg-slate-800/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to start your next Roblox project? Let's discuss how we can help you achieve your goals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 h-fit">
              <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
              
              <div className="space-y-6 mb-8">
                {contactMethods?.map((method, index) => (
                  <div key={index} className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-4 border border-purple-500/30 group-hover:border-purple-500/50 transition-colors">
                      <div className="text-purple-400">{method.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{method.title}</h4>
                      <a
                        href={method.action}
                        target={method.title !== 'Email' ? '_blank' : undefined}
                        rel={method.title !== 'Email' ? 'noopener noreferrer' : undefined}
                        className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                      >
                        {method.description}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Contacts Section */}
              <div className="border-t border-gray-700 pt-6 mb-8">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Users className="h-5 w-5 text-blue-400 mr-2" />
                  Direct Team Contact
                </h4>
                <div className="space-y-4">
                  {teamContacts?.map((contact, index) => (
                    <div key={index} className="flex items-center group">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center mr-3 border border-blue-500/30 group-hover:border-blue-500/50 transition-colors">
                        <div className="text-blue-400">{contact.icon}</div>
                      </div>
                      <div>
                        <h5 className="font-medium text-white text-sm">{contact.title}</h5>
                        <a
                          href={contact.action}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 transition-colors text-xs font-medium"
                        >
                          {contact.name}
                        </a>
                        <p className="text-gray-400 text-xs">{contact.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-white font-medium">Response Time</span>
                </div>
                <p className="text-gray-300 text-sm">{CONTACT_INFO.responseTime}</p>
                
                <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-purple-300 text-sm font-medium">
                    🚀 Ready to level up your Roblox game?
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    We're here to help bring your vision to life!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <ContactForm />
          </motion.div>
        </div>

        {/* Additional Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-slate-800/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/10">
            <p className="text-gray-300 mb-4">
              <strong className="text-white">Prefer a quick chat?</strong> We're active on our social channels and love connecting with the Roblox community.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href={SOCIAL_LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
