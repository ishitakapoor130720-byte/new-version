import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Mail, Phone, User, X, Briefcase, ChevronRight, Handshake, Calendar, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrorHandler';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  primaryGoal: string;
}

export default function LeadCaptureModal({ isOpen, onClose, businessName, primaryGoal }: LeadCaptureModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['Social Media Growth', 'Paid Advertising']);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const services = [
    'Social Media Growth',
    'Paid Advertising',
    'SEO Optimization',
    'Lead Generation Funnels',
    'WhatsApp & CRM Automation',
    'Full Brand Identity'
  ];

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Please fill in all standard contact fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    const leadRef = doc(collection(db, 'leads'));
    const leadId = leadRef.id;

    try {
      await setDoc(leadRef, {
        name,
        email,
        phone,
        businessName: businessName || 'None Specified',
        primaryGoal: primaryGoal || 'Acquisition',
        selectedServices,
        createdAt: serverTimestamp()
      });
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Error saving lead:', err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `leads/${leadId}`);
      } catch (finalError: any) {
        setError('Failed to submit consultation request. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            id="lead-modal-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl glow-teal"
            id="lead-modal-container"
          >
            {/* Ambient glowing radial light */}
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Handshake className="h-6 w-6 text-teal-400" />
                  <span className="font-display font-bold text-lg text-slate-100 uppercase tracking-wider">Partner with BuyZently</span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                  id="close-lead-modal-btn"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <h3 className="font-display font-semibold text-slate-200">Let's Execute Your Custom Blueprint</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Our senior strategists will review your competitor analysis and goals for <strong className="text-teal-400">{businessName || 'your brand'}</strong> to prepare direct tactical launch layouts.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800/50 p-3 text-xs text-red-300">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-3.5">
                    {/* Name input */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alexandra Miller"
                          className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300">Work Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@boutique.com"
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300">Phone / WhatsApp</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 019-2834"
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Services Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-teal-400" />
                        <span>Select Services You Want Done For You</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {services.map((service) => {
                          const isSelected = selectedServices.includes(service);
                          return (
                            <button
                              type="button"
                              key={service}
                              onClick={() => toggleService(service)}
                              className={`flex items-center gap-2 rounded-lg border p-2.5 text-left transition-all duration-200 ${
                                isSelected
                                  ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                isSelected ? 'border-teal-400 bg-teal-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                              }`}>
                                {isSelected && <Check className="h-3 w-3 stroke-[3px]" />}
                              </div>
                              <span className="truncate">{service}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-slate-500 text-center">
                    By submitting, you unlock a fast-tracked calendar slot for a private consultation based on your target goal: <span className="text-teal-400 font-semibold">{primaryGoal || 'Acquisition'}</span>.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full overflow-hidden rounded-xl bg-teal-500 py-3 text-center text-sm font-semibold text-slate-950 transition-transform active:scale-[0.98] cursor-pointer"
                    id="submit-proposal-request-btn"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deploying Strategy Review...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        Secure Free Strategy Consultation <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="mt-8 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/15 text-teal-400">
                    <Check className="h-8 w-8 stroke-[2.5px]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-100">Consultation Decided! 🎉</h3>
                    <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                      Congratulations <strong className="text-slate-200">{name}</strong>, your business parameters for <strong className="text-teal-400">{businessName}</strong> have been logged.
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      An automation architect from BuyZently will email you at <strong className="text-slate-300">{email}</strong> to deliver your custom presentation slides.
                    </p>
                  </div>

                  <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-4 max-w-md mx-auto text-left">
                    <div className="flex gap-3 text-xs">
                      <Calendar className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-300">Your Action Blueprint Session Is Queued</div>
                        <div className="text-slate-500 mt-1">We will cover reels script, ads configuration, and WhatsApp follow-up automation mapping directly.</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full rounded-xl border border-slate-800 py-3 text-sm font-semibold hover:bg-slate-800/50 transition-colors cursor-pointer"
                    id="finish-proposal-btn"
                  >
                    Return to Blueprint
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
