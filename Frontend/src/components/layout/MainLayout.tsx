import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, useCurrentUser } from '@/redux/features/auth/authSlice';
import { 
  LayoutDashboard, 
  Package, 
  Car, 
  Users, 
  LogOut, 
  Search, 
  Menu,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Role } from '@/types';
import type { IUser } from '@/types';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useCurrentUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Shipments', icon: Package, path: '/dashboard/my-parcels' },
    { name: 'Track Parcel', icon: Search, path: '/dashboard/track' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
  ];
  
  const adminItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Live Tracking', icon: Car, path: '/dashboard/admin-parcels' },
    { name: 'Manage Crew', icon: Users, path: '/dashboard/delivery-crew' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
  ];
  
  const deliveryBoyItems = [
    { name: 'My Fleet', icon: Car, path: '/dashboard/delivery-assignments' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
  ];

  let filteredItems: { name: string; icon: React.ElementType; path: string; }[] = [];

  if (user) {
    switch (user.role) {
      case Role.USER:
        filteredItems = userItems;
        break;
      case Role.ADMIN:
      case Role.SUPER_ADMIN:
        filteredItems = adminItems;
        break;
      case Role.DELIVERY_BOY:
        filteredItems = deliveryBoyItems;
        break;
      default:
        filteredItems = [];
    }
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transition-transform lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Car className="w-6 h-6 text-zinc-950 fill-current" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter text-white italic block leading-none">EXPRESS</span>
              <span className="text-xl font-black tracking-tighter text-primary italic block leading-none">FLOW</span>
            </div>
          </Link>
          </div>

          <div className="px-4 mb-4">
             <Link to="/">
                <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-500 hover:text-primary hover:bg-primary/5 border border-zinc-800/50">
                   <LayoutDashboard className="w-4 h-4 rotate-[-90deg]" /> Back to Home
                </Button>
             </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
            {filteredItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative",
                  location.pathname === item.path 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                )}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  location.pathname === item.path ? "text-primary" : "group-hover:text-zinc-100"
                )} />
                {item.name}
                {location.pathname === item.path && (
                  <span className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg">
                <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer ring-offset-2 ring-primary/20 hover:ring-2">
                  <AvatarImage src={(user as IUser)?.picture} />
                  <AvatarFallback className="bg-zinc-800 text-primary font-black uppercase">
                    {user?.name?.slice(0, 2) || (user as IUser)?.name?.slice(0, 2) || (user as any)?.userId?.slice(0, 2) || 'EX'}
                  </AvatarFallback>
                </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100 truncate">{user?.name}</p>
                <p className="text-xs text-zinc-500 truncate">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-2 justify-start gap-3 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-zinc-900/50 border-b border-zinc-800 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
          <span className="text-lg font-bold">ExpressFlow</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-zinc-950">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
