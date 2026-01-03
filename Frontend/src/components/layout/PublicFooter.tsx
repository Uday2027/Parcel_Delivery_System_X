import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Github, Linkedin, Globe } from 'lucide-react';

const PublicFooter: React.FC = () => {
  return (
    <footer id="footer" className="py-20 border-t border-zinc-900 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter uppercase text-white">ExpressFlow</span>
          </div>
          <p className="text-zinc-500 max-w-sm font-medium leading-relaxed">
            The next evolution in logistics. Secure, fast, and transparent delivery for the modern era. Designed for world-class enterprises and individual users alike.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 hover:text-primary hover:bg-zinc-800 transition-all">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 hover:text-primary hover:bg-zinc-800 transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://zubayer-hossain-uday.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 hover:text-primary hover:bg-zinc-800 transition-all">
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-black uppercase tracking-widest text-white">Platform</h4>
          <ul className="space-y-2 text-sm text-zinc-500 font-medium">
            <li><Link to="/track-public" className="hover:text-primary transition-colors">Track Shipments</Link></li>
            <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
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
      
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-zinc-900 text-center space-y-4">
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          © 2026 EXPRESSFLOW LOGISTICS INT. ALL RIGHTS RESERVED.
        </p>
        <div className="flex flex-col items-center gap-1">
          <p className="text-zinc-400 text-sm font-black tracking-tight">
            Built with Passion by <span className="text-primary italic">Zubayer Hossain Uday</span>
          </p>
          <a 
            href="https://zubayer-hossain-uday.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-bold text-zinc-500 hover:text-white transition-colors underline decoration-primary/30 underline-offset-4"
          >
            Visit Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
