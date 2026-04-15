import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext/AppContent';
import { useState, useEffect } from 'react';

const STEPS = [
  {
    id: 'menu',
    title: '☰ The Menu Bar',
    desc: 'This is your command center! Click here to navigate between all sections — Dashboard, Budget, Investments, Quiz, and Leaderboard. Each section has its own unique theme.',
    position: 'right',
    emoji: '🗺️',
  },
  {
    id: 'slides',
    title: '🎠 Hero Slides',
    desc: 'These animated slides introduce you to FinQuest. They cycle automatically every 7 seconds. Each slide tells a part of your financial story!',
    position: 'bottom',
    emoji: '🎡',
  },
  {
    id: 'auth',
    title: '👤 Login / Signup',
    desc: 'Create your account here! Your progress, investments, and score are all tied to your profile. Login with email or Google.',
    position: 'left',
    emoji: '🔐',
  },
  {
    id: 'dashboard',
    title: '📊 Dashboard',
    desc: 'Your financial command center. See your balance, health score, spending breakdown, and day progress all in one glance.',
    position: 'bottom',
    emoji: '💡',
  },
  {
    id: 'budget',
    title: '💸 Budget Panel',
    desc: 'Allocate your ₹10,000 across Rent, Food, Entertainment, and Transport. Every rupee you spend affects your Financial Health Score!',
    position: 'bottom',
    emoji: '🧮',
  },
  {
    id: 'invest',
    title: '📈 Investment Panel',
    desc: 'Choose from Fixed Deposits (safe), Mutual Funds (balanced), or Stocks (risky). Your investment mix directly impacts your score.',
    position: 'bottom',
    emoji: '🚀',
  },
  {
    id: 'quiz',
    title: '🧠 Quiz Challenges',
    desc: 'Pop quizzes triggered by in-game events! Answer correctly to earn XP and bonus ₹ in your virtual wallet. 5 questions covering real finance concepts.',
    position: 'bottom',
    emoji: '❓',
  },
  {
    id: 'leaderboard',
    title: '🏆 Leaderboard',
    desc: 'Compete with other players! Rankings are based on your Financial Health Score — NOT just how much money you made. Be wise, not just lucky.',
    position: 'bottom',
    emoji: '🥇',
  },
];

export default function Tutorial() {
  const { tutorialActive, setTutorialActive, tutorialStep, setTutorialStep, tutorialEnabled, setTutorialEnabled } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (!tutorialActive || dismissed) return null;

  const step = STEPS[tutorialStep];
  const isLast = tutorialStep === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      setTutorialActive(false);
      setDismissed(true);
    } else {
      setTutorialStep(s => s + 1);
    }
  };

  const skip = () => {
    setTutorialActive(false);
    setTutorialEnabled(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="tutorial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Tutorial card */}
        <motion.div
          key={tutorialStep}
          initial={{ scale: 0.7, opacity: 0, y: 40, rotateX: -15 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{
            background: 'linear-gradient(135deg, #0f1a2e, #0c1320)',
            border: '1px solid rgba(0,245,196,0.3)',
            borderRadius: 24,
            padding: '2.5rem',
            maxWidth: 460,
            width: '90vw',
            position: 'relative',
            pointerEvents: 'all',
            boxShadow: '0 0 80px rgba(0,245,196,0.15), 0 40px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem' }}>
            {STEPS.map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === tutorialStep ? 28 : 8, background: i <= tutorialStep ? '#00f5c4' : 'rgba(255,255,255,0.1)' }}
                style={{ height: 4, borderRadius: 2 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* Emoji */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: '3.5rem', marginBottom: '1rem', display: 'block' }}
          >
            {step.emoji}
          </motion.div>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#00f5c4', marginBottom: '0.5rem' }}>
            Step {tutorialStep + 1} of {STEPS.length}
          </div>

          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.75rem', color: '#e8edf5' }}>
            {step.title}
          </h3>
          <p style={{ color: '#8a9bb5', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: '2rem' }}>
            {step.desc}
          </p>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={next}
              style={{
                flex: 1,
                background: '#00f5c4', color: '#07090f',
                border: 'none', borderRadius: 10,
                padding: '13px 24px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem',
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}
            >
              {isLast ? '🎉 Start Playing!' : 'Next →'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={skip}
              style={{
                background: 'transparent', color: '#5a6a82',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
                padding: '13px 16px',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Skip Tour
            </motion.button>
          </div>

          {/* Disable toggle */}
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              onClick={() => setTutorialEnabled(e => !e)}
              style={{
                width: 36, height: 20, borderRadius: 10,
                background: tutorialEnabled ? '#00f5c4' : 'rgba(255,255,255,0.1)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
              }}
            >
              <motion.div
                animate={{ x: tutorialEnabled ? 18 : 2 }}
                transition={{ type: 'spring', stiffness: 400 }}
                style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', top: 2 }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#5a6a82', fontFamily: "'Space Mono', monospace" }}>
              Show tutorial on login
            </span>
          </div>

          {/* Decorative corner */}
          <div style={{
            position: 'absolute', top: 16, right: 16,
            width: 60, height: 60,
            background: 'radial-gradient(circle, rgba(0,245,196,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}