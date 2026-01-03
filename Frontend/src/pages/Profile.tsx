import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '@/redux/features/auth/authSlice';
import { useUpdateUserMutation } from '@/redux/features/user/userApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Loader2, Save, Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile: React.FC = () => {
    const user = useCurrentUser();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    
    const initialFormData = React.useMemo(() => ({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        picture: user?.picture || ''
    }), [user]);

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!user?._id) return;
            await updateUser({ id: user._id, data: formData }).unwrap();
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update profile.");
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
                <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-primary/20 group-hover:border-primary transition-all duration-500 shadow-2xl">
                        <AvatarImage src={formData.picture} />
                        <AvatarFallback className="bg-zinc-800 text-primary text-4xl font-black uppercase">
                            {formData.name.slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-1 right-1 p-2 bg-primary text-zinc-950 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center md:text-left space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-white italic">{formData.name}</h1>
                    <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-xs">{user.role?.replace('_', ' ')}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <Mail className="w-4 h-4 text-primary" /> {formData.email}
                        </div>
                        {formData.phone && (
                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                <Phone className="w-4 h-4 text-primary" /> {formData.phone}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary to-cyan-500" />
                <CardHeader>
                    <CardTitle className="text-xl text-white">Personal Information</CardTitle>
                    <CardDescription>Update your profile details and contact preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-zinc-400 uppercase text-[10px] font-bold tracking-widest">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10 bg-zinc-950 border-zinc-800 focus:ring-primary/50"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-400 uppercase text-[10px] font-bold tracking-widest">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <Input
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="pl-10 bg-zinc-950/50 border-zinc-800/50 text-zinc-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-zinc-400 uppercase text-[10px] font-bold tracking-widest">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="pl-10 bg-zinc-950 border-zinc-800 focus:ring-primary/50"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="picture" className="text-zinc-400 uppercase text-[10px] font-bold tracking-widest">Profile Photo URL</Label>
                                <div className="relative">
                                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <Input
                                        id="picture"
                                        name="picture"
                                        value={formData.picture}
                                        onChange={handleChange}
                                        className="pl-10 bg-zinc-950 border-zinc-800 focus:ring-primary/50"
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-zinc-400 uppercase text-[10px] font-bold tracking-widest">Primary Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="pl-10 bg-zinc-950 border-zinc-800 focus:ring-primary/50"
                                    placeholder="Enter your full address"
                                />
                            </div>
                        </div>
                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90 text-zinc-950 font-black tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
