import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Target, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About: React.FC = () => {
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-widest text-primary">
                Our Story
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                DEFINING THE FUTURE OF <span className="text-primary italic">GLOBAL COMMERCE.</span>
              </h1>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                Founded in 2024, ExpressFlow was born from a simple realization: the logistics industry was moving too slowly for the digital age. We set out to build a cloud-native, AI-driven platform that makes global shipping as easy as sending an email.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black h-12 px-8">JOIN OUR NETWORK</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50 flex items-center justify-center p-12"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <Globe className="w-64 h-64 text-primary/20 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-center">
                <span className="text-6xl font-black text-white">180+</span>
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Countries Served</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
            {[
              {
                icon: Target,
                title: "Our Mission",
                desc: "To accelerate global commerce by providing the most transparent, efficient, and secure logistics platform on earth."
              },
              {
                icon: Users,
                title: "Our Team",
                desc: "A diverse group of engineers, logistics experts, and designers dedicated to solving the world's hardest distribution problems."
              },
              {
                icon: ShieldCheck,
                title: "Our Promise",
                desc: "Sub-second tracking, guaranteed security, and a relentless focus on customer success, every single day."
              }
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i }}
                className="p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center ring-1 ring-primary/20">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-black">{v.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-32 p-12 lg:p-20 rounded-[3rem] bg-zinc-900 border border-zinc-800">
            <div className="max-w-3xl mx-auto text-center space-y-12">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter">GET IN TOUCH</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-5 h-5 text-zinc-400" />
                  </div>
                  <p className="font-bold text-white italic">contact@expressflow.logistics</p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                    <Phone className="w-5 h-5 text-zinc-400" />
                  </div>
                  <p className="font-bold text-white italic">+1 800-EXFLOW-HQ</p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="w-5 h-5 text-zinc-400" />
                  </div>
                  <p className="font-bold text-white italic">Silicon Valley, CA, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-zinc-900 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest bg-zinc-950">
        © 2026 ExpressFlow Logistics Int. All rights reserved.
      </footer>
    </div>
  );
};

export default About;
