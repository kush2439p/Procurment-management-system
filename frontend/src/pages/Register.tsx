import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, UserPlus, Home, Lock, User, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, password);
      toast.success('Account created! Please sign in. 🎉');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Username may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Access full procurement dashboard',
    'Create and track requisitions',
    'Manage vendor relationships',
    'Approve purchase orders',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated orbs */}
      <motion.div
        className="absolute rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{ width: 500, height: 500, top: -150, right: -100, background: 'hsla(252,87%,67%,0.1)' }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, delay: 3 }}
        style={{ width: 400, height: 400, bottom: -100, left: -100, background: 'hsla(160,84%,39%,0.08)' }}
      />

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left panel - hidden on small screens */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block"
        >
          <div className="space-y-6">
            <div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, hsl(252,87%,67%), hsl(265,85%,60%))', boxShadow: '0 8px 32px hsla(252,87%,67%,0.4)' }}
              >
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <h2
                className="text-4xl font-extrabold leading-tight"
                style={{ background: 'linear-gradient(135deg, #fff 30%, hsl(252,87%,80%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Join ProcureFlow
              </h2>
              <p className="text-base mt-3" style={{ color: 'hsl(215,20%,55%)' }}>
                Create your account and start managing procurement like a pro.
              </p>
            </div>

            <div className="space-y-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'hsla(160,84%,39%,0.15)', border: '1px solid hsla(160,84%,39%,0.3)' }}
                  >
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: 'hsl(160,84%,55%)' }} />
                  </div>
                  <span className="text-sm" style={{ color: 'hsl(214,32%,75%)' }}>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right form card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="floating-card p-8"
        >
          {/* Top links */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: 'hsl(215,20%,50%)' }}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: 'hsl(252,87%,75%)' }}
            >
              Already a member? Sign in
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, hsl(252,87%,67%), hsl(265,85%,60%))', boxShadow: '0 8px 32px hsla(252,87%,67%,0.4)' }}
            >
              <UserPlus className="w-7 h-7 text-white" />
            </motion.div>
            <h1
              className="text-xl font-bold"
              style={{ background: 'linear-gradient(135deg, #fff, hsl(252,87%,80%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Create Account
            </h1>
            <p className="text-sm mt-1" style={{ color: 'hsl(215,20%,50%)' }}>Join the procurement system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(215,20%,40%)' }} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(215,20%,40%)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input pl-10 pr-11"
                  placeholder="Choose a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
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
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
              }
            </motion.button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'hsl(215,20%,45%)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-opacity hover:opacity-80" style={{ color: 'hsl(252,87%,75%)' }}>
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
