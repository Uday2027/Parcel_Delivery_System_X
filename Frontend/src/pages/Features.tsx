import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Clock, MousePointerClick, Globe, ShieldCheck, Zap, BarChart3, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'AI-Powered Logistics',
    description: 'Our proprietary algorithms optimize routes in real-time, reducing delivery times by up to 30%.',
    icon: BrainCircuit,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'Precision Live Tracking',
    description: 'Track your shipments with sub-second latency. Know exactly where your parcel is, every step of the way.',
    icon: Clock,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'One-Click Booking',
    description: 'Book complex international shipments in under 60 seconds with our streamlined interface.',
    icon: MousePointerClick,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    title: 'Global Distribution',
    description: 'Access a network of 180+ international hubs and thousands of local delivery partners.',
    icon: Globe,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'Enterprise Security',
    description: 'Every transaction and data point is secured with AES-256 encryption and multi-factor authentication.',
    icon: ShieldCheck,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10'
  },
  {
    title: 'Instant Scaling',
    description: 'From 1 to 10,000 shipments, our cloud-native infrastructure scales automatically with your business.',
    icon: Zap,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10'
  },
  {
    title: 'Advanced Analytics',
    description: 'Gain deep insights into your shipping patterns with comprehensive data visualization.',
    icon: BarChart3,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  },
  {
    title: '24/7 Expert Support',
    description: 'Our dedicated logistics experts are available around the clock to ensure your success.',
    icon: Headphones,
    color: 'text-zinc-400',
    bg: 'bg-zinc-800/50'
  }
];

const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-white italic group-hover:text-primary transition-colors uppercase">EXPRESSFLOW</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-widest text-primary"
            >
              Cutting Edge Features
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter"
            >
              ENGINEERED FOR THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500 italic">NEXT EVOLUTION</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 max-w-2xl mx-auto font-medium text-lg"
            >
              ExpressFlow isn't just a delivery service. It's a comprehensive logistics ecosystem designed to give you an unfair advantage in the global market.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 hover:border-primary/30 transition-all group"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">{f.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-24 p-12 rounded-3xl bg-primary flex flex-col items-center text-center space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground tracking-tighter">READY TO UPGRADE YOUR LOGISTICS?</h2>
            <p className="text-primary-foreground/80 max-w-xl font-bold uppercase tracking-wider text-sm">Join the thousands of businesses worldwide that trust ExpressFlow for their critical shipments.</p>
            <Link to="/register">
              <Button size="lg" className="h-16 px-12 text-xl bg-zinc-950 text-white hover:bg-zinc-900 font-black border-none shadow-2xl">
                START SHIPPING NOW
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-zinc-900 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest bg-zinc-950">
        © 2026 ExpressFlow Logistics Int. All rights reserved.
      </footer>
    </div>
  );
};

export default Features;
