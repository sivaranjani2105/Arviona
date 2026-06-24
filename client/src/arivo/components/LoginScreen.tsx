
import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative mx-auto overflow-visible">
      {/* Decorative Elements */}
      <div className="absolute -top-10 -right-6 w-24 h-24 hidden md:block select-none pointer-events-none animate-bounce duration-[3000ms]">
        <MascotSVG />
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
           <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
           </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Arivo</h1>
        <p className="text-indigo-600 font-semibold mt-1 tracking-wide text-sm uppercase">“Learn your way”</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email or Mobile Number</label>
          <input 
            type="text" 
            placeholder="student@example.com"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 placeholder:text-slate-300 font-medium"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-300 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-95 text-base"
        >
          Sign In
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200"></span>
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-white/80 px-4 text-slate-400 font-bold tracking-widest">or</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={onLogin}
          className="w-full py-4 flex items-center justify-center space-x-3 bg-white border-2 border-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 text-base"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          <span>Continue with Google</span>
        </button>
      </form>

      <p className="text-center mt-12 text-slate-500 font-medium">
        Don't have an account? 
        <button className="text-indigo-600 font-bold ml-1 hover:underline decoration-2">Sign up for free</button>
      </p>

      <div className="mt-8 text-center bg-indigo-50/50 py-3 px-4 rounded-2xl">
         <p className="text-xs text-indigo-400 font-semibold italic">Join over 10,000+ students learning daily!</p>
      </div>
    </div>
  );
};

const MascotSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="#E0E7FF" fillOpacity="0.8" />
    <path d="M100 60C122.091 60 140 77.9086 140 100C140 122.091 122.091 140 100 140C77.9086 140 60 122.091 60 100C60 77.9086 77.9086 60 100 60Z" fill="#4F46E5" />
    <circle cx="85" cy="95" r="5" fill="white" />
    <circle cx="115" cy="95" r="5" fill="white" />
    <path d="M85 115C85 115 90 125 100 125C110 125 115 115 115 115" stroke="white" strokeWidth="4" strokeLinecap="round" />
  </svg>
);