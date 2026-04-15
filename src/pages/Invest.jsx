import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext/AppContent';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CharButton from '../component/CharButton';

const INVESTMENTS = [
  {
    id: 'fd', name: 'Secure FD', icon: '🏦', type: 'Fixed Deposit', color: '#10b981',
    desc: 'State Bank guaranteed return. Safe, stable, predictable — the classic.',
    rate: '7.2% p.a.', rateNum: 7.2, risk: 1, lockIn: '1 Month', minAmt: 500,
    pros: ['Guaranteed returns', 'Zero risk', 'DICGC insured'],
    cons: ['Lower returns', 'Locked for a month'],
  },
  {
    id: 'mf', name: 'Balanced MF', icon: '📈', type: 'Mutual Fund', color: '#00f5c4',
    desc: 'Diversified equity + debt fund. The smart middle ground for balanced growth.',
    rate: '12–18% p.a.', rateNum: 15, risk: 3, lockIn: 'None', minAmt: 100,
    pros: ['Diversified portfolio', 'Professional management', 'Flexible withdrawal'],
    cons: ['Market dependent', 'Fund manager risk'],
  },
  {
    id: 'stocks', name: 'Nifty Stocks', icon: '🚀', type: 'Direct Stocks', color: '#ff6b35',
    desc: 'High risk, high reward. Could 3x or halve your money — choose wisely!',
    rate: '-20% to +60%', rateNum: 20, risk: 5, lockIn: 'None', minAmt: 200,
    pros: ['High potential returns', 'Market ownership', 'Dividend income'],
    cons: ['Very high risk', 'Requires research', 'Market volatile'],
  },
];

// Mock price data
const generatePriceData = (base, volatility, days = 30) => {
  const data = [{ day: 0, value: base }];
  for (let i = 1; i <= days; i++) {
    const prev = data[i - 1].value;
    const change = (Math.random() - 0.48) * volatility;
    data.push({ day: i, value: Math.round(prev * (1 + change)) });
  }
  return data;
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } } };

export default function Invest() {
  const { gameState, updateGame, addTransaction } = useApp();
  const { balance, investments } = gameState;
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState(null);

  const totalInvested = investments.fd + investments.mf + investments.stocks;

  const invest = () => {
    const amt = parseInt(amount);
    if (!selected) return;
    const inv = INVESTMENTS.find(i => i.id === selected);
    if (!amt || amt < inv.minAmt) { setFeedback({ type: 'error', msg: `Min investment: ₹${inv.minAmt}` }); setTimeout(() => setFeedback(null), 2000); return; }
    if (amt > balance) { setFeedback({ type: 'error', msg: '❌ Insufficient balance!' }); setTimeout(() => setFeedback(null), 2000); return; }
    const newBalance = balance - amt;
    const newInvestments = { ...investments, [selected]: investments[selected] + amt };
    updateGame({ balance: newBalance, investments: newInvestments });
    addTransaction({ icon: inv.icon, name: `${inv.name} Investment`, cat: 'investment', amt: -amt, type: 'out', day: gameState.day });
    setFeedback({ type: 'success', msg: `${inv.icon} ₹${amt.toLocaleString('en-IN')} invested!` });
    setAmount('');
    setTimeout(() => setFeedback(null), 2500);
  };

  const chartData = generatePriceData(10000, 0.015);
  const chartDataVolatile = generatePriceData(10000, 0.04);
  const chartDataStable = generatePriceData(10000, 0.003);

  return (
    <motion.div
      variants={stagger} initial="hidden" animate="show"
      className="theme-invest"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #071410 0%, #07090f 100%)', padding: '2rem', paddingBottom: '4rem' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#10b981', marginBottom: 6 }}>📈 Investments</div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>Build Your <span style={{ color: '#10b981' }}>Portfolio</span></h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', color: '#8a9bb5', textTransform: 'uppercase' }}>AVAILABLE</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#10b981' }}>₹{balance.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', color: '#8a9bb5', textTransform: 'uppercase' }}>PORTFOLIO</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#a78bfa' }}>₹{totalInvested.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </motion.div>

        {/* Investment cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {INVESTMENTS.map(inv => {
            const isSelected = selected === inv.id;
            const invested = investments[inv.id];
            const chartColors = { fd: '#10b981', mf: '#00f5c4', stocks: '#ff6b35' };
            const chartDatas = { fd: chartDataStable, mf: chartData, stocks: chartDataVolatile };

            return (
              <motion.div
                key={inv.id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                onClick={() => setSelected(isSelected ? null : inv.id)}
                style={{
                  background: '#0f1a2e',
                  border: `1px solid ${isSelected ? inv.color + '60' : inv.color + '20'}`,
                  borderRadius: 16, padding: '1.5rem', cursor: 'pointer',
                  boxShadow: isSelected ? `0 0 30px ${inv.color}20` : 'none',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', background: `${inv.color}15`, color: inv.color, padding: '3px 8px', borderRadius: 4 }}>{inv.type}</span>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.1rem', marginTop: 6, marginBottom: 2 }}>{inv.icon} {inv.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#5a6a82', lineHeight: 1.5 }}>{inv.desc}</div>
                  </div>
                  {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 20, height: 20, borderRadius: '50%', background: inv.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>✓</motion.div>}
                </div>

                {/* Mini chart */}
                <div style={{ height: 60, margin: '0.75rem 0' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDatas[inv.id].slice(0, 15)}>
                      <Line type="monotone" dataKey="value" stroke={inv.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {[['Return', inv.rate], ['Risk', '●'.repeat(inv.risk) + '○'.repeat(5 - inv.risk)], ['Lock-in', inv.lockIn], ['Min', `₹${inv.minAmt}`]].map(([k, v]) => (
                    <div key={k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.5rem' }}>
                      <div style={{ fontSize: '0.6rem', color: '#5a6a82', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: k === 'Risk' ? (inv.risk >= 4 ? '#ef4444' : inv.risk >= 3 ? '#fbbf24' : '#10b981') : '#e8edf5', marginTop: 2, fontFamily: k === 'Risk' ? 'monospace' : 'inherit' }}>{v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.78rem', color: inv.color }}>
                    Invested: <strong>₹{invested.toLocaleString('en-IN')}</strong>
                  </div>
                  {invested > 0 && <span className="tag tag-green">Active</span>}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Invest panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ background: '#0f1a2e', border: '1px solid rgba(0,245,196,0.15)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', overflow: 'hidden' }}
            >
              {(() => {
                const inv = INVESTMENTS.find(i => i.id === selected);
                return (
                  <div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5a6a82', marginBottom: '0.75rem' }}>
                      Invest in {inv.name}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <input
                          type="number" value={amount} onChange={e => setAmount(e.target.value)}
                          placeholder={`Min ₹${inv.minAmt}`}
                          className="input-field"
                          style={{ fontSize: '1.2rem', fontFamily: "'Space Mono',monospace", fontWeight: 700 }}
                        />
                        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                          {[500, 1000, 2000, 5000].map(v => (
                            <motion.button key={v} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                              onClick={() => setAmount(String(v))}
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 10px', color: '#8a9bb5', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Space Mono',monospace" }}>
                              ₹{v.toLocaleString('en-IN')}
                            </motion.button>
                          ))}
                          <motion.button whileHover={{ scale: 1.06 }} onClick={() => setAmount(String(Math.floor(balance * 0.5)))}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 10px', color: '#8a9bb5', cursor: 'pointer', fontSize: '0.75rem', fontFamily: "'Space Mono',monospace" }}>
                            50%
                          </motion.button>
                        </div>
                      </div>
                      <CharButton character="invest" onClick={invest} style={{ padding: '14px 32px', background: inv.color }}>
                        Invest Now 🚀
                      </CharButton>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Portfolio breakdown */}
        {totalInvested > 0 && (
          <motion.div variants={fadeUp} style={{ background: '#0f1a2e', border: '1px solid rgba(0,245,196,0.1)', borderRadius: 16, padding: '1.5rem' }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5a6a82', marginBottom: '1rem' }}>Portfolio Breakdown</div>
            {INVESTMENTS.filter(inv => investments[inv.id] > 0).map(inv => {
              const pct = Math.round((investments[inv.id] / totalInvested) * 100);
              return (
                <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem', width: 28 }}>{inv.icon}</span>
                  <div style={{ width: 100, fontSize: '0.8rem', fontWeight: 500 }}>{inv.name}</div>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                      style={{ height: '100%', borderRadius: 4, background: inv.color }} />
                  </div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.78rem', width: 70, textAlign: 'right' }}>₹{investments[inv.id].toLocaleString('en-IN')}</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.72rem', color: '#5a6a82', width: 36 }}>{pct}%</div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: feedback.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.12)', border: `1px solid ${feedback.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`, borderRadius: 10, padding: '0.75rem 1.5rem', fontFamily: "'Space Mono',monospace", fontSize: '0.85rem', color: feedback.type === 'error' ? '#ef4444' : '#10b981', zIndex: 9999, whiteSpace: 'nowrap' }}>
            {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}