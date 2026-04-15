import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext/AppContent';

const MOCK_OTP = '123456';

export default function AuthModal({ onClose }) {
  const { login } = useApp();
  const [mode, setMode] = useState('login'); // login | signup | otp | username
  const [form, setForm] = useState({ name: '', lastName: '', dob: '', email: '', username: '', password: '', otp: '' });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const validate = () => {
    const e = {};
    if (mode === 'signup') {
      if (!form.name.trim()) e.name = 'Required';
      if (!form.email.includes('@')) e.email = 'Invalid email';
      if (!form.dob) e.dob = 'Required';
    }
    if (mode === 'login') {
      if (!form.username.trim()) e.username = 'Required';
      if (!form.password) e.password = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setMode('otp');
    setOtpSent(true);
  };

  const handleOTP = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    if (form.otp === MOCK_OTP || form.otp.length === 6) {
      setMode('username');
    } else {
      setErrors({ otp: 'Invalid OTP. Try 123456 for demo.' });
    }
  };

  const handleUsername = async () => {
    if (!form.username.trim() || !form.password) {
      setErrors({ username: !form.username.trim() ? 'Required' : '', password: !form.password ? 'Required' : '' });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setMode('login');
  };

  const handleLogin = async () => {
    if (!form.username.trim() || !form.password) {
      setErrors({ username: !form.username.trim() ? 'Required' : '', password: !form.password ? 'Enter password' : '' });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    login({ username: form.username, name: form.name || form.username, email: form.email });
    onClose();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    login({ username: 'GoogleUser', name: 'Google User', email: 'user@gmail.com' });
    onClose();
  };

  const InputField = ({ label, field, type = 'text', placeholder, icon }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: "'Space Mono',monospace", color: '#8a9bb5', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', zIndex: 1 }}>{icon}</span>}
        <input
          type={type === 'password' ? (showPass ? 'text' : 'password') : type}
          value={form[field]}
          onChange={e => { update(field, e.target.value); setErrors(p => ({ ...p, [field]: '' })); }}
          placeholder={placeholder}
          className="input-field"
          style={{ paddingLeft: icon ? 42 : 16, ...(errors[field] ? { borderColor: '#ef4444' } : {}) }}
        />
        {type === 'password' && (
          <button onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5a6a82', fontSize: '0.9rem' }}>
            {showPass ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {errors[field] && <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: 4 }}>{errors[field]}</div>}
    </div>
  );

  const pages = {
    login: (
      <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👋</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem' }}>Welcome Back</h2>
          <p style={{ color: '#5a6a82', fontSize: '0.85rem' }}>Login to continue your financial journey</p>
        </div>

        {forgotMode ? (
          <>
            <div style={{ background: 'rgba(0,245,196,0.06)', border: '1px solid rgba(0,245,196,0.2)', borderRadius: 10, padding: '1rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#8a9bb5' }}>
              📧 Enter your registered email and we'll send a reset link.
            </div>
            <InputField label="Email" field="email" type="email" placeholder="your@email.com" icon="📧" />
            <button className="btn-primary" onClick={() => setForgotMode(false)} style={{ width: '100%', justifyContent: 'center' }}>Send Reset Link</button>
            <button onClick={() => setForgotMode(false)} style={{ display: 'block', margin: '1rem auto 0', background: 'none', border: 'none', color: '#5a6a82', cursor: 'pointer', fontSize: '0.85rem' }}>← Back to Login</button>
          </>
        ) : (
          <>
            <InputField label="Username" field="username" placeholder="your_username" icon="👤" />
            <InputField label="Password" field="password" type="password" placeholder="••••••••" icon="🔒" />
            <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
              <button onClick={() => setForgotMode(true)} style={{ background: 'none', border: 'none', color: '#00f5c4', cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Space Mono',monospace" }}>Forgot Password?</button>
            </div>
            <LoadingButton loading={loading} onClick={handleLogin} label="Login →" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '1.25rem 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ color: '#5a6a82', fontSize: '0.75rem' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', color: '#e8edf5', fontSize: '0.9rem', fontFamily: "'DM Sans',sans-serif" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </motion.button>
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#5a6a82' }}>
              No account? <button onClick={() => { setMode('signup'); setErrors({}); }} style={{ background: 'none', border: 'none', color: '#00f5c4', cursor: 'pointer', fontWeight: 600 }}>Sign up free</button>
            </div>
          </>
        )}
      </motion.div>
    ),

    signup: (
      <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌟</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Create Account</h2>
          <p style={{ color: '#5a6a82', fontSize: '0.82rem' }}>Join thousands mastering their finances</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: "'Space Mono',monospace", color: '#8a9bb5', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>First Name</label>
            <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Riya" className="input-field" style={errors.name ? { borderColor: '#ef4444' } : {}} />
            {errors.name && <div style={{ color: '#ef4444', fontSize: '0.68rem', marginTop: 2 }}>{errors.name}</div>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: "'Space Mono',monospace", color: '#8a9bb5', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Last Name</label>
            <input value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Sharma" className="input-field" />
          </div>
        </div>
        <div style={{ height: '0.75rem' }} />
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: "'Space Mono',monospace", color: '#8a9bb5', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date of Birth</label>
          <input type="date" value={form.dob} onChange={e => update('dob', e.target.value)} className="input-field" style={{ colorScheme: 'dark', ...(errors.dob ? { borderColor: '#ef4444' } : {}) }} />
          {errors.dob && <div style={{ color: '#ef4444', fontSize: '0.68rem', marginTop: 2 }}>{errors.dob}</div>}
        </div>
        <div style={{ height: '0.75rem' }} />
        <InputField label="Email Address" field="email" type="email" placeholder="you@example.com" icon="📧" />
        <LoadingButton loading={loading} onClick={handleSignup} label="Send OTP →" />
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#5a6a82' }}>
          Have an account? <button onClick={() => { setMode('login'); setErrors({}); }} style={{ background: 'none', border: 'none', color: '#00f5c4', cursor: 'pointer', fontWeight: 600 }}>Login</button>
        </div>
      </motion.div>
    ),

    otp: (
      <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📱</motion.div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Check Your Email</h2>
          <p style={{ color: '#5a6a82', fontSize: '0.85rem' }}>We sent a 6-digit OTP to <strong style={{ color: '#00f5c4' }}>{form.email || 'your email'}</strong></p>
          <p style={{ color: '#8a9bb5', fontSize: '0.75rem', marginTop: 6 }}>Demo: use <code style={{ background: 'rgba(0,245,196,0.1)', padding: '2px 6px', borderRadius: 4, color: '#00f5c4' }}>123456</code></p>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: "'Space Mono',monospace", color: '#8a9bb5', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Enter OTP</label>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {[0,1,2,3,4,5].map(i => (
              <input
                key={i}
                maxLength={1}
                value={form.otp[i] || ''}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  const otp = form.otp.split('');
                  otp[i] = val;
                  update('otp', otp.join(''));
                  if (val && e.target.nextSibling) e.target.nextSibling.focus();
                }}
                style={{
                  width: 46, height: 56, textAlign: 'center', fontSize: '1.4rem',
                  fontFamily: "'Space Mono',monospace", fontWeight: 700,
                  background: 'var(--bg3)', border: `2px solid ${form.otp[i] ? '#00f5c4' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 10, color: '#e8edf5', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            ))}
          </div>
          {errors.otp && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 8, textAlign: 'center' }}>{errors.otp}</div>}
        </div>
        <LoadingButton loading={loading} onClick={handleOTP} label="Verify OTP →" />
      </motion.div>
    ),

    username: (
      <motion.div key="username" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎮</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.4rem' }}>Almost There!</h2>
          <p style={{ color: '#5a6a82', fontSize: '0.85rem' }}>Choose your FinQuest username & set a password</p>
        </div>
        <InputField label="Choose Username" field="username" placeholder="money_master_99" icon="🎯" />
        <InputField label="Create Password" field="password" type="password" placeholder="min 8 characters" icon="🔒" />
        <div style={{ background: 'rgba(0,245,196,0.04)', border: '1px solid rgba(0,245,196,0.12)', borderRadius: 8, padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.78rem', color: '#8a9bb5' }}>
          💡 This will be your public leaderboard name. Choose wisely!
        </div>
        <LoadingButton loading={loading} onClick={handleUsername} label="Create Account 🚀" />
      </motion.div>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(12px)',
        zIndex: 5000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          background: 'linear-gradient(135deg, #0f1a2e 0%, #0c1320 100%)',
          border: '1px solid rgba(0,245,196,0.15)',
          borderRadius: 24,
          padding: '2.5rem',
          width: '100%',
          maxWidth: 440,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,245,196,0.05)',
        }}
      >
        {/* Close */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.05)', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#5a6a82', fontSize: '1rem' }}
        >✕</motion.button>

        {/* Decorative orb */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(0,245,196,0.06), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <AnimatePresence mode="wait">
          {pages[mode]}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function LoadingButton({ loading, onClick, label }) {
  return (
    <motion.button
      className="btn-primary"
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading}
      style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.8 : 1, marginTop: '0.25rem' }}
    >
      {loading ? (
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'var(--bg)', borderRadius: '50%' }}
        />
      ) : label}
    </motion.button>
  );
}