import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@/redux/features/auth/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Phone, MapPin, Loader2, UserPlus, UserCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Role } from '@/types';
import { cn } from '@/lib/utils';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: Role.USER as string,
  });
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleSelect = (role: Role) => {
    setFormData({ ...formData, role });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      toast.success('Registration successful! Welcome to the family.');
      navigate('/login');
    } catch (err: any) {
      const errorSources = err?.data?.errorSources;
      if (Array.isArray(errorSources) && errorSources.length > 0) {
        toast.error(errorSources[0].message);
      } else {
        toast.error(err?.data?.message || 'Registration failed. Try a different email.');
      }
    }
  };

  const roles = [
    { value: Role.USER, label: 'Customer', description: 'Send and track your parcels' },
    { value: Role.DELIVERY_BOY, label: 'Delivery Boy', description: 'Join our fleet team' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 selection:bg-primary/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_50%)]" />
      
      <Card className="w-full max-w-2xl bg-zinc-900/50 border-zinc-800 backdrop-blur-xl relative z-10 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
             <UserPlus className="text-primary w-8 h-8" /> Join ExpressFlow
          </CardTitle>
          <CardDescription className="text-zinc-500">
            Create your account and start managing deliveries today
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-400">Full Name</Label>
                <div className="relative group">
                  <UserCircle className="absolute left-3 top-3 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                  <Input id="name" placeholder="John Doe" required className="pl-11 bg-zinc-950/50 border-zinc-800" value={formData.name} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                  <Input id="email" type="email" placeholder="john@example.com" required className="pl-11 bg-zinc-950/50 border-zinc-800" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-400">Phone Number</Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                  <Input id="phone" placeholder="017xxxxxxxx" required className="pl-11 bg-zinc-950/50 border-zinc-800" value={formData.phone} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-400">Secure Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                  <Input id="password" type="password" required className="pl-11 bg-zinc-950/50 border-zinc-800" value={formData.password} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-zinc-400">Default Address</Label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                  <Input id="address" placeholder="123 Street, City" required className="pl-11 bg-zinc-950/50 border-zinc-800" value={formData.address} onChange={handleChange} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-zinc-400">Choose Your Role</Label>
                <div className="grid grid-cols-1 gap-2">
                  {roles.map((role) => (
                    <div 
                      key={role.value}
                      onClick={() => handleRoleSelect(role.value)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                        formData.role === role.value 
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                          : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
                      )}
                    >
                      <div>
                        <p className={cn("text-sm font-semibold", formData.role === role.value ? "text-primary" : "text-zinc-300")}>{role.label}</p>
                        <p className="text-[10px] text-zinc-500">{role.description}</p>
                      </div>
                      {formData.role === role.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-zinc-800/50">
            <Button className="w-full h-11 bg-primary hover:bg-primary/90 font-semibold text-lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
            </Button>
            <p className="text-sm text-center text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign in here</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
