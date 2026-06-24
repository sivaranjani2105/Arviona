
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { UserProfile, Assignment } from '../types';

interface SubmitAssignmentViewProps {
  profile: UserProfile;
  assignment: Assignment;
  onBack: () => void;
  onSubmit: () => void;
}

export const SubmitAssignmentView: React.FC<SubmitAssignmentViewProps> = ({ profile, assignment, onBack, onSubmit }) => {
  const [answer, setAnswer] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() && files.length === 0) {
      setError('Please provide a text answer or upload a file.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onSubmit();
    }, 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileTypeBadge = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
        {ext}
      </span>
    );
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-2xl font-bold mb-2 ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}
        >
          Assignment Submitted!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 max-w-md"
        >
          Your work for "{assignment.title}" has been successfully submitted. Your instructor will be notified.
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onBack}
          className="mt-8 px-6 py-2 bg-[#5046e5] text-white rounded-xl font-bold hover:bg-[#4338ca] transition-all"
        >
          Back to Assignments
        </motion.button>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-[#5046e5] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Assignments</span>
      </button>

      <div className="mb-10">
        <div className="flex items-center space-x-2 text-[#5046e5] font-bold text-sm uppercase tracking-widest mb-2">
          <span className="w-8 h-[2px] bg-[#5046e5] rounded-full"></span>
          <span>{assignment.subject}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{assignment.title}</h1>
        <p className="text-slate-500">Submit your work before the deadline to avoid late penalties.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Text Answer */}
        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Your Answer
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className={`w-full min-h-[200px] p-6 rounded-3xl border transition-all outline-none focus:ring-4 focus:ring-[#5046e5]/10 focus:border-[#5046e5] resize-none ${
              profile.preferences.darkMode 
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' 
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Attachments
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
              profile.preferences.darkMode 
                ? 'border-slate-700 bg-slate-800/50 hover:border-indigo-500/50 hover:bg-slate-800' 
                : 'border-slate-200 bg-slate-50 hover:border-indigo-500/50 hover:bg-white'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              multiple
              accept=".pdf,.docx,.jpg,.jpeg,.png"
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4 text-[#5046e5]">
              <Upload className="w-6 h-6" />
            </div>
            <p className="font-bold mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">PDF, DOCX, JPG, PNG (Max 10MB)</p>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <div className="grid grid-cols-1 gap-3 mt-4">
                {files.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border ${
                      profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                    } shadow-sm`}
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mr-4 flex-shrink-0 text-[#5046e5]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-0.5">
                          <span className="text-sm font-bold truncate">{file.name}</span>
                          {getFileTypeBadge(file.name)}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="ml-4 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </motion.div>
        )}

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center space-x-3 ${
              isSubmitting 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-[#5046e5] text-white shadow-indigo-500/20 hover:bg-[#4338ca] active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Assignment</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
