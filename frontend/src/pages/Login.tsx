import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Eye, EyeOff, ArrowRight, Zap, Play } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Try Demo mode if backend is not running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    demoLogin();
    toast.success('Welcome! Logged in as Demo Admin');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <motion.div className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl -top-20 -left-20" animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 15, repeat: Infinity }} />
      <motion.div className="absolute w-80 h-80 rounded-full bg-success/10 blur-3xl bottom-0 right-0" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }} />

      {/* Left branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center px-12 relative">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 10 }} className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25">
              <ShoppingCart className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <span className="text-2xl font-bold text-foreground">ProcureFlow</span>
          </div>
          <h2 className="text-4xl font-extrabold text-foreground leading-tight">
            Manage procurement
            <span className="block bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">with confidence.</span>
          </h2>
          <div className="space-y-4">
            {['Real-time approval workflows', 'Vendor relationship management', 'Comprehensive audit trails'].map((text, i) => (
              <motion.div key={text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center"><Zap className="w-3 h-3 text-success" /></div>
                <span className="text-muted-foreground">{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="floating-card p-8 w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
              <ShoppingCart className="w-7 h-7 text-primary-foreground" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xl font-bold text-foreground">Welcome Back</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-sm text-muted-foreground mt-1">Sign in to your procurement account</motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="form-label">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="form-input" placeholder="Enter username" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label className="form-label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="form-input pr-10" placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          {/* Demo button */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-4">
            <div className="relative flex items-center my-4">
              <div className="flex-1 border-t border-border/50" />
              <span className="px-3 text-xs text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border/50" />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDemo} className="w-full py-3 rounded-lg bg-gradient-to-r from-success/20 to-primary/20 border border-success/30 text-foreground font-medium text-sm flex items-center justify-center gap-2 hover:from-success/30 hover:to-primary/30 transition-all">
              <Play className="w-4 h-4 text-success" /> Explore Demo (No Backend Needed)
            </motion.button>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}<Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
