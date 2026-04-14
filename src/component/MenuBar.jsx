import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', desc: 'Your financial overview', color: '#00f5c4', theme: 'theme-dashboard' },
  { id: 'budget', label: 'Budget Planner', icon: '💸', desc: 'Allocate your ₹10,000', color: '#7c3aed', theme: 'theme-budget' },
  { id: 'invest', label: 'Investments', icon: '📈', desc: 'FD, Mutual Funds, Stocks', color: '#10b981', theme: 'theme-invest' },
  { id: 'quiz', label: 'Quiz Zone', icon: '🧠', desc: 'Test your knowledge', color: '#ff6b35', theme: 'theme-quiz' },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆', desc: 'Compete with others', color: '#fbbf24', theme: 'theme-leaderboard' },
];

export default function MenuBar({ onNavigate, currentPage }) {
  const [open, setOpen] = useState(false);
  const { user } = useApp();

  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      {/* Hamburger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', flexDirection: 'column', gap: 5,
          alignItems: 'center', justifyContent: 'center',
          width: 46, height: 46,
          background: open ? 'rgba(0,245,196,0.12)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${open ? 'rgba(0,245,196,0.4)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 12, cursor: 'pointer', padding: 0,
          transition: 'all 0.3s',
        }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={open ? {
              rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
              y: i === 0 ? 10 : i === 2 ? -10 : 0,
              opacity: i === 1 ? 0 : 1,
            } : { rotate: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            style={{ width: 20, height: 2, background: open ? '#00f5c4' : '#e8edf5', borderRadius: 1 }}
          />
        ))}
      </motion.button>

      {/* Menu dropdown */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 999 }}
            />

            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                position: 'absolute', top: '110%', left: 0,
                background: 'linear-gradient(160deg, #0f1a2e, #0c1320)',
                border: '1px solid rgba(0,245,196,0.12)',
                borderRadius: 20, padding: '1rem',
                minWidth: 280, zIndex: 1000,
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,245,196,0.05)',
              }}
            >
              {/* Header */}
              <div style={{ padding: '0.5rem 0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.75rem' }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5a6a82', marginBottom: 4 }}>Navigation</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#e8edf5' }}>
                  {user ? `Hey, ${user.username}! 👋` : 'FinQuest Menu'}
                </div>
              </div>

              {MENU_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 6, background: `${item.color}12` }}
                  onClick={() => { onNavigate(item.id); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    width: '100%', padding: '0.9rem 1rem',
                    background: currentPage === item.id ? `${item.color}10` : 'transparent',
                    border: `1px solid ${currentPage === item.id ? `${item.color}30` : 'transparent'}`,
                    borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s',
                    marginBottom: 4,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${item.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', flexShrink: 0,
                    border: `1px solid ${item.color}25`,
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '0.9rem', color: currentPage === item.id ? item.color : '#e8edf5', marginBottom: 2 }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: '#5a6a82' }}>
                      {item.desc}
                    </div>
                  </div>
                  {currentPage === item.id && (
                    <motion.div
                      layoutId="menuActive"
                      style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, flexShrink: 0 }}
                    />
                  )}
                </motion.button>
              ))}

              {/* Footer */}
              <div style={{ padding: '0.75rem 0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,245,196,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🎮</div>
                <div style={{ fontSize: '0.7rem', color: '#5a6a82', fontFamily: "'Space Mono',monospace" }}>FinQuest v1.0</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}