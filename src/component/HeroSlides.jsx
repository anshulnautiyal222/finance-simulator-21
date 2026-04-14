import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    id: 0,
    title: 'Master Your Money',
    subtitle: 'Gen-Z Financial Simulator',
    desc: 'Start with ₹10,000 virtual cash. Budget, invest, and survive the month — all without risking real money.',
    color: '#00f5c4',
    bg: 'radial-gradient(ellipse at 60% 50%, rgba(0,245,196,0.08) 0%, transparent 70%)',
    illustration: <MoneyIllustration />,
  },
  {
    id: 1,
    title: 'Budget Like a Pro',
    subtitle: 'Rent · Food · Fun · Transport',
    desc: 'Every decision counts. Overspend on entertainment? Watch your financial health score drop in real time.',
    color: '#7c3aed',
    bg: 'radial-gradient(ellipse at 40% 50%, rgba(124,58,237,0.1) 0%, transparent 70%)',
    illustration: <BudgetIllustration />,
  },
  {
    id: 2,
    title: 'Invest & Grow',
    subtitle: 'FD · Mutual Funds · Stocks',
    desc: 'Pick your strategy. Play it safe with FDs, diversify with Mutual Funds, or chase big returns in the stock market.',
    color: '#10b981',
    bg: 'radial-gradient(ellipse at 60% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)',
    illustration: <InvestIllustration />,
  },
  {
    id: 3,
    title: 'Learn While Playing',
    subtitle: '5 Quiz Challenges Await',
    desc: 'Pop quizzes triggered by market events teach you real concepts. Earn XP and bonus balance for correct answers.',
    color: '#ff6b35',
    bg: 'radial-gradient(ellipse at 40% 50%, rgba(255,107,53,0.08) 0%, transparent 70%)',
    illustration: <QuizIllustration />,
  },
  {
    id: 4,
    title: 'Climb the Ranks',
    subtitle: 'Global Leaderboard',
    desc: 'Ranked by Financial Health Score — not just profits. Be wise, be diverse, be the champion.',
    color: '#fbbf24',
    bg: 'radial-gradient(ellipse at 60% 50%, rgba(251,191,36,0.08) 0%, transparent 70%)',
    illustration: <LeaderboardIllustration />,
  },
];

export default function HeroSlides() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(p => (p + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = SLIDES[current];

  return (
    <div style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Animated background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', inset: 0, background: slide.bg, pointerEvents: 'none' }}
        />
      </AnimatePresence>

      {/* Floating particles */}
      <FloatingParticles color={slide.color} />

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        {/* Text side */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`text-${current}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: direction * -60, filter: 'blur(8px)' }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              style={{
                display: 'inline-block',
                fontFamily: "'Space Mono',monospace",
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: slide.color,
                background: `${slide.color}18`,
                border: `1px solid ${slide.color}35`,
                padding: '5px 14px',
                borderRadius: 100,
                marginBottom: '1.5rem',
              }}
            >
              {slide.subtitle}
            </motion.div>

            <h1 style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 800,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 1.05, marginBottom: '1.25rem',
            }}>
              {slide.title.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: 'inline-block', marginRight: '0.35em',
                    color: i === 1 ? slide.color : '#e8edf5',
                    textShadow: i === 1 ? `0 0 40px ${slide.color}60` : 'none',
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#8a9bb5', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 480 }}>
              {slide.desc}
            </p>

            {/* Slide counter / dots */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {SLIDES.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => goTo(i)}
                  animate={{
                    width: i === current ? 32 : 8,
                    background: i === current ? slide.color : 'rgba(255,255,255,0.15)',
                  }}
                  style={{ height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }}
                />
              ))}
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', color: '#5a6a82', marginLeft: 8 }}>
                {String(current + 1).padStart(2, '0')} / {SLIDES.length}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Illustration side */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`illus-${current}`}
            initial={{ opacity: 0, scale: 0.75, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.75, rotate: 5 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {slide.illustration}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar at bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          key={current}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 7, ease: 'linear' }}
          style={{ height: '100%', background: slide.color, boxShadow: `0 0 10px ${slide.color}` }}
        />
      </div>
    </div>
  );
}

function FloatingParticles({ color }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          style={{
            position: 'absolute',
            left: `${(i * 8.5) % 100}%`,
            top: `${20 + (i * 12) % 60}%`,
            width: 4 + (i % 3) * 3,
            height: 4 + (i % 3) * 3,
            borderRadius: '50%',
            background: color,
            filter: `blur(${i % 3}px)`,
          }}
        />
      ))}
    </div>
  );
}

// SVG Illustrations
function MoneyIllustration() {
  return (
    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="340" height="320" viewBox="0 0 340 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Floating coin pile */}
        <ellipse cx="170" cy="260" rx="90" ry="20" fill="rgba(0,245,196,0.08)"/>

        {/* Big coin */}
        <motion.g animate={{ rotateY: [0, 180, 360] }} transition={{ duration: 4, repeat: Infinity }}>
          <circle cx="170" cy="140" r="80" fill="url(#coinGrad)" filter="url(#glow)"/>
          <circle cx="170" cy="140" r="72" fill="none" stroke="rgba(0,245,196,0.4)" strokeWidth="2"/>
          <text x="170" y="155" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#07090f">₹</text>
          <circle cx="170" cy="140" r="80" fill="url(#coinShine)" opacity="0.4"/>
        </motion.g>

        {/* Small coins floating */}
        {[[-70,-30],[80,-50],[-50,40],[75,30]].map(([dx,dy],i) => (
          <motion.g key={i} animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }} transition={{ duration: 2.5+i*0.4, repeat: Infinity, delay: i*0.5 }}>
            <circle cx={170+dx} cy={140+dy} r="18" fill={`rgba(0,245,196,${0.15+i*0.05})`} stroke="rgba(0,245,196,0.4)" strokeWidth="1.5"/>
            <text x={170+dx} y={140+dy+5} textAnchor="middle" fontSize="14" fill="#00f5c4">₹</text>
          </motion.g>
        ))}

        {/* Stars */}
        {[[40,60],[290,80],[50,200],[300,180]].map(([x,y],i) => (
          <motion.text key={i} x={x} y={y} animate={{ scale:[1,1.4,1], opacity:[0.4,1,0.4] }} transition={{ duration:1.5+i*0.3, repeat:Infinity, delay:i*0.4 }} fontSize="16" textAnchor="middle">✨</motion.text>
        ))}

        {/* Plant decoration */}
        <motion.g animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity, transformOrigin: '220px 280px' }}>
          <rect x="215" y="250" width="10" height="30" rx="3" fill="#10b981"/>
          <ellipse cx="220" cy="245" rx="16" ry="20" fill="#10b981" opacity="0.8"/>
          <ellipse cx="205" cy="255" rx="12" ry="8" fill="#059669" transform="rotate(-20,205,255)"/>
          <ellipse cx="235" cy="255" rx="12" ry="8" fill="#059669" transform="rotate(20,235,255)"/>
        </motion.g>

        <defs>
          <radialGradient id="coinGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#fbbf24"/>
            <stop offset="60%" stopColor="#d97706"/>
            <stop offset="100%" stopColor="#92400e"/>
          </radialGradient>
          <radialGradient id="coinShine" cx="30%" cy="25%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}

function BudgetIllustration() {
  return (
    <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
      <svg width="320" height="300" viewBox="0 0 320 300" fill="none">
        {/* Budget chart bars */}
        {[['🏠',60,'#7c3aed',80],['🍛',40,'#00f5c4',50],['🎉',30,'#ff6b35',90],['🚌',20,'#fbbf24',40]].map(([icon,x,color,h],i) => (
          <motion.g key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i*0.15, type:'spring' }}
            style={{ transformOrigin: `${x+20}px 220px` }}>
            <rect x={x} y={220-h} width={40} height={h} rx={8} fill={color} opacity={0.8}/>
            <rect x={x} y={220-h} width={40} height={16} rx={8} fill={color}/>
            <text x={x+20} y={238} textAnchor="middle" fontSize="16">{icon}</text>
          </motion.g>
        ))}

        {/* Axis */}
        <line x1="45" y1="220" x2="200" y2="220" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

        {/* Cute character */}
        <motion.g animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          {/* Body */}
          <circle cx="255" cy="160" r="30" fill="#7c3aed"/>
          {/* Face */}
          <circle cx="248" cy="156" r="4" fill="white"/>
          <circle cx="262" cy="156" r="4" fill="white"/>
          <circle cx="249" cy="157" r="2" fill="#1a0030"/>
          <circle cx="263" cy="157" r="2" fill="#1a0030"/>
          <path d="M248 165 Q255 171 262 165" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Arms */}
          <path d="M225 155 Q215 148 210 155" stroke="#7c3aed" strokeWidth="8" strokeLinecap="round"/>
          <path d="M285 155 Q295 148 300 155" stroke="#7c3aed" strokeWidth="8" strokeLinecap="round"/>
          {/* Legs */}
          <rect x="242" y="188" width="10" height="20" rx="5" fill="#5b21b6"/>
          <rect x="258" y="188" width="10" height="20" rx="5" fill="#5b21b6"/>
          {/* Hat */}
          <rect x="235" y="118" width="40" height="8" rx="4" fill="#4c1d95"/>
          <rect x="240" y="100" width="30" height="22" rx="6" fill="#4c1d95"/>
          <rect x="244" y="104" width="6" height="12" rx="2" fill="#fbbf24"/>
        </motion.g>

        {/* Plants */}
        <motion.g animate={{ rotate: [0, 5, 0] }} transition={{ duration: 2.5, repeat: Infinity, transformOrigin: '40px 280px' }}>
          <rect x="36" y="262" width="8" height="20" rx="3" fill="#10b981"/>
          <ellipse cx="40" cy="258" rx="14" ry="16" fill="#10b981"/>
        </motion.g>

        <text x="160" y="285" textAnchor="middle" fontSize="12" fontFamily="Space Mono" fill="rgba(255,255,255,0.3)">Monthly Budget</text>
      </svg>
    </motion.div>
  );
}

function InvestIllustration() {
  return (
    <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 4, repeat: Infinity }}>
      <svg width="340" height="300" viewBox="0 0 340 300" fill="none">
        {/* Chart line */}
        <motion.path
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          d="M30 220 L80 190 L110 200 L150 150 L190 130 L220 110 L260 80 L300 50"
          stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round"
        />
        {/* Area fill */}
        <path d="M30 220 L80 190 L110 200 L150 150 L190 130 L220 110 L260 80 L300 50 L300 240 L30 240 Z"
          fill="url(#investGrad)" opacity="0.15"/>
        {/* Dots */}
        {[[80,190],[150,150],[220,110],[300,50]].map(([x,y],i) => (
          <motion.circle key={i} cx={x} cy={y} r={6} fill="#10b981"
            animate={{ scale: [1,1.5,1] }} transition={{ duration:1.5, repeat:Infinity, delay:i*0.3 }}
            style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}
          />
        ))}
        {/* Axis */}
        <line x1="30" y1="240" x2="310" y2="240" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <line x1="30" y1="50" x2="30" y2="240" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

        {/* Cute rocket character */}
        <motion.g animate={{ y: [0,-10,0], rotate:[0,5,0] }} transition={{ duration:2, repeat:Infinity }}>
          <text x="300" y="40" fontSize="36">🚀</text>
        </motion.g>

        {/* Investment labels */}
        <motion.g animate={{ opacity:[0.6,1,0.6] }} transition={{ duration:2, repeat:Infinity }}>
          <rect x="30" y="255" width="50" height="20" rx="4" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
          <text x="55" y="269" textAnchor="middle" fontSize="9" fill="#10b981" fontFamily="Space Mono">FD 7.2%</text>
          <rect x="90" y="255" width="70" height="20" rx="4" fill="rgba(0,245,196,0.1)" stroke="rgba(0,245,196,0.3)" strokeWidth="1"/>
          <text x="125" y="269" textAnchor="middle" fontSize="9" fill="#00f5c4" fontFamily="Space Mono">MF 12-18%</text>
          <rect x="170" y="255" width="70" height="20" rx="4" fill="rgba(255,107,53,0.1)" stroke="rgba(255,107,53,0.3)" strokeWidth="1"/>
          <text x="205" y="269" textAnchor="middle" fontSize="9" fill="#ff6b35" fontFamily="Space Mono">STOCKS</text>
        </motion.g>

        {/* Plant */}
        <motion.g animate={{ rotate:[-4,4,-4] }} transition={{ duration:3, repeat:Infinity, transformOrigin:'50px 280px'}}>
          <rect x="46" y="262" width="8" height="20" rx="3" fill="#059669"/>
          <ellipse cx="50" cy="256" rx="16" ry="18" fill="#059669"/>
          <ellipse cx="35" cy="266" rx="12" ry="8" fill="#047857" transform="rotate(-25,35,266)"/>
        </motion.g>

        <defs>
          <linearGradient id="investGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

function QuizIllustration() {
  return (
    <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity }}>
      <svg width="320" height="310" viewBox="0 0 320 310" fill="none">
        {/* Question cards floating */}
        {[
          { x: 40, y: 80, rot: -8, q: 'What is NAV?', c: '#ff6b35' },
          { x: 170, y: 50, rot: 5, q: 'FD vs MF?', c: '#7c3aed' },
          { x: 100, y: 170, rot: -4, q: '50-30-20?', c: '#00f5c4' },
        ].map((card, i) => (
          <motion.g key={i} animate={{ y: [0,-8,0], rotate: [card.rot, card.rot+3, card.rot] }}
            transition={{ duration: 2.5+i*0.4, repeat: Infinity, delay: i*0.6 }}>
            <rect x={card.x} y={card.y} width={110} height={55} rx={12}
              fill={`${card.c}15`} stroke={`${card.c}50`} strokeWidth={1.5}/>
            <text x={card.x+8} y={card.y+18} fontSize="10" fill={card.c} fontFamily="Space Mono">❓</text>
            <text x={card.x+55} y={card.y+32} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.7)" fontFamily="DM Sans">{card.q}</text>
          </motion.g>
        ))}

        {/* Owl character */}
        <motion.g animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, transformOrigin: '230px 220px' }}>
          {/* Body */}
          <ellipse cx="230" cy="230" rx="35" ry="40" fill="#ff6b35"/>
          {/* Wings */}
          <ellipse cx="200" cy="230" rx="18" ry="25" fill="#ea5520" transform="rotate(-20,200,230)"/>
          <ellipse cx="260" cy="230" rx="18" ry="25" fill="#ea5520" transform="rotate(20,260,230)"/>
          {/* Head */}
          <circle cx="230" cy="190" r="30" fill="#ff6b35"/>
          {/* Ears */}
          <polygon points="210,164 218,178 202,178" fill="#ff6b35"/>
          <polygon points="250,164 258,178 242,178" fill="#ff6b35"/>
          {/* Eyes */}
          <circle cx="220" cy="188" r="12" fill="white"/>
          <circle cx="240" cy="188" r="12" fill="white"/>
          <circle cx="221" cy="189" r="6" fill="#1a0a00"/>
          <circle cx="241" cy="189" r="6" fill="#1a0a00"/>
          <circle cx="223" cy="187" r="2" fill="white"/>
          <circle cx="243" cy="187" r="2" fill="white"/>
          {/* Beak */}
          <polygon points="230,196 223,204 237,204" fill="#fbbf24"/>
          {/* Graduation cap */}
          <rect x="208" y="158" width="44" height="6" rx="2" fill="#1a0a00"/>
          <rect x="214" y="144" width="32" height="18" rx="4" fill="#1a0a00"/>
          <line x1="252" y1="161" x2="268" y2="174" stroke="#fbbf24" strokeWidth="2"/>
          <circle cx="268" cy="175" r="4" fill="#fbbf24"/>
        </motion.g>

        {/* Stars */}
        {[[30,250],[290,100],[40,160]].map(([x,y],i)=>(
          <motion.text key={i} x={x} y={y} animate={{scale:[1,1.5,1],opacity:[0.4,1,0.4]}} transition={{duration:2,repeat:Infinity,delay:i*0.5}} fontSize="18" textAnchor="middle">⭐</motion.text>
        ))}
      </svg>
    </motion.div>
  );
}

function LeaderboardIllustration() {
  return (
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
      <svg width="340" height="300" viewBox="0 0 340 300" fill="none">
        {/* Podium */}
        <rect x="100" y="160" width="60" height="80" rx="8" fill="rgba(148,163,184,0.2)" stroke="rgba(148,163,184,0.4)" strokeWidth="1"/>
        <rect x="140" y="130" width="60" height="110" rx="8" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5"/>
        <rect x="180" y="185" width="60" height="55" rx="8" fill="rgba(205,124,69,0.2)" stroke="rgba(205,124,69,0.4)" strokeWidth="1"/>

        {/* Numbers */}
        <text x="130" y="210" textAnchor="middle" fontSize="20" fontFamily="Syne" fontWeight="800" fill="rgba(148,163,184,0.8)">2</text>
        <text x="170" y="190" textAnchor="middle" fontSize="24" fontFamily="Syne" fontWeight="800" fill="rgba(251,191,36,0.9)">1</text>
        <text x="210" y="225" textAnchor="middle" fontSize="18" fontFamily="Syne" fontWeight="800" fill="rgba(205,124,69,0.8)">3</text>

        {/* Trophy */}
        <motion.text x="170" y="118" textAnchor="middle" fontSize="36"
          animate={{ scale:[1,1.15,1], rotate:[-5,5,-5] }} transition={{ duration:2, repeat:Infinity }}>🏆</motion.text>

        {/* Characters on podium */}
        <motion.text x="130" y="158" textAnchor="middle" fontSize="24" animate={{y:[0,-5,0]}} transition={{duration:2,repeat:Infinity,delay:0.3}}>🧑</motion.text>
        <motion.text x="170" y="126" textAnchor="middle" fontSize="28" animate={{y:[0,-7,0]}} transition={{duration:2,repeat:Infinity}}>👑</motion.text>
        <motion.text x="210" y="180" textAnchor="middle" fontSize="22" animate={{y:[0,-4,0]}} transition={{duration:2,repeat:Infinity,delay:0.6}}>👧</motion.text>

        {/* Floating stars and confetti */}
        {['🥇','🥈','🥉','⭐','✨','🎉'].map((e,i)=>(
          <motion.text key={i} x={30+i*50} y={40+i*15%50}
            animate={{ y:[-5,5,-5], opacity:[0.5,1,0.5], rotate:[0,20,0] }}
            transition={{ duration:2+i*0.3, repeat:Infinity, delay:i*0.4 }}
            fontSize="18" textAnchor="middle">{e}</motion.text>
        ))}

        {/* Score bars */}
        <rect x="260" y="80" width="60" height="10" rx="5" fill="rgba(251,191,36,0.3)"/>
        <motion.rect x="260" y="80" width="0" height="10" rx="5" fill="#fbbf24"
          animate={{width:55}} transition={{duration:1.5,delay:0.2}}/>
        <rect x="260" y="98" width="60" height="10" rx="5" fill="rgba(148,163,184,0.2)"/>
        <motion.rect x="260" y="98" width="0" height="10" rx="5" fill="#94a3b8"
          animate={{width:42}} transition={{duration:1.5,delay:0.4}}/>
        <rect x="260" y="116" width="60" height="10" rx="5" fill="rgba(205,124,69,0.2)"/>
        <motion.rect x="260" y="116" width="0" height="10" rx="5" fill="#cd7c45"
          animate={{width:30}} transition={{duration:1.5,delay:0.6}}/>

        {/* Labels */}
        <text x="258" y="76" textAnchor="end" fontSize="10" fill="rgba(251,191,36,0.8)" fontFamily="Space Mono">94</text>
        <text x="258" y="94" textAnchor="end" fontSize="10" fill="rgba(148,163,184,0.7)" fontFamily="Space Mono">88</text>
        <text x="258" y="112" textAnchor="end" fontSize="10" fill="rgba(205,124,69,0.7)" fontFamily="Space Mono">81</text>

        {/* Ground shadow */}
        <ellipse cx="170" cy="285" rx="100" ry="12" fill="rgba(251,191,36,0.06)"/>
      </svg>
    </motion.div>
  );
}