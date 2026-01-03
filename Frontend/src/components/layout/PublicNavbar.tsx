import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCurrentUser, logout } from '@/redux/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Car, LogOut, LayoutDashboard, User, Menu, X, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavLinksProps {
  onLinkClick?: () => void;
  className?: string; // Kept for compatibility if passed, though not strictly used in loop
}

const NavLinks: React.FC<NavLinksProps> = ({ onLinkClick }) => (
    <>
      <Link to="/features" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 hover:to-primary transition-all md:text-sm md:font-medium md:text-zinc-400 md:bg-none md:hover:text-primary" onClick={onLinkClick}>Features</Link>
      <Link to="/track-public" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 hover:to-primary transition-all md:text-sm md:font-medium md:text-zinc-400 md:bg-none md:hover:text-primary" onClick={onLinkClick}>Live Tracking</Link>
      <Link to="/about" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 hover:to-primary transition-all md:text-sm md:font-medium md:text-zinc-400 md:bg-none md:hover:text-primary" onClick={onLinkClick}>About</Link>
    </>
);

const PublicNavbar: React.FC = () => {
  const user = useCurrentUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-40 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group z-50">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Car className="w-6 h-6 text-zinc-950 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white italic group-hover:text-primary transition-colors uppercase">EXPRESSFLOW</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
             <div className="flex gap-8">
               <Link to="/features" className="hover:text-primary transition-colors">Features</Link>
               <Link to="/track-public" className="hover:text-primary transition-colors">Live Tracking</Link>
               <Link to="/about" className="hover:text-primary transition-colors">About</Link>
             </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-zinc-400 hover:text-white z-50 p-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
               <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard">
                    <Button variant="ghost" className="text-zinc-400 hover:text-white flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Button>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer ring-offset-2 ring-primary/20 hover:ring-2">
                        <AvatarImage src={user?.picture} />
                        <AvatarFallback className="bg-zinc-800 text-primary font-black uppercase">
                            {user?.name?.slice(0, 2) || (user as any)?.userId?.slice(0, 2) || 'EX'}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-zinc-300">
                        <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-zinc-800 hover:text-white cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/profile')} className="hover:bg-zinc-800 hover:text-white cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem onClick={handleLogout} className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Full Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-zinc-950 md:hidden flex flex-col"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 h-16 border-b border-zinc-900">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-zinc-950 fill-current" />
                  </div>
                  <span className="text-lg font-black tracking-tighter text-white italic uppercase">EXPRESSFLOW</span>
               </div>
               <button 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-full"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
              <div className="flex flex-col space-y-6">
                <NavLinks onLinkClick={() => setIsMobileMenuOpen(false)} />
              </div>

              <div className="mt-auto pt-8 border-t border-zinc-900 space-y-4">
                 {user ? (
                   <>
                      <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-xl">
                          <Avatar className="h-10 w-10 border border-zinc-700">
                            <AvatarImage src={user?.picture} />
                            <AvatarFallback className="bg-zinc-800 text-primary font-bold">{user?.name?.slice(0, 2) || (user as any)?.userId?.slice(0, 2) || 'EX'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-bold">{user.name || 'User'}</p>
                            <p className="text-xs text-zinc-500">{user.email || 'No email'}</p>
                          </div>
                      </div>
                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full justify-between h-14 text-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold">
                           <span className="flex items-center gap-2"><LayoutDashboard className="w-5 h-5" /> Dashboard</span>
                           <ChevronRight className="w-5 h-5 text-zinc-600" />
                        </Button>
                      </Link>
                       <Button 
                          variant="destructive" 
                          className="w-full justify-center h-14 text-lg font-bold"
                          onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      >
                         Log Out
                      </Button>
                   </>
                 ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-14 text-lg font-bold border-zinc-800 bg-transparent text-white hover:bg-zinc-900">Login to Account</Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full h-14 text-lg font-black bg-primary text-primary-foreground hover:bg-primary/90">GET STARTED NOW</Button>
                      </Link>
                    </>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublicNavbar;
