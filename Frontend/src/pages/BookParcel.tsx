import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateParcelMutation } from '@/redux/features/parcel/parcelApi';
import { useLazySearchUsersQuery } from '@/redux/features/user/userApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Search, MapPin, Package, Weight, Calendar, ArrowRight, Loader2, User as UserIcon, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import type { IUser } from '@/types';

const BookParcel: React.FC = () => {
  const [formData, setFormData] = useState({
    receiver: '',
    phone: '',
    weight: 1,
    type: 'Box',
    pickupAddress: '',
    deliveryAddress: '',
    estimatedDeliveryDate: '',
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState<IUser | null>(null);
  const [searchTrigger, { data: searchResults, isFetching: isSearching }] = useLazySearchUsersQuery();
  const [createParcel, { isLoading: isBooking }] = useCreateParcelMutation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchTrigger(searchTerm);
    }
  };

  const selectReceiver = (user: IUser) => {
    setSelectedReceiver(user);
    setFormData({ ...formData, receiver: user._id });
    setSearchTerm(''); // Clear search after selection
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.receiver) {
      return toast.error("Please select a receiver using the search tool.");
    }
    try {
      await createParcel(formData).unwrap();
      toast.success('Parcel booked successfully!');
      navigate('/my-parcels');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Booking failed. Try again.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white italic">Book a New Delivery</h1>
        <p className="text-zinc-500 mt-1">Fill in the details below to start your shipping process.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" /> Find Receiver
              </CardTitle>
              <CardDescription>Search by name or email to get their ID</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input 
                  placeholder="Enter name or email..." 
                  className="bg-zinc-950 border-zinc-800"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={isSearching}>
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </form>

              <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-1">
                {(searchResults as any)?.data?.length === 0 && <p className="text-xs text-zinc-600 text-center py-4">No users found.</p>}
                {(searchResults as any)?.data?.map((user: IUser) => (
                  <div 
                    key={user._id} 
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between group",
                      selectedReceiver?._id === user._id 
                        ? "bg-primary/10 border-primary/50" 
                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                    )}
                    onClick={() => selectReceiver(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-800 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                        <UserIcon className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">{user.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    {selectedReceiver?._id === user._id ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <div className="text-[10px] text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">Select</div>
                    )}
                  </div>
                ))}
              </div>

              {selectedReceiver && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1">Selected Receiver ID</p>
                  <p className="text-xs font-mono text-emerald-100 break-all">{selectedReceiver._id}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
             <div className="h-1 bg-gradient-to-r from-primary/50 to-emerald-500/50" />
            <CardHeader>
              <CardTitle className="text-lg">Delivery Details</CardTitle>
            </CardHeader>
            <form onSubmit={handleCreate}>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Receiver ID</Label>
                  <Input 
                    value={formData.receiver} 
                    readOnly 
                    placeholder="Search tools will fill this..."
                    className="bg-zinc-950/50 border-zinc-800 border-dashed text-primary font-mono text-xs" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-zinc-400">Receiver Phone</Label>
                  <Input 
                    id="phone" 
                    placeholder="017xxxxxxxx" 
                    className="bg-zinc-950 border-zinc-800" 
                    required 
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 flex items-center gap-2">
                    <Weight className="w-4 h-4 text-primary" /> Weight (kg)
                  </Label>
                  <Input 
                    type="number" 
                    className="bg-zinc-950 border-zinc-800" 
                    required 
                    min="1"
                    value={formData.weight}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, weight: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" /> Item Type
                  </Label>
                  <Input 
                    placeholder="e.g., Box, Envelope, Documents" 
                    className="bg-zinc-950 border-zinc-800" 
                    required 
                    value={formData.type}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, type: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" /> Pickup Address
                  </Label>
                  <Input 
                    placeholder="Your pickup location" 
                    className="bg-zinc-950 border-zinc-800" 
                    required 
                    value={formData.pickupAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, pickupAddress: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" /> Delivery Address
                  </Label>
                  <Input 
                    placeholder="Destination location" 
                    className="bg-zinc-950 border-zinc-800" 
                    required 
                    value={formData.deliveryAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, deliveryAddress: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-zinc-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Estimated Delivery Date
                  </Label>
                  <Input 
                    type="date" 
                    className="bg-zinc-950 border-zinc-800" 
                    required 
                    value={formData.estimatedDeliveryDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, estimatedDeliveryDate: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-zinc-900/50 py-4 gap-4 justify-between border-t border-zinc-800/50">
                <div className="flex flex-col">
                   <p className="text-xs text-zinc-500">Estimated Shipping Fee</p>
                   <p className="text-xl font-bold font-mono text-primary">৳ {formData.weight * 50}</p>
                </div>
                <Button className="h-11 px-8 bg-primary hover:bg-primary/90 font-bold" disabled={isBooking || !formData.receiver}>
                   {isBooking ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Confirm Booking <ArrowRight className="w-5 h-5" /></span>}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookParcel;
