import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CharButton from '../components/CharButton';

const CATEGORIES = [
  { id: 'rent', label: 'Rent & Housing', icon: '🏠', color: '#7c3aed', limit: 3000, fixed: true },
  { id: 'food', label: 'Food & Groceries', icon: '🍛', color: '#00f5c4', limit: 2500 },
  { id: 'entertainment', label: 'Entertainment', icon: '🎉', color: '#ff6b35', limit: 1500 },
  { id: 'transport', label: 'Transport', icon: '🚌', color: '#fbbf24', limit: 800 },
];

const QUICK_SPENDS = [
  { cat: 'food', icon: '🍜', name: 'Instant Noodles', amt: 150 },
  { cat: 'food', icon: '🍕', name: 'Pizza Night', amt: 400 },
  { cat: 'food', icon: '☕', name: 'Café Outing', amt: 200 },
  { cat: 'food', icon: '🛒', name: 'Weekly Groceries', amt: 1200 },
  { cat: 'entertainment', icon: '📺', name: 'OTT Subscription', amt: 299 },
  { cat: 'entertainment', icon: '🎬', name: 'Movie + Snacks', amt: 500 },
  { cat: 'entertainment', icon: '🎮', name: 'Gaming Credits', amt: 800 },
  { cat: 'transport', icon: '🚇', name: 'Metro Ride', amt: 45 },
  { cat: 'transport', icon: '🛺', name: 'Auto Ride', amt: 80 },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } } };

export default function Budget() {
  const { gameState, updateGame, addTransaction } = useApp();
  const { balance, spending, transactions } = gameState;
  const [feedback, setFeedback] = useState(null);

  const spend = (cat, amt, icon, name) => {
    if (balance < amt) {
      setFeedback({ type: 'error', msg: '❌ Not enough balance!' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    const newSpending = { ...spending, [cat]: (spending[cat] || 0) + amt };
    const newBalance = balance - amt;
    updateGame({ balance: newBalance, spending: newSpending });
    addTransaction({ icon, name, cat, amt: -amt, type: 'out', day: gameState.day });
    setFeedback({ type: 'success', msg: `${icon} -₹${amt.toLocaleString('en-IN')} spent!` });
    setTimeout(() => setFeedback(null), 2000);
  };

  const totalBudget = 10000;
  const totalSpent = (spending.food || 0) + (spending.entertainment || 0) + (spending.transport || 0) + 3000;

  return (
    <motion.div
      variants={stagger} initial="hidden" animate="show"
      className="theme-budget"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0714 0%, #07090f 100%)', padding: '2rem', paddingBottom: '4rem' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#a78bfa', marginBottom: 6 }}>💸 Budget Planner</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>Allocate Your <span style={{ color: '#a78bfa' }}>₹10,000</span></h1>
            <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', color: '#8a9bb5', textTransform: 'uppercase' }}>REMAINING</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#a78bfa' }}>₹{Math.max(0, balance).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </motion.div>

        {/* Overall progress bar */}
        <motion.div variants={fadeUp} style={{ background: '#0f1a2e', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.75rem', fontFamily: "'Space Mono',monospace", color: '#5a6a82' }}>
            <span>Total Spent: ₹{totalSpent.toLocaleString('en-IN')}</span>
            <span>Budget: ₹{totalBudget.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
              transition={{ duration: 1 }}
              style={{ height: '100%', background: totalSpent > 8000 ? '#ef4444' : 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 5 }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: '0.7rem', color: '#5a6a82', fontFamily: "'Space Mono',monospace" }}>
            {Math.round((totalSpent / totalBudget) * 100)}% of budget used
          </div>
        </motion.div>

        {/* Category cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {CATEGORIES.map(cat => {
            const spent = cat.id === 'rent' ? 3000 : (spending[cat.id] || 0);
            const pct = Math.min(100, (spent / cat.limit) * 100);
            const over = pct >= 100;
            return (
              <motion.div
                key={cat.id}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: `0 12px 40px ${cat.color}20` }}
                onClick={() => !cat.fixed && spend(cat.id, Math.round(cat.limit * 0.1), cat.icon, cat.label)}
                style={{
                  background: '#0f1a2e',
                  border: `1px solid ${over ? '#ef444440' : `${cat.color}20`}`,
                  borderRadius: 14, padding: '1.25rem',
                  cursor: cat.fixed ? 'default' : 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{cat.icon}</div>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.88rem' }}>{cat.label}</div>
                      <div style={{ fontSize: '0.68rem', color: '#5a6a82' }}>Limit: ₹{cat.limit.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  {over && <span className="tag tag-red">Over!</span>}
                  {cat.fixed && <span className="tag tag-purple">Auto</span>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: over ? '#ef4444' : cat.color }}>₹{spent.toLocaleString('en-IN')}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.7rem', color: '#5a6a82' }}>{Math.round(pct)}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                    style={{ height: '100%', borderRadius: 3, background: over ? '#ef4444' : cat.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Spend */}
        <motion.div variants={fadeUp}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5a6a82', marginBottom: '1rem' }}>⚡ Quick Spend</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '0.75rem' }}>
            {QUICK_SPENDS.map((item, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => spend(item.cat, item.amt, item.icon, item.name)}
                style={{
                  background: '#0f1a2e', border: '1px solid rgba(124,58,237,0.12)',
                  borderRadius: 12, padding: '0.9rem 1rem',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.12)'}
              >
                <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#e8edf5', marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.75rem', color: '#a78bfa', fontWeight: 700 }}>-₹{item.amt.toLocaleString('en-IN')}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Feedback toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }}
              style={{
                position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                background: feedback.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(0,245,196,0.12)',
                border: `1px solid ${feedback.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(0,245,196,0.35)'}`,
                borderRadius: 10, padding: '0.75rem 1.5rem',
                fontFamily: "'Space Mono',monospace", fontSize: '0.85rem',
                color: feedback.type === 'error' ? '#ef4444' : '#00f5c4',
                zIndex: 9999, whiteSpace: 'nowrap',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              {feedback.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}