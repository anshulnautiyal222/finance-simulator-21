import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import CharButton from '../components/CharButton';

function Card3D({ children, style = {} }) {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
        const y = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        setRot({ x, y });
      }}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      animate={{ rotateX: rot.x, rotateY: rot.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        transformStyle: 'preserve-3d',
        background: '#0f1a2e',
        border: '1px solid rgba(0,245,196,0.1)',
        borderRadius: 16, padding: '1.5rem',
        position: 'relative', overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,245,196,0.03), transparent)', pointerEvents: 'none', borderRadius: 16 }} />
      {children}
    </motion.div>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } },
};

export default function Dashboard({ onNavigate }) {
  const { gameState, updateGame, addTransaction } = useApp();
  const { balance, day, investments, spending, balanceHistory, healthScore, xp, level } = gameState;
  const totalInvested = investments.fd + investments.mf + investments.stocks;
  const totalSpent = spending.food + spending.entertainment + spending.transport + 3000;

  const advanceDay = () => {
    const newDay = Math.min(day + 1, 30);
    let newBalance = balance;
    let newInv = { ...investments };

    if (investments.fd > 0) newInv.fd += Math.round(investments.fd * 0.00019);
    if (investments.mf > 0) { const r = (Math.random() - 0.45) * 0.008; newInv.mf = Math.round(investments.mf * (1 + r)); }
    if (investments.stocks > 0) { const r = (Math.random() - 0.48) * 0.02; newInv.stocks = Math.round(investments.stocks * (1 + r)); }

    updateGame({
      day: newDay,
      investments: newInv,
      balance: newBalance,
      balanceHistory: [...(gameState.balanceHistory || []), newBalance].slice(-30),
      xp: xp + 15,
    });
  };

  const chartData = (balanceHistory || [10000]).map((v, i) => ({ day: i + 1, balance: v }));

  const metrics = [
    { label: 'Savings Rate', value: Math.round(Math.max(0, (balance / 10000) * 100)), color: '#10b981', suffix: '%' },
    { label: 'Days Left', value: 30 - day, color: '#fbbf24', suffix: '' },
    { label: 'Invested', value: totalInvested, color: '#7c3aed', prefix: '₹', compact: true },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show"
      className="theme-dashboard"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #070f0d 0%, #07090f 100%)', padding: '2rem', paddingBottom: '4rem' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#00f5c4', marginBottom: 6 }}>📊 Dashboard</div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>Financial Overview</h1>
          </div>
          <CharButton character="day" onClick={advanceDay} style={{ padding: '10px 20px', fontSize: '0.8rem' }}>
            ⏭ Next Day ({day}/30)
          </CharButton>
        </motion.div>

        {/* Day Progress */}
        <motion.div variants={fadeUp}>
          <Card3D style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', color: '#5a6a82', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Month Progress</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.75rem', color: '#00f5c4' }}>Day {day} of 30</span>
            </div>
            <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${(day / 30) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 5, background: 'linear-gradient(90deg, #00f5c4, #00c4ff)', position: 'relative', overflow: 'hidden' }}
              >
                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
              </motion.div>
            </div>
          </Card3D>
        </motion.div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Balance card */}
          <motion.div variants={fadeUp}>
            <Card3D>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', color: '#5a6a82', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>💰 Balance</div>
              <motion.div
                key={balance}
                initial={{ scale: 1.05, color: '#00f5c4' }}
                animate={{ scale: 1, color: '#e8edf5' }}
                style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '2.2rem', letterSpacing: '-0.02em', color: '#00f5c4' }}
              >
                ₹{balance.toLocaleString('en-IN')}
              </motion.div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <span className="tag tag-neon">Available</span>
                <span className={`tag ${balance < 5000 ? 'tag-red' : 'tag-green'}`}>{balance < 5000 ? '⚠️ Low' : '✓ Healthy'}</span>
              </div>

              <div style={{ height: 70, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="balGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#00f5c4" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#00f5c4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="balance" stroke="#00f5c4" strokeWidth={2} fill="url(#balGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card3D>
          </motion.div>

          {/* Health Score */}
          <motion.div variants={fadeUp}>
            <Card3D>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', color: '#5a6a82', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>💡 Health Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ position: 'relative', width: 90, height: 90 }}>
                  <svg viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)', width: 90, height: 90 }}>
                    <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <motion.circle
                      cx="45" cy="45" r="38" fill="none"
                      stroke={healthScore >= 70 ? '#00f5c4' : healthScore >= 40 ? '#fbbf24' : '#ef4444'}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 38}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - healthScore / 100) }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      style={{ filter: `drop-shadow(0 0 6px ${healthScore >= 70 ? '#00f5c4' : '#fbbf24'})` }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#00f5c4' }}>{healthScore}</div>
                    <div style={{ fontSize: '0.55rem', color: '#5a6a82', fontFamily: "'Space Mono',monospace" }}>/100</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {[
                    { label: 'Savings', value: Math.round((balance / 10000) * 100), color: '#10b981' },
                    { label: 'Spending', value: Math.max(0, 100 - Math.round(totalSpent / 100)), color: '#fbbf24' },
                    { label: 'Invest Mix', value: [investments.fd, investments.mf, investments.stocks].filter(v => v > 0).length * 33, color: '#7c3aed' },
                  ].map(m => (
                    <div key={m.label} style={{ marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#5a6a82', marginBottom: 3, fontFamily: "'Space Mono',monospace" }}>
                        <span>{m.label}</span><span style={{ color: m.color }}>{m.value}%</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 1, delay: 0.3 }}
                          style={{ height: '100%', borderRadius: 2, background: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card3D>
          </motion.div>

          {/* XP Level card */}
          <motion.div variants={fadeUp}>
            <Card3D>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', color: '#5a6a82', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>⚡ Progress</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.3rem', color: 'white' }}>{level}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>Level {level}</div>
                  <div style={{ fontSize: '0.75rem', color: '#5a6a82' }}>{xp} XP total</div>
                </div>
              </div>
              <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#5a6a82', fontFamily: "'Space Mono',monospace" }}>
                <span>Progress to Level {level + 1}</span>
                <span>{Math.round(((xp % 500) / 500) * 100)}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${((xp % 500) / 500) * 100}%` }}
                  transition={{ duration: 1 }}
                  style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', boxShadow: '0 0 10px rgba(124,58,237,0.5)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginTop: '1rem' }}>
                {metrics.map(m => (
                  <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.6rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1rem', color: m.color }}>
                      {m.prefix || ''}{m.compact && m.value > 999 ? `${(m.value / 1000).toFixed(1)}K` : m.value}{m.suffix}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#5a6a82', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </Card3D>
          </motion.div>
        </div>

        {/* Quick navigate cards */}
        <motion.div variants={fadeUp}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#5a6a82', marginBottom: '1rem' }}>Quick Navigate</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
            {[
              { id: 'budget', icon: '💸', label: 'Budget Planner', desc: 'Manage your spending', color: '#7c3aed', char: 'budget' },
              { id: 'invest', icon: '📈', label: 'Investments', desc: 'Grow your money', color: '#10b981', char: 'invest' },
              { id: 'quiz', icon: '🧠', label: 'Quiz Zone', desc: 'Earn XP & rewards', color: '#ff6b35', char: 'quiz' },
              { id: 'leaderboard', icon: '🏆', label: 'Leaderboard', desc: 'See your rank', color: '#fbbf24', char: 'leaderboard' },
            ].map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => onNavigate(item.id)}
                style={{
                  background: '#0f1a2e', border: `1px solid ${item.color}25`,
                  borderRadius: 14, padding: '1.25rem', cursor: 'pointer',
                  transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '1rem',
                  boxShadow: `0 0 0 0 ${item.color}30`,
                }}
                onHoverStart={e => e.target.style && (e.target.style.boxShadow = `0 8px 30px ${item.color}20`)}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, border: `1px solid ${item.color}25` }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: item.color, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#5a6a82' }}>{item.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', color: '#5a6a82', fontSize: '1rem' }}>→</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}