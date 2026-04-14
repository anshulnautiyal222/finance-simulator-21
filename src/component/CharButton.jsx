import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Different cartoon characters for each button type
const CHARACTERS = {
  default: { emoji: '🐱', color: '#00f5c4', peekFrom: 'bottom' },
  invest: { emoji: '🦊', color: '#10b981', peekFrom: 'right' },
  quiz: { emoji: '🦉', color: '#ff6b35', peekFrom: 'left' },
  budget: { emoji: '🐼', color: '#7c3aed', peekFrom: 'bottom' },
  leaderboard: { emoji: '🐯', color: '#fbbf24', peekFrom: 'top' },
  next: { emoji: '🐸', color: '#00f5c4', peekFrom: 'right' },
  primary: { emoji: '🚀', color: '#00f5c4', peekFrom: 'bottom' },
  auth: { emoji: '🦄', color: '#a78bfa', peekFrom: 'left' },
  spend: { emoji: '🐻', color: '#ff6b35', peekFrom: 'bottom' },
  day: { emoji: '⭐', color: '#fbbf24', peekFrom: 'right' },
};

export default function CharButton({
  children,
  onClick,
  character = 'default',
  style = {},
  className = '',
  disabled = false,
  variant = 'primary',
}) {
  const [hovered, setHovered] = useState(false);
  const char = CHARACTERS[character] || CHARACTERS.default;

  const peekVariants = {
    bottom: {
      initial: { y: 20, opacity: 0, scale: 0.5 },
      animate: { y: -4, opacity: 1, scale: 1 },
      exit: { y: 20, opacity: 0, scale: 0.4 },
    },
    top: {
      initial: { y: -20, opacity: 0, scale: 0.5 },
      animate: { y: 4, opacity: 1, scale: 1 },
      exit: { y: -20, opacity: 0, scale: 0.4 },
    },
    left: {
      initial: { x: -20, opacity: 0, scale: 0.5 },
      animate: { x: 0, opacity: 1, scale: 1 },
      exit: { x: -20, opacity: 0, scale: 0.4 },
    },
    right: {
      initial: { x: 20, opacity: 0, scale: 0.5 },
      animate: { x: 0, opacity: 1, scale: 1 },
      exit: { x: 20, opacity: 0, scale: 0.4 },
    },
  };

  const peek = peekVariants[char.peekFrom];

  const buttonStyles = {
    primary: {
      background: char.color,
      color: '#07090f',
      border: 'none',
      boxShadow: hovered ? `0 0 30px ${char.color}60` : `0 0 15px ${char.color}30`,
    },
    ghost: {
      background: hovered ? `${char.color}12` : 'transparent',
      color: hovered ? char.color : '#e8edf5',
      border: `1px solid ${hovered ? char.color : 'rgba(255,255,255,0.1)'}`,
    },
    danger: {
      background: hovered ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
      color: '#ef4444',
      border: '1px solid rgba(239,68,68,0.3)',
    },
  };

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '12px 24px',
        borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.9rem',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        position: 'relative', overflow: 'visible',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        opacity: disabled ? 0.5 : 1,
        ...buttonStyles[variant],
        ...style,
      }}
    >
      {/* Character peek */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={peek.initial}
            animate={peek.animate}
            exit={peek.exit}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              position: 'absolute',
              ...(char.peekFrom === 'bottom' ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)' } : {}),
              ...(char.peekFrom === 'top' ? { top: '100%', left: '50%', transform: 'translateX(-50%)' } : {}),
              ...(char.peekFrom === 'right' ? { right: '100%', top: '50%', transform: 'translateY(-50%)' } : {}),
              ...(char.peekFrom === 'left' ? { left: '100%', top: '50%', transform: 'translateY(-50%)' } : {}),
              zIndex: 10,
              pointerEvents: 'none',
              filter: `drop-shadow(0 0 8px ${char.color})`,
            }}
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: '1.6rem', lineHeight: 1 }}
            >
              {char.emoji}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shimmer on hover */}
      {hovered && variant === 'primary' && (
        <motion.div
          initial={{ x: '-100%' }} animate={{ x: '200%' }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}

      {children}
    </motion.button>
  );
}