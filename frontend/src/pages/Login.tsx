import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, ArrowRight, Zap, Play, Home, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const Orb = ({ style }: { style: React.CSSProperties }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
    transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
    style={style}
  />
);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      // ✅ Show exact backend message — handles pending/rejected/suspended states clearly
      const msg = err.response?.data || err.message || 'Login failed. Please try again.';
      toast.error(typeof msg === 'string' ? msg : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    demoLogin();
    toast.success('Welcome, Demo Admin! 🚀');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated orbs */}
      <Orb style={{ width: 500, height: 500, top: -100, left: -100, background: 'hsla(252,87%,67%,0.12)' }} />
      <Orb style={{ width: 400, height: 400, bottom: -100, right: -50, background: 'hsla(160,84%,39%,0.09)' }} />
      <Orb style={{ width: 300, height: 300, top: '40%', left: '30%', background: 'hsla(220,90%,56%,0.07)' }} />

      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center px-12 relative">
        <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="max-w-md space-y-10">
          <div>
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'linear-gradient(135deg, hsl(252,87%,67%), hsl(265,85%,60%))', boxShadow: '0 8px 32px hsla(252,87%,67%,0.4)' }}
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-5xl font-extrabold leading-tight" style={{ background: 'linear-gradient(135deg, #fff 30%, hsl(252,87%,80%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Smart<br />Procurement
            </h2>
            <p className="text-lg mt-3" style={{ color: 'hsl(215,20%,55%)' }}>Manage your procurement operations with confidence and clarity.</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '⚡', text: 'Real-time approval workflows', gradient: 'from-violet-500/20 to-purple-500/10' },
              { icon: '🏢', text: 'Vendor relationship management', gradient: 'from-blue-500/20 to-cyan-500/10' },
              { icon: '📊', text: 'Comprehensive audit trails', gradient: 'from-emerald-500/20 to-teal-500/10' },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${item.gradient}`}
                style={{ border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium" style={{ color: 'hsl(214,32%,80%)' }}>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="floating-card p-8 w-full max-w-md"
        >
          {/* Top links */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80" style={{ color: 'hsl(215,20%,50%)' }}>
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs" style={{ color: 'hsl(215,20%,45%)' }}>Secure Connection</span>
            </div>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'linear-gradient(135deg, hsl(252,87%,67%), hsl(265,85%,60%))', boxShadow: '0 8px 32px hsla(252,87%,67%,0.4)' }}
            >
              <Lock className="w-7 h-7 text-white" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #fff, hsl(252,87%,80%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome Back</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-sm mt-1" style={{ color: 'hsl(215,20%,50%)' }}>Sign in to your procurement account</motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="form-label">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(215,20%,40%)' }} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Enter username"
                  required
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(215,20%,40%)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input pl-10 pr-11"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80"
                  style={{ color: 'hsl(215,20%,45%)' }}
                >
                  <AnimatePresence mode="wait">
                    {showPw
                      ? <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }}><EyeOff className="w-4 h-4" /></motion.div>
                      : <motion.div key="on" initial={{ scale: 0 }} animate={{ scale: 1 }}><Eye className="w-4 h-4" /></motion.div>
                    }
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              }
            </motion.button>
          </form>

          {/* Demo / Divider */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-5">
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-xs" style={{ color: 'hsl(215,20%,40%)' }}>or continue as</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemo}
              className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{
                background: 'linear-gradient(135deg, hsla(160,84%,39%,0.15), hsla(252,87%,67%,0.1))',
                border: '1px solid hsla(160,84%,39%,0.25)',
                color: 'hsl(160,84%,60%)',
              }}
            >
              <Play className="w-4 h-4" /> Explore Demo Mode
            </motion.button>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center text-sm mt-6" style={{ color: 'hsl(215,20%,45%)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors hover:opacity-80" style={{ color: 'hsl(252,87%,75%)' }}>Create one</Link>
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-3 text-center">
            <Link
              to="/vendor-login"
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all"
              style={{ color: 'hsl(160,84%,55%)', border: '1px solid hsla(160,84%,39%,0.3)', background: 'hsla(160,84%,39%,0.07)' }}
            >
              🏢 Login as Vendor
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
