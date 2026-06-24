
import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';

interface AddLectureViewProps {
  profile: UserProfile;
  onBack: () => void;
}

interface FileWithProgress {
  file: File;
  progress: number;
}

export const AddLectureView: React.FC<AddLectureViewProps> = ({ profile, onBack }) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [notifyOnPublish, setNotifyOnPublish] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [checklist, setChecklist] = useState({
    videoPlays: false,
    subtitlesAdded: false,
    notesAttached: false,
    chaptersSet: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const toggleChecklistItem = (item: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        file,
        progress: Math.floor(Math.random() * 100) // Mock progress for UI
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        progress: Math.floor(Math.random() * 100) // Mock progress for UI
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeBadge = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
    const colors: Record<string, string> = {
      'MP4': 'bg-blue-100 text-blue-700 border-blue-200',
      'MOV': 'bg-blue-100 text-blue-700 border-blue-200',
      'PDF': 'bg-red-100 text-red-700 border-red-200',
      'PPTX': 'bg-orange-100 text-orange-700 border-orange-200',
      'PPT': 'bg-orange-100 text-orange-700 border-orange-200',
      'DOC': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'DOCX': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${colors[ext] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
        {ext}
      </span>
    );
  };

  return (
    <div className={`max-w-5xl mx-auto p-6 ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-bold text-sm">Lecture published successfully!</p>
              </div>
              <button onClick={() => setShowSuccess(false)} className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <div>
          <nav className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest mb-3 ${profile.preferences.darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Dashboard</span>
            <span className="text-slate-300">›</span>
            <span>Lectures</span>
            <span className="text-slate-300">›</span>
            <span className="text-[#5046e5]">Add New</span>
          </nav>
          <h2 className={`text-2xl font-bold ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>Add New Lecture</h2>
          <p className={`${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1 text-sm`}>Upload your video lectures and study materials</p>
        </div>
        <button 
          onClick={onBack}
          className={`px-4 py-2 font-bold transition-colors ${profile.preferences.darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          {/* Upload Area */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-500 cursor-pointer
              group overflow-hidden
              ${isDragging 
                ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98] shadow-inner' 
                : profile.preferences.darkMode
                  ? 'border-slate-700 bg-slate-800/50 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10'
                  : 'border-slate-200 bg-gradient-to-br from-white via-white to-indigo-50/30 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100/50'}
            `}
          >
            {/* Background Gradient Glow */}
            <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl transition-colors duration-700 ${profile.preferences.darkMode ? 'bg-indigo-500/10' : 'bg-indigo-100/20 group-hover:bg-indigo-200/30'}`}></div>
            <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl transition-colors duration-700 ${profile.preferences.darkMode ? 'bg-violet-500/10' : 'bg-violet-100/20 group-hover:bg-violet-200/30'}`}></div>

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
              accept="video/*,application/pdf,.doc,.docx,.ppt,.pptx"
            />
            
            <div className="relative z-10">
              <div className={`w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${profile.preferences.darkMode ? 'shadow-indigo-500/20' : 'shadow-indigo-200'}`}>
                <svg className={`w-10 h-10 text-white transition-transform duration-500 ${isDragging ? 'scale-125' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <h3 className={`text-xl font-bold mb-2 tracking-tight ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>
                {isDragging ? 'Drop to Upload' : 'Drag & drop files here'}
              </h3>
              <p className={`${profile.preferences.darkMode ? 'text-slate-400' : 'text-slate-500'} mb-6 text-base font-medium`}>
                or <span className="text-indigo-600 font-bold underline decoration-2 underline-offset-4 group-hover:text-indigo-700 transition-colors">browse files</span>
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                {['MP4', 'MOV', 'PDF', 'PPTX'].map((ext) => (
                  <div key={ext} className={`flex items-center px-4 py-2 rounded-full border shadow-sm ${profile.preferences.darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-white/50 border-slate-100'}`}>
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2.5 animate-pulse"></span>
                    <span className={`text-xs font-bold uppercase tracking-widest ${profile.preferences.darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{ext}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-2xl border shadow-lg overflow-hidden ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
              >
                <div className={`p-6 border-b flex items-center justify-between ${profile.preferences.darkMode ? 'bg-slate-700/50 border-slate-700' : 'bg-slate-50/50 border-slate-50'}`}>
                  <h4 className={`font-bold ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>Selected Files ({files.length})</h4>
                  <button 
                    onClick={() => setFiles([])}
                    className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest"
                  >
                    Clear All
                  </button>
                </div>
                <div className={`divide-y max-h-[400px] overflow-y-auto ${profile.preferences.darkMode ? 'divide-slate-700' : 'divide-slate-50'}`}>
                  {files.map((fileObj, index) => (
                    <motion.div 
                      key={`${fileObj.file.name}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 group transition-colors ${profile.preferences.darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center mb-2">
                        <div className="mr-3">
                          {getFileTypeBadge(fileObj.file.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>{fileObj.file.name}</p>
                          <p className={`text-xs font-medium ${profile.preferences.darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{formatSize(fileObj.file.size)}</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${profile.preferences.darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${fileObj.progress}%` }}
                            className="h-full bg-indigo-500"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 w-8">{fileObj.progress}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`rounded-2xl border shadow-lg p-8 ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h4 className={`text-lg font-bold mb-6 ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>Lecture Details</h4>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Lecture Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Introduction to Quantum Physics"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium focus:ring-2 focus:ring-[#5046e5] focus:border-transparent ${
                      profile.preferences.darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Subject</label>
                  <select className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium appearance-none focus:ring-2 focus:ring-[#5046e5] focus:border-transparent ${
                    profile.preferences.darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>Social Studies</option>
                    <option>English</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Grade / Class</label>
                  <select className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium appearance-none focus:ring-2 focus:ring-[#5046e5] focus:border-transparent ${
                    profile.preferences.darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <option>Grade 6</option>
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                    <option>College Year 1</option>
                    <option>College Year 2</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Duration (minutes)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 45"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium focus:ring-2 focus:ring-[#5046e5] focus:border-transparent ${
                      profile.preferences.darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                <textarea 
                  rows={4}
                  placeholder="What is this lecture about?"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all font-medium resize-none focus:ring-2 focus:ring-[#5046e5] focus:border-transparent ${
                    profile.preferences.darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tags</label>
                <div className={`flex flex-wrap gap-2 p-2 rounded-xl border transition-all ${
                  profile.preferences.darkMode 
                    ? 'bg-slate-700 border-slate-600' 
                    : 'bg-slate-50 border-slate-200'
                } focus-within:ring-2 focus-within:ring-[#5046e5] focus-within:border-transparent`}>
                  {tags.map(tag => (
                    <span 
                      key={tag} 
                      className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold"
                    >
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-indigo-900 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={tags.length === 0 ? "Add tags (press Enter or comma)" : ""}
                    className="flex-1 min-w-[120px] bg-transparent outline-none py-1 px-2 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border shadow-lg p-8 ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h4 className={`text-lg font-bold mb-6 ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>Thumbnail</h4>
            
            <input 
              type="file" 
              ref={thumbnailInputRef}
              onChange={handleThumbnailChange}
              accept="image/*"
              className="hidden"
            />

            {thumbnail ? (
              <div className="relative group rounded-2xl overflow-hidden aspect-video border border-slate-200">
                <img src={thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-lg transform hover:scale-105 transition-all"
                  >
                    Change Image
                  </button>
                  <button 
                    onClick={() => setThumbnail(null)}
                    className="ml-3 px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg transform hover:scale-105 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => thumbnailInputRef.current?.click()}
                className={`
                  aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all
                  ${profile.preferences.darkMode 
                    ? 'border-slate-700 bg-slate-700/30 hover:border-indigo-500 hover:bg-slate-700/50' 
                    : 'border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-white'}
                `}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className={`text-sm font-bold ${profile.preferences.darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Upload thumbnail</p>
                <p className="text-xs text-slate-400 mt-1">(16:9 recommended)</p>
              </div>
            )}
          </div>

          <div className={`rounded-2xl border shadow-lg p-8 ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h4 className={`text-lg font-bold mb-6 ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>Pre-publish Checklist</h4>
            <div className="space-y-4">
              {[
                { id: 'videoPlays', label: 'Video plays without buffering' },
                { id: 'subtitlesAdded', label: 'Subtitles/captions added' },
                { id: 'notesAttached', label: 'Lecture notes attached' },
                { id: 'chaptersSet', label: 'Chapter markers set' },
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id as keyof typeof checklist)}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    checklist[item.id as keyof typeof checklist] 
                      ? 'bg-[#5046e5] border-[#5046e5]' 
                      : profile.preferences.darkMode ? 'border-slate-600' : 'border-slate-200'
                  }`}>
                    {checklist[item.id as keyof typeof checklist] && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-all ${
                    checklist[item.id as keyof typeof checklist]
                      ? 'text-slate-400 line-through'
                      : profile.preferences.darkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`rounded-2xl border shadow-lg p-6 ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h4 className={`font-bold mb-4 ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>Publish</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Visibility</label>
                <select className={`w-full px-4 py-2 rounded-xl border outline-none transition-all font-medium appearance-none ${
                  profile.preferences.darkMode 
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-100 focus:border-indigo-500 focus:bg-white'
                }`}>
                  <option>Public</option>
                  <option>Private</option>
                  <option>Unlisted</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <button 
                onClick={handlePublish}
                disabled={files.length === 0}
                className={`
                  w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95
                  ${files.length > 0 
                    ? 'bg-[#5046e5] hover:bg-[#4338ca] shadow-indigo-500/20' 
                    : 'bg-slate-300 cursor-not-allowed'}
                `}
              >
                Publish Lecture
              </button>
              
              <button 
                className={`
                  w-full py-4 rounded-2xl font-bold border-2 transition-all transform active:scale-95
                  ${profile.preferences.darkMode 
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-700' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'}
                `}
              >
                Save as Draft
              </button>
            </div>

            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
              Students will be notified when published
            </p>
          </div>

          <div className={`rounded-2xl border shadow-lg p-6 ${profile.preferences.darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <h4 className={`font-bold mb-6 ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>Settings</h4>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between group">
                <div className="flex-1 pr-4">
                  <p className={`text-sm font-bold ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>Free for all students</p>
                  <p className="text-[10px] font-medium text-slate-400 leading-tight">Make this lecture accessible without any subscription</p>
                </div>
                <button
                  onClick={() => setIsFree(!isFree)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isFree ? 'bg-[#5046e5]' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFree ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex-1 pr-4">
                  <p className={`text-sm font-bold ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>Notify students on publish</p>
                  <p className="text-[10px] font-medium text-slate-400 leading-tight">Send a push notification to all enrolled students</p>
                </div>
                <button
                  onClick={() => setNotifyOnPublish(!notifyOnPublish)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifyOnPublish ? 'bg-[#5046e5]' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifyOnPublish ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex-1 pr-4">
                  <p className={`text-sm font-bold ${profile.preferences.darkMode ? 'text-white' : 'text-slate-900'}`}>Allow comments</p>
                  <p className="text-[10px] font-medium text-slate-400 leading-tight">Enable discussion section for this lecture</p>
                </div>
                <button
                  onClick={() => setAllowComments(!allowComments)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${allowComments ? 'bg-[#5046e5]' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowComments ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-500/20">
            <div className="relative z-10">
              <h4 className="font-bold text-base mb-1.5">Pro Tip! 💡</h4>
              <p className="text-indigo-100 text-xs leading-relaxed">
                Uploading high-quality video lectures helps Arivo AI generate better study notes and assessments for you.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <div className={`rounded-2xl border p-6 ${profile.preferences.darkMode ? 'bg-indigo-900/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
            <h4 className={`font-bold mb-4 text-sm ${profile.preferences.darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>Tips for better lectures</h4>
            <div className="space-y-4">
              {[
                "Keep videos under 20 minutes",
                "Add chapter markers every 5 minutes",
                "Include a PDF summary",
                "Use 1080p resolution"
              ].map((tip, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${profile.preferences.darkMode ? 'bg-indigo-500/30 text-indigo-300' : 'bg-white text-indigo-600 shadow-sm'}`}>
                    {i + 1}
                  </div>
                  <p className={`text-xs font-medium leading-tight ${profile.preferences.darkMode ? 'text-indigo-200/70' : 'text-indigo-800/70'}`}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
