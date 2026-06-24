
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Users, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignIn }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Arivo
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onSignIn}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onSignIn}
              className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-32">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
                <Zap size={16} />
                <span>The Future of Personalized Learning</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Master Any Subject <br />
                <span className="text-indigo-600">Your Way.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
                Arivo is an AI-powered educational platform designed to adapt to your unique learning style. From personalized assessments to interactive lectures, we help you achieve your academic goals faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onSignIn}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-indigo-100"
                >
                  Start Learning Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 blur-3xl rounded-full" />
              <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 overflow-hidden flex items-center justify-center">
                <img 
                  src="/eagle.png" 
                  alt="Arivo Mascot" 
                  className="w-full max-w-[360px] h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Elements */}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Everything you need to excel</h2>
            <p className="text-slate-600 mb-16 max-w-2xl mx-auto">Our platform combines cutting-edge AI technology with proven pedagogical methods to provide the best learning experience.</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BookOpen className="text-indigo-600" />,
                  title: "Smart Lectures",
                  description: "Interactive video content that adapts to your pace and understanding level."
                },
                {
                  icon: <Zap className="text-amber-600" />,
                  title: "AI Assessments",
                  description: "Real-time feedback and personalized quizzes to identify your knowledge gaps."
                },
                {
                  icon: <Users className="text-emerald-600" />,
                  title: "Collaborative Learning",
                  description: "Connect with peers and mentors to solve complex problems together."
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-left"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={18} />
            </div>
            <span className="text-xl font-bold text-slate-900">Arivo</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Arivo Education. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
