import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          toast.error('Enter your full name');
          setLoading(false);
          return;
        }
        await signup(email, password, name.trim());
        toast.success('Welcome to the Arena, ' + name + '!');
      } else {
        await login(email, password);
        toast.success('Access granted. Welcome back.');
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.code === 'auth/user-not-found'
        ? 'No agent found with this email'
        : err.code === 'auth/wrong-password'
        ? 'Invalid access code'
        : err.code === 'auth/email-already-in-use'
        ? 'Email already registered'
        : err.code === 'auth/weak-password'
        ? 'Password must be at least 6 characters'
        : err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ion/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-plasma/5 rounded-full blur-3xl" />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-ion rounded-full opacity-40"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="inline-block w-16 h-16 rounded-full border-2 border-ion/20 border-t-ion mb-4"
          />
          <h1 className="font-display text-3xl text-gradient-ion mb-2">IEEE EPI</h1>
          <p className="font-mono-tech text-ghost text-sm tracking-widest">CHALLENGE ARENA v1.0</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          {/* Mode toggle */}
          <div className="flex gap-2 mb-8 bg-ash/50 rounded-lg p-1">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-md font-display text-xs tracking-widest transition-all duration-200 ${
                  mode === m
                    ? 'bg-ion/20 text-ion border border-ion/30 shadow-ion'
                    : 'text-ghost hover:text-white'
                }`}
              >
                {m === 'login' ? 'ACCESS' : 'REGISTER'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block font-display text-xs text-ghost tracking-widest mb-2">
                    AGENT NAME
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required={mode === 'signup'}
                    className="input-field w-full px-4 py-3 rounded-lg text-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block font-display text-xs text-ghost tracking-widest mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="input-field w-full px-4 py-3 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block font-display text-xs text-ghost tracking-widest mb-2">
                ACCESS CODE
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field w-full px-4 py-3 rounded-lg text-sm"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-star-solid w-full py-4 rounded-xl text-sm relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                  />
                  PROCESSING...
                </span>
              ) : (
                mode === 'login' ? '⚡ ENTER THE ARENA' : '🚀 INITIALIZE AGENT'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-ghost text-xs mt-6 font-mono-tech">
            {mode === 'login' ? "New agent? " : "Already registered? "}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-ion hover:text-white transition-colors"
            >
              {mode === 'login' ? 'Register here' : 'Access here'}
            </button>
          </p>
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-ghost/50 text-xs font-mono-tech mt-6 px-4"
        >
          IEEE EPI Student Branch · Challenge Platform
        </motion.p>
      </motion.div>
    </div>
  );
}
