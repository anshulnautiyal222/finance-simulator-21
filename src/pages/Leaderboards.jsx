import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const PLAYERS = [
  { name: 'FinanceKing', handle: '@financeking', score: 94, balance: 13200, badge: '💎 Diamond', color: '#fbbf24', change: 3 },
  { name: 'WealthWizard', handle: '@wealthwiz', score: 88, balance: 12100, badge: '🥇 Gold', color: '#94a3b8', change: 1 },
  { name: 'StockStar99', handle: '@stockstar', score: 81, balance: 11500, badge: '📈 Trader', color: '#cd7c45', change: -1 },
  { name: 'BudgetBoss', handle: '@budgetboss', score: 79, balance: 11200, badge: '🎯 Strategist', color: '#7c3aed', change: 2 },
  { name: 'SIPSaver', handle: '@sipsaver', score: 68, balance: 9800, badge: '💰 Saver', color: '#10b981', change: -2 },
  { name: 'CryptoKid', handle: '@cryptokid', score: 55, balance: 8200, badge: '🎲 Gambler', color: '#ff6b35', change: -3 },
  { name: 'BrokeStudent', handle: '@brokestud', score: 41, balance: 6100, badge: '😅 Learning', color: '#ef4444', change: -1 },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } } };

export default function Leaderboard() {
  const { user, gameState } = useApp();

  const allPlayers = [...PLAYERS];
  if (user) {
    allPlayers.push({ name: user.username, handle: `@${user.username}`, score: gameState.healthScore, balance: gameState.balance, badge: '🌱 Beginner', color: '#00f5c4', change: 0, isYou: true });
  }
  const sorted = allPlayers.sort((a, b) => b.score - a.score);
  const myRank = user ? sorted.findIndex(p => p.isYou) + 1 : null;

  return (
    <motion.div
      variants={stagger} initial="hidden" animate="show"
      className="theme-leaderboard"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #14110a 0%, #07090f 100%)', padding: '2rem', paddingBottom: '4rem' }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#fbbf24', marginBottom: 6 }}>🏆 Leaderboard</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>Season <span style={{ color: '#fbbf24' }}>Rankings</span></h1>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.7rem', color: '#5a6a82', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '6px 14px', borderRadius: 8 }}>
              Ranked by Health Score · Not just profits
            </div>
          </div>
        </motion.div>

        {/* Your rank banner */}
        {user && myRank && (
          <motion.div variants={fadeUp} style={{ background: 'rgba(0,245,196,0.06)', border: '1px solid rgba(0,245,196,0.2)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #00f5c4, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>{myRank}</div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.95rem' }}>Your Current Rank</div>
                <div style={{ fontSize: '0.75rem', color: '#5a6a82' }}>Health Score: <span style={{ color: '#00f5c4', fontWeight: 600 }}>{gameState.healthScore}</span></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#00f5c4' }}>#{myRank}</div>
                <div style={{ fontSize: '0.65rem', color: '#5a6a82', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase' }}>Rank</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#fbbf24' }}>{sorted.length - myRank}</div>
                <div style={{ fontSize: '0.65rem', color: '#5a6a82', fontFamily: "'Space Mono',monospace", textTransform: 'uppercase' }}>Above You</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {sorted.slice(0, 3).map((p, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const sizes = ['1.1rem', '1rem', '0.9rem'];
            const heights = ['110px', '90px', '75px'];
            return (
              <motion.div
                key={p.name}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{
                  background: '#0f1a2e',
                  border: `1px solid ${p.color}35`,
                  borderRadius: 14, padding: '1.25rem',
                  textAlign: 'center',
                  boxShadow: `0 0 20px ${p.color}12`,
                }}
              >
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{medals[i]}</motion.div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontSize: '1.2rem', border: `1px solid ${p.color}35` }}>
                  {p.name[0].toUpperCase()}
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: sizes[i], marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '1rem', fontWeight: 700, color: p.color }}>{p.score}</div>
                <div style={{ fontSize: '0.65rem', color: '#5a6a82', fontFamily: "'Space Mono',monospace", marginTop: 2 }}>Health Score</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Full Table */}
        <motion.div variants={fadeUp} style={{ background: '#0f1a2e', border: '1px solid rgba(251,191,36,0.1)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['#', 'Player', 'Health Score', 'Balance', 'Badge', '±'].map(h => (
                    <th key={h} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#5a6a82', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => (
                  <motion.tr
                    key={p.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: p.isYou ? 'rgba(0,245,196,0.04)' : 'transparent',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = p.isYou ? 'rgba(0,245,196,0.06)' : 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = p.isYou ? 'rgba(0,245,196,0.04)' : 'transparent'}
                  >
                    <td style={{ padding: '1rem', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1rem', color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c45' : '#5a6a82' }}>
                      {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${p.color}20`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: p.color, flexShrink: 0 }}>
                          {p.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: p.isYou ? '#00f5c4' : '#e8edf5' }}>{p.name}{p.isYou ? ' 👈 You' : ''}</div>
                          <div style={{ fontSize: '0.68rem', color: '#5a6a82', fontFamily: "'Space Mono',monospace" }}>{p.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: "'Space Mono',monospace", fontWeight: 700, color: '#fbbf24', fontSize: '0.92rem' }}>{p.score}</td>
                    <td style={{ padding: '1rem', fontFamily: "'Space Mono',monospace", fontSize: '0.8rem' }}>₹{p.balance.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', background: `${p.color}15`, color: p.color, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.badge}</span>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: "'Space Mono',monospace", fontSize: '0.78rem', color: p.change > 0 ? '#10b981' : p.change < 0 ? '#ef4444' : '#5a6a82' }}>
                      {p.change > 0 ? `▲ +${p.change}` : p.change < 0 ? `▼ ${p.change}` : '—'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}