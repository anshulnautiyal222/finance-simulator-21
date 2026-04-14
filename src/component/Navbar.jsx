import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import MenuBar from './MenuBar';
import AuthModal from './AuthModal';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'sticky', top: 0, zIndex: 500,
          background: 'rgba(7,9,15,0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,245,196,0.08)',
          padding: '0 2rem',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {/* Left: Menu + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <MenuBar onNavigate={onNavigate} currentPage={currentPage} />
          <motion.button
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.04 }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #00f5c4, #00c4ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 800, color: '#07090f',
              fontFamily: "'Syne',sans-serif",
            }}>F</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
              Fin<span style={{ color: '#00f5c4' }}>Quest</span>
            </span>
          </motion.button>
        </div>

        {/* Center: page indicator */}
        {currentPage !== 'home' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em',
              color: '#5a6a82',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '5px 14px', borderRadius: 100,
            }}
          >
            📍 {currentPage}
          </motion.div>
        )}

        {/* Right: Auth / User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div key="user" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setShowUserMenu(p => !p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'rgba(0,245,196,0.06)',
                    border: '1px solid rgba(0,245,196,0.2)',
                    borderRadius: 100, padding: '6px 14px 6px 6px',
                    cursor: 'pointer', color: '#e8edf5',
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00f5c4, #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', fontWeight: 700, color: 'white',
                    fontFamily: "'Syne',sans-serif",
                  }}>
                    {user.username[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '0.85rem' }}>{user.username}</span>
                  <span style={{ fontSize: '0.65rem', color: '#5a6a82' }}>▾</span>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      <div onClick={() => setShowUserMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        style={{
                          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                          background: '#0f1a2e', border: '1px solid rgba(0,245,196,0.12)',
                          borderRadius: 14, padding: '0.75rem', minWidth: 180, zIndex: 200,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        }}
                      >
                        <div style={{ padding: '0.5rem 0.75rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.5rem' }}>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.9rem' }}>{user.username}</div>
                          <div style={{ fontSize: '0.72rem', color: '#5a6a82' }}>{user.email}</div>
                        </div>
                        {[['📊','Dashboard',()=>onNavigate('dashboard')],['⚙️','Settings',()=>{}],['🚪','Logout',logout]].map(([icon,label,fn])=>(
                          <button key={label} onClick={()=>{fn();setShowUserMenu(false);}}
                            style={{ display:'flex',alignItems:'center',gap:10,width:'100%',padding:'0.65rem 0.75rem',background:'transparent',border:'none',color:'#e8edf5',cursor:'pointer',borderRadius:8,fontSize:'0.85rem',fontFamily:"'DM Sans',sans-serif",transition:'background 0.2s' }}
                            onMouseEnter={e=>e.target.style.background='rgba(255,255,255,0.05)'}
                            onMouseLeave={e=>e.target.style.background='transparent'}
                          >{icon} {label}</button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div key="auth" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => { setAuthMode('login'); setShowAuth(true); }}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 18px', color: '#e8edf5', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', transition: 'all 0.2s' }}
                >Login</motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => { setAuthMode('signup'); setShowAuth(true); }}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >Sign Up</motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <AnimatePresence>
        {showAuth && <AuthModal initialMode={authMode} onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </>
  );
}