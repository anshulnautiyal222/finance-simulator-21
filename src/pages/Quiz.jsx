import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext/AppContent';
import CharButton from '../component/CharButton';

const QUESTIONS = [
  {
    category: 'Budgeting Basics', icon: '💰',
    q: 'You receive ₹10,000/month. After rent (₹3,000), which is the BEST savings strategy?',
    opts: ['Spend everything and save what\'s left', 'Save first, then spend from what remains', 'Invest all savings in stocks immediately', 'Put everything in a savings account'],
    correct: 1,
    explain: '"Pay yourself first!" — Save before you spend. This ensures savings happen regardless of your willpower. It\'s the #1 rule of personal finance!',
    pts: 100, reward: 200,
  },
  {
    category: 'Investment Types', icon: '📈',
    q: 'What does "Compound Interest" mean in a Fixed Deposit?',
    opts: ['Interest calculated only on the principal amount', 'Interest earned on both principal AND accumulated interest', 'A fixed % deducted as tax every year', 'Interest paid monthly, principal returned at end'],
    correct: 1,
    explain: 'Compound interest = interest on principal + interest already earned. Einstein called it the "8th wonder of the world" — and for good reason!',
    pts: 100, reward: 200,
  },
  {
    category: 'Risk Management', icon: '⚡',
    q: 'The stock market crashes 20% overnight. You have ₹2,000 in stocks. Best move?',
    opts: ['Panic sell everything immediately', 'Hold or buy more if fundamentals are strong', 'Take a personal loan to invest more', 'Swear off stocks forever'],
    correct: 1,
    explain: 'Market dips = discounted stocks! If a company\'s fundamentals are solid, temporary drops are buying opportunities. "Be greedy when others are fearful." — Warren Buffett',
    pts: 150, reward: 300,
  },
  {
    category: 'Mutual Funds', icon: '🏦',
    q: 'What is NAV (Net Asset Value) in Mutual Funds?',
    opts: ['The fund manager\'s annual salary', 'The per-unit price of one mutual fund unit', 'The minimum investment amount required', 'Annual fee charged to all investors'],
    correct: 1,
    explain: 'NAV = (Total Assets - Liabilities) ÷ Total Units outstanding. It\'s essentially the "price tag" of one unit of a mutual fund, calculated daily after market close.',
    pts: 100, reward: 200,
  },
  {
    category: 'Financial Planning', icon: '🎯',
    q: 'What is the famous "50-30-20" budgeting rule?',
    opts: ['50% investments, 30% savings, 20% spending', '50% needs, 30% wants, 20% savings & debt', '50% rent, 30% food, 20% entertainment', '50% stocks, 30% FD, 20% gold'],
    correct: 1,
    explain: 'The 50/30/20 rule: 50% for NEEDS (rent, food, transport), 30% for WANTS (dining out, shopping, entertainment), 20% for SAVINGS & DEBT repayment. Simple and effective!',
    pts: 100, reward: 250,
  },
];

export default function Quiz() {
  const { gameState, updateGame } = useApp();
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[idx];

  const answer = (i) => {
    if (answered !== null) return;
    setAnswered(i);
    const correct = i === q.correct;
    if (correct) {
      setScore(s => s + q.pts);
      setStreak(s => s + 1);
      updateGame({
        balance: gameState.balance + q.reward,
        xp: gameState.xp + 50,
      });
    } else {
      setStreak(0);
    }
    setCompleted(c => [...c, idx]);
  };

  const next = () => {
    if (idx >= QUESTIONS.length - 1) { setDone(true); return; }
    setIdx(i => i + 1);
    setAnswered(null);
  };

  const reset = () => { setIdx(0); setAnswered(null); setScore(0); setStreak(0); setCompleted([]); setDone(false); };

  if (done) {
    const pct = Math.round((score / 550) * 100);
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="theme-quiz"
        style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #140a07 0%, #07090f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ background: '#0f1a2e', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 24, padding: '3rem', maxWidth: 500, width: '100%', textAlign: 'center' }}
        >
          <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 1 }} style={{ fontSize: '5rem', marginBottom: '1rem' }}>
            {pct >= 80 ? '🏆' : pct >= 60 ? '🎓' : '📚'}
          </motion.div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#ff6b35', marginBottom: '0.5rem' }}>Quiz Complete!</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '4rem', color: '#ff6b35', lineHeight: 1 }}>{score}</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.75rem', color: '#5a6a82', marginTop: 4, marginBottom: '1.5rem' }}>Points Earned</div>
          <p style={{ fontSize: '0.95rem', color: '#8a9bb5', lineHeight: 1.6, marginBottom: '2rem' }}>
            {pct >= 80 ? '🌟 Outstanding! You\'re a financial literacy pro!' :
             pct >= 60 ? '👏 Good work! Keep learning and growing!' :
             '💪 Keep practicing — financial wisdom takes time!'}
          </p>
          <CharButton character="quiz" onClick={reset} style={{ background: '#ff6b35', width: '100%', justifyContent: 'center', padding: '14px' }}>
            Try Again 🔄
          </CharButton>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="theme-quiz"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #140a07 0%, #07090f 100%)', padding: '2rem', paddingBottom: '4rem' }}
    >
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#ff6b35', marginBottom: 6 }}>🧠 Quiz Zone</div>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,2rem)', marginBottom: '1.5rem' }}>Financial Literacy <span style={{ color: '#ff6b35' }}>Challenge</span></h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[['⭐ Points', score, '#ff6b35'], [`🔥 Streak`, `${streak}x`, '#fbbf24'], [`✅ Done`, `${completed.length}/${QUESTIONS.length}`, '#10b981']].map(([label, val, color]) => (
            <div key={label} style={{ background: '#0f1a2e', border: '1px solid rgba(255,107,53,0.12)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.3rem', color }}>{val}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a6a82', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem' }}>
          {QUESTIONS.map((_, i) => (
            <motion.div key={i} animate={{ width: i === idx ? 28 : 8, background: completed.includes(i) ? '#10b981' : i === idx ? '#ff6b35' : 'rgba(255,255,255,0.1)' }}
              style={{ height: 6, borderRadius: 3 }} transition={{ duration: 0.3 }} />
          ))}
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            style={{ background: '#0f1a2e', border: '1px solid rgba(255,107,53,0.15)', borderRadius: 20, padding: '2rem', marginBottom: '1rem' }}
          >
            {/* Category badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 6, padding: '5px 12px', fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff6b35' }}>
                {q.icon} {q.category}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Space Mono',monospace", fontSize: '0.72rem', color: '#fbbf24' }}>
                ⭐ {q.pts} pts · 💰 +₹{q.reward} bonus
              </div>
            </div>

            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>{q.q}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {q.opts.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isSelected = i === answered;
                let bg = 'rgba(255,255,255,0.03)';
                let border = 'rgba(255,255,255,0.08)';
                let color = '#e8edf5';
                if (answered !== null) {
                  if (isCorrect) { bg = 'rgba(16,185,129,0.12)'; border = '#10b98150'; color = '#10b981'; }
                  if (isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.12)'; border = '#ef444450'; color = '#ef4444'; }
                }
                return (
                  <motion.button
                    key={i}
                    whileHover={answered === null ? { x: 6, background: 'rgba(255,107,53,0.08)' } : {}}
                    whileTap={answered === null ? { scale: 0.99 } : {}}
                    onClick={() => answer(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '1rem 1.25rem', borderRadius: 12, cursor: answered === null ? 'pointer' : 'default',
                      background: bg, border: `1px solid ${border}`, color,
                      textAlign: 'left', transition: 'all 0.2s', fontSize: '0.9rem',
                    }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono',monospace", fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, color: answered !== null && isCorrect ? '#10b981' : '#5a6a82' }}>
                      {answered !== null && isCorrect ? '✓' : answered !== null && isSelected ? '✗' : 'ABCD'[i]}
                    </div>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {answered !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(0,245,196,0.04)', border: '1px solid rgba(0,245,196,0.15)', borderRadius: 10, fontSize: '0.88rem', lineHeight: 1.7, color: '#8a9bb5', overflow: 'hidden' }}
                >
                  <span style={{ color: '#00f5c4', fontWeight: 600 }}>{answered === q.correct ? '✅ Correct! ' : '❌ Not quite! '}</span>
                  {q.explain}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {answered !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <CharButton character="next" onClick={next} style={{ width: '100%', justifyContent: 'center', padding: '14px', background: '#ff6b35' }}>
              {idx >= QUESTIONS.length - 1 ? '🎉 See Results' : 'Next Question →'}
            </CharButton>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}