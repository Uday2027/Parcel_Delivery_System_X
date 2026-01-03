import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import { setUser } from '@/redux/features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      const user: any = jwtDecode(res.data.accessToken);
      
      dispatch(setUser({ user: { ...res.data.user, ...user }, token: res.data.accessToken }));
      toast.success('Welcome back to ExpressFlow!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 selection:bg-primary/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      
      <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <Truck className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">ExpressFlow</CardTitle>
          <CardDescription className="text-zinc-500">
            Secure access to your delivery dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-600 transition-colors group-focus-within:text-primary" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  className="pl-11 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-700 focus:ring-primary focus:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-400">Password</Label>
                <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-600 transition-colors group-focus-within:text-primary" />
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="pl-11 bg-zinc-950/50 border-zinc-800 text-white focus:ring-primary focus:border-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
            <p className="text-sm text-center text-zinc-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">Explore & Join</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      
      {/* Footer Branding */}
      <div className="absolute bottom-8 text-zinc-600 text-xs tracking-widest uppercase">
        Premium Delivery & Logistics System
      </div>
    </div>
  );
};

export default Login;
