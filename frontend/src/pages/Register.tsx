import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, UserPlus, Home, Lock, User, CheckCircle, Mail, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Register = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_EMPLOYEE');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAutoApproved, setIsAutoApproved] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, password, fullName, email, role);
      setIsAutoApproved(role === 'ROLE_EMPLOYEE');
      setSubmitted(true);
    } catch (err: any) {
      const msg = err.response?.data || err.message || 'Registration failed.';
      toast.error(typeof msg === 'string' ? msg : (msg?.message || 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          className="absolute rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ width: 500, height: 500, top: -150, right: -100, background: 'hsla(160,84%,39%,0.1)' }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="floating-card p-10 max-w-md w-full text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, hsl(160,84%,39%), hsl(160,84%,55%))', boxShadow: '0 8px 32px hsla(160,84%,39%,0.4)' }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-3" style={{ background: isAutoApproved ? 'linear-gradient(135deg, #fff, hsl(160,84%,70%))' : 'linear-gradient(135deg, #fff, hsl(252,87%,80%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {isAutoApproved ? 'Account Created!' : 'Registration Submitted!'}
          </h1>
          <p className="text-base mb-6" style={{ color: 'hsl(214,32%,70%)' }}>
            {isAutoApproved
              ? 'Your employee account is ready. You can log in immediately.'
              : 'Awaiting admin approval. You will receive an email once your account is approved.'}
          </p>
          {!isAutoApproved && (
            <div
              className="rounded-xl p-4 mb-6 text-sm"
              style={{ background: 'hsla(160,84%,39%,0.08)', border: '1px solid hsla(160,84%,39%,0.25)', color: 'hsl(160,84%,65%)' }}
            >
              <p className="font-semibold mb-1">⏳ What happens next?</p>
              <p>An admin will review your registration. Once approved, you'll receive an email at <strong>{email}</strong>.</p>
            </div>
          )}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={isAutoApproved ? { background: 'linear-gradient(135deg,hsl(160,84%,39%),hsl(160,84%,55%))', color: '#fff' } : { color: 'hsl(252,87%,75%)' }}
          >
            {isAutoApproved ? '→ Login Now' : 'Back to Login'}
          </Link>
        </motion.div>
      </div>
    );
  }

  const features = [
    'Access full procurement dashboard',
    'Create and track requisitions',
    'Collaborate with your team',
    'Real-time status updates',
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
        {/* Left panel */}
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
                Create your account and start managing procurement. Your request will be reviewed by an admin.
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
          <div className="flex items-center justify-between mb-6">
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
          <div className="flex flex-col items-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, hsl(252,87%,67%), hsl(265,85%,60%))', boxShadow: '0 8px 32px hsla(252,87%,67%,0.4)' }}
            >
              <UserPlus className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #fff, hsl(252,87%,80%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Create Account
            </h1>
            <p className="text-xs mt-1" style={{ color: 'hsl(215,20%,50%)' }}>All registrations require admin approval</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
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

            {/* Full Name */}
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(215,20%,40%)' }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(215,20%,40%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="form-label">Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10" style={{ color: 'hsl(215,20%,40%)' }} />
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="form-input pl-10 appearance-none cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                >
                  <option value="ROLE_EMPLOYEE">Employee</option>
                  <option value="ROLE_PROCUREMENT_MANAGER">Procurement Manager</option>
                </select>
              </div>
              <p className="text-xs mt-1" style={{ color: 'hsl(215,20%,40%)' }}>Admin will verify your role before approval.</p>
            </div>

            {/* Password */}
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
                : <><span>Submit Registration</span><ArrowRight className="w-4 h-4" /></>
              }
            </motion.button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: 'hsl(215,20%,40%)' }}>
            Registration requires admin approval. You'll be emailed once approved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
