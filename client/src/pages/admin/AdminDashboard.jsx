import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  LayoutDashboard, Users, Shield, Award, ShoppingBag, Zap,
  Home, LogOut, Plus, Trash2, RefreshCw, Edit, Check, X
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers]         = useState([]);
  const [houses, setHouses]       = useState([]);
  const [badges, setBadges]       = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [xpConfig, setXpConfig]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, h, b, s] = await Promise.allSettled([
        api.get('/admin/users'),
        api.get('/admin/houses'),
        api.get('/admin/badges'),
        api.get('/admin/store-items'),
      ]);
      if (u.status === 'fulfilled') setUsers(u.value || []);
      if (h.status === 'fulfilled') setHouses(h.value || []);
      if (b.status === 'fulfilled') setBadges(b.value || []);
      if (s.status === 'fulfilled') setStoreItems(s.value || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const createHouse = async () => {
    const name  = prompt('House name:');
    const color = prompt('Hex color (e.g. #6366F1):') || '#6366F1';
    if (!name) return;
    await api.post('/admin/houses', { name, colorHex: color });
    showToast(`House "${name}" created!`);
    loadData();
  };

  const resetHouse = async (id, name) => {
    if (!confirm(`Reset ${name}'s points to 0?`)) return;
    await api.put(`/admin/houses/${id}/reset`, {});
    showToast(`${name} points reset`);
    loadData();
  };

  const createBadge = async () => {
    const name = prompt('Badge name:');
    const desc = prompt('Description:') || '';
    const icon = prompt('Icon name (e.g. star, zap, trophy):') || 'star';
    const xp   = parseInt(prompt('XP reward:') || '100', 10);
    if (!name) return;
    await api.post('/admin/badges', { name, description: desc, iconName: icon, rewardXp: xp });
    showToast(`Badge "${name}" created!`);
    loadData();
  };

  const createStoreItem = async () => {
    const name  = prompt('Item name:');
    const price = parseInt(prompt('Price (coins):') || '100', 10);
    const cat   = prompt('Category (skin/theme/powerup/accessory):') || 'accessory';
    const emoji = prompt('Icon emoji:') || '🎁';
    const desc  = prompt('Description:') || '';
    if (!name) return;
    await api.post('/admin/store-items', { name, price, category: cat, iconEmoji: emoji, description: desc });
    showToast(`"${name}" added to store!`);
    loadData();
  };

  const deleteStoreItem = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await api.delete(`/admin/store-items/${id}`);
    showToast(`"${name}" removed`, 'error');
    loadData();
  };

  const banUser = async (id, name) => {
    if (!confirm(`Ban user "${name}"? This will disable their account.`)) return;
    await api.delete(`/admin/users/${id}`);
    showToast(`${name} banned`, 'error');
    loadData();
  };

  const navItems = [
    { id: 'overview', icon: <LayoutDashboard size={18}/>, label: 'Overview' },
    { id: 'users',    icon: <Users size={18}/>,           label: 'Users' },
    { id: 'houses',   icon: <Home size={18}/>,            label: 'Houses' },
    { id: 'badges',   icon: <Award size={18}/>,           label: 'Badges' },
    { id: 'store',    icon: <ShoppingBag size={18}/>,     label: 'Store Items' },
    { id: 'xp',       icon: <Zap size={18}/>,             label: 'XP Config' },
  ];

  const xpDefaults = [
    { action: 'Watch Lecture',        xp: 20,  coins: 5  },
    { action: 'Complete Quiz',         xp: 50,  coins: 15 },
    { action: 'Submit Quest',          xp: 75,  coins: 20 },
    { action: 'Win Boss Battle',       xp: 300, coins: 100},
    { action: 'AI Tutor Session',      xp: 10,  coins: 3  },
    { action: '7-Day Streak',          xp: 100, coins: 40 },
    { action: 'Daily Missions Done',   xp: 200, coins: 50 },
    { action: 'Upload Assignment',     xp: 30,  coins: 10 },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col shrink-0 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <span className="text-xs font-extrabold tracking-widest text-indigo-500 uppercase">⚙️ Admin Panel</span>
          <h1 className="font-poppins font-bold text-slate-800 mt-1 text-sm">{user?.name}</h1>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">School Administrator</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 pb-4">
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={16}/> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl text-white font-bold text-sm shadow-lg ${
                toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
              }`}>
              {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-slate-900">Admin Control Panel</h2>
              <p className="text-slate-500 text-sm mt-1">Manage users, gamification, houses, badges, and the reward store.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users',   val: users.length,      emoji: '👥', color: 'indigo' },
                { label: 'Houses',        val: houses.length,     emoji: '🏠', color: 'amber'  },
                { label: 'Badges',        val: badges.length,     emoji: '🏅', color: 'purple' },
                { label: 'Store Items',   val: storeItems.length, emoji: '🛒', color: 'rose'   },
              ].map((kpi, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="text-3xl mb-2">{kpi.emoji}</div>
                  <div className="text-3xl font-extrabold text-slate-800">{kpi.val}</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">{kpi.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white">
              <h3 className="font-poppins font-bold text-lg mb-1">School Gamification Engine</h3>
              <p className="text-indigo-100 text-sm">Use the left menu to configure XP values, create houses, mint badges, and manage your store inventory.</p>
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-poppins font-bold text-slate-900">User Management</h2>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-50">
                {users.map((u, i) => (
                  <div key={i} className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(u.roles || []).map((r, ri) => (
                        <span key={ri} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase">
                          {r.replace('ROLE_', '')}
                        </span>
                      ))}
                      <button onClick={() => banUser(u.id, u.name)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Houses ── */}
        {activeTab === 'houses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-poppins font-bold text-slate-900">House Management</h2>
              <button onClick={createHouse}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
                <Plus size={16}/> New House
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {houses.map((h, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
                  style={{ borderLeft: `4px solid ${h.colorHex}` }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800">{h.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: h.colorHex }}/>
                        <span className="text-xs text-slate-400">{h.colorHex}</span>
                      </div>
                    </div>
                    <button onClick={() => resetHouse(h.id, h.name)}
                      className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="Reset points">
                      <RefreshCw size={14}/>
                    </button>
                  </div>
                  <div className="text-3xl font-extrabold" style={{ color: h.colorHex }}>{h.totalPoints}</div>
                  <div className="text-xs text-slate-400 mt-0.5">House Points</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Badges ── */}
        {activeTab === 'badges' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-poppins font-bold text-slate-900">Badge Management</h2>
              <button onClick={createBadge}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">
                <Plus size={16}/> New Badge
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((b, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-center">
                  <div className="w-14 h-14 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl mx-auto mb-3">🏅</div>
                  <h3 className="font-bold text-slate-800 text-sm">{b.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{b.description}</p>
                  <span className="inline-block mt-2 text-xs font-bold text-amber-600">+{b.rewardXp} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Store Items ── */}
        {activeTab === 'store' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-poppins font-bold text-slate-900">Reward Store</h2>
              <button onClick={createStoreItem}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors">
                <Plus size={16}/> Add Item
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {storeItems.map((item, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative">
                  <button onClick={() => deleteStoreItem(item.id, item.name)}
                    className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 transition-colors">
                    <X size={14}/>
                  </button>
                  <div className="text-4xl mb-2">{item.iconEmoji}</div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">{item.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-bold text-amber-600">🪙 {item.price}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full text-slate-500">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── XP Config ── */}
        {activeTab === 'xp' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-poppins font-bold text-slate-900">XP & Coins Configuration</h2>
            <p className="text-slate-500 text-sm">These values control how much XP and coins students earn per action. (Editing saved to DB via V6 migration)</p>
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Action</th>
                    <th className="text-center px-4 py-3 font-semibold text-amber-600">⚡ XP</th>
                    <th className="text-center px-4 py-3 font-semibold text-yellow-600">🪙 Coins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {xpDefaults.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-700 font-medium">{row.action}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-amber-600">{row.xp}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-yellow-600">{row.coins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-700">
              💡 To modify XP values, update the <code className="font-mono bg-indigo-100 px-1.5 py-0.5 rounded text-xs">xp_config</code> table via the admin API or database migration.
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
