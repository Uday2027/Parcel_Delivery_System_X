import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Package, Globe, ArrowRight, Clock, MousePointerClick, Search, ShieldCheck, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Car className="w-6 h-6 text-zinc-950 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white italic group-hover:text-primary transition-colors">EXPRESSFLOW</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link to="/features" className="hover:text-primary transition-colors">Features</Link>
            <Link to="/track-public" className="hover:text-primary transition-colors">Live Tracking</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-widest text-primary"
          >
            <BrainCircuit className="w-3 h-3" /> Next-Gen Logistics Powered by AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-tight"
          >
            SHIP SMARTER. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-cyan-500">
              TRACK FASTER.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            The world's most sophisticated cloud-native delivery platform. 
            Real-time AI insights, global live tracking, and premium security for your most valuable shipments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link to="/register">
              <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold gap-2 group">
                Send a Parcel <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/track-public">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-zinc-800 hover:bg-zinc-900 text-zinc-300 gap-2">
                <Search className="w-5 h-5" /> Track Publicly
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Image / Mockup Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-5xl mx-auto mt-20 relative px-4"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl aspect-[16/9]">
                <img 
                  src="/hero_car.png" 
                  alt="ExpressFlow Premium Delivery Car" 
                  className="w-full h-full object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                
                {/* Floating UI Elements */}
                <div className="absolute bottom-8 left-8 right-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Live Fleet', val: '2,400+', icon: Car },
                        { label: 'Secured Data', val: 'AES-256', icon: ShieldCheck },
                        { label: 'Global Hubs', val: '180+', icon: Globe },
                    ].map((s, idx) => (
                        <div key={idx} className="bg-zinc-900/80 backdrop-blur-xl p-4 rounded-xl border border-zinc-800/50 flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <s.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{s.label}</p>
                                <p className="text-lg font-black text-white">{s.val}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-zinc-950 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">DESIGNED FOR EXCELLENCE</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">Every detail of ExpressFlow is engineered to provide a premium experience for both individual users and enterprises.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'AI Insights', desc: 'Predictive delivery patterns and route optimization.', icon: BrainCircuit },
              { title: 'Live Tracking', desc: 'Crystal clear visibility with sub-second updates.', icon: Clock },
              { title: 'Smart Booking', desc: 'Book complex shipments in under 60 seconds.', icon: MousePointerClick },
              { title: 'Global Fleet', desc: 'Access to a network of 180+ international hubs.', icon: Globe },
            ].map((f, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 hover:border-primary/30 transition-all cursor-default group">
                <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-zinc-800">
                    <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-20 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-black italic tracking-tighter uppercase">ExpressFlow</span>
                </div>
                <p className="text-zinc-500 max-w-sm font-medium">
                    The next evolution in logistics. Secure, fast, and transparent delivery for the modern era.
                </p>
            </div>
            
            <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-white">Platform</h4>
                <ul className="space-y-2 text-sm text-zinc-500 font-medium">
                    <li className="hover:text-primary cursor-pointer transition-colors">Track Shipments</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Pricing</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">API Docs</li>
                </ul>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-white">Legal</h4>
                <ul className="space-y-2 text-sm text-zinc-500 font-medium">
                    <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Terms of Service</li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 ExpressFlow Logistics Int. All rights reserved. Built for the future.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
