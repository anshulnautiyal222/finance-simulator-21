import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Tutorial from './components/Tutorial';
import HeroSlides from './components/HeroSlides';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Invest from './pages/Invest';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import './styles/global.css';

const PAGE_TRANSITIONS = {
  initial: { opacity: 0, y: 20, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.99 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
};

function AppInner() {
  const [page, setPage] = useState('home');

  const navigate = (id) => setPage(id);

  const pageThemes = {
    home: '#07090f',
    dashboard: '#070f0d',
    budget: '#0a0714',
    invest: '#071410',
    quiz: '#140a07',
    leaderboard: '#14110a',
  };

  return (
    <div style={{ minHeight: '100vh', background: pageThemes[page] || '#07090f', transition: 'background 0.8s ease' }}>
      {/* Grid background */}
      <div className="grid-bg" />

      {/* Cursor */}
      <Cursor />

      {/* Tutorial */}
      <Tutorial />

      {/* Ambient orbs */}
      <div className="orb" style={{ width: 600, height: 600, background: 'rgba(0,245,196,0.04)', top: -200, right: -100, animationDuration: '12s' }} />
      <div className="orb" style={{ width: 500, height: 500, background: 'rgba(124,58,237,0.04)', bottom: -100, left: -150, animationDuration: '9s', animationDelay: '-5s' }} />

      {/* Navbar */}
      <Navbar onNavigate={navigate} currentPage={page} />

      {/* Pages */}
      <AnimatePresence mode="wait">
        <motion.div key={page} {...PAGE_TRANSITIONS} style={{ position: 'relative', zIndex: 1 }}>
          {page === 'home' && <HeroSlides />}
          {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {page === 'budget' && <Budget />}
          {page === 'invest' && <Invest />}
          {page === 'quiz' && <Quiz />}
          {page === 'leaderboard' && <Leaderboard />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom ticker */}
      {page === 'home' && <MarketTicker />}
    </div>
  );
}

function MarketTicker() {
  const ITEMS = [
    ['RELIANCE', '+1.2%', true], ['TCS', '-0.4%', false], ['HDFC BANK', '+0.8%', true],
    ['INFOSYS', '+2.1%', true], ['WIPRO', '-1.5%', false], ['AIRTEL', '+0.5%', true],
    ['ZOMATO', '-3.2%', false], ['PAYTM', '-0.8%', false], ['SENSEX', '+0.3%', true],
    ['NIFTY 50', '+0.2%', true], ['GOLD', '+0.1%', true], ['SBI FD', '7.2% p.a.', true],
  ];
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(7,9,15,0.95)', borderTop: '1px solid rgba(0,245,196,0.08)', padding: '0.5rem 0', height: 36, overflow: 'hidden' }}>
      <motion.div
        animate={{ x: [0, '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {doubled.map(([name, val, up], i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Space Mono',monospace", fontSize: '0.65rem' }}>
            <span style={{ color: '#5a6a82' }}>{name}</span>
            <span style={{ color: up ? '#10b981' : '#ef4444' }}>{val}</span>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}