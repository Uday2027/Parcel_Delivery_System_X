import React, { useState } from 'react';
import { useLazyGetParcelByTrackingIdQuery } from '@/redux/features/parcel/parcelApi';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Truck, MapPin, Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const PublicTracking: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [parcel, setParcel] = useState<any>(null);
  const [triggerSearch] = useLazyGetParcelByTrackingIdQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setIsLoading(true);
    setError('');
    setParcel(null);

    try {
      const response = await triggerSearch(trackingId).unwrap();
      setParcel(response.data);
    } catch (err: any) {
      setError(err?.data?.message || 'Tracking ID not found. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'approved': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'dispatched': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto w-full space-y-12 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
             <Clock className="w-3 h-3" /> Real-time Tracking
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">Locate Your Shipment</h1>
          <p className="text-zinc-500 max-w-xl mx-auto">Enter your tracking number below to see the current status and travel history of your parcel.</p>
        </div>

        {/* Search Bar */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
               <div className="relative flex-1 group">
                 <Search className="absolute left-4 top-4 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                 <Input 
                   placeholder="Enter Tracking ID (e.g., TRK-2023...)" 
                   className="pl-12 h-14 bg-zinc-950 border-zinc-800 text-lg font-mono focus:ring-primary"
                   value={trackingId}
                   onChange={(e) => setTrackingId(e.target.value)}
                 />
               </div>
               <button type="submit" className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-lg font-bold min-w-[180px] disabled:opacity-50" disabled={isLoading}>
                 {isLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Track Parcel"}
               </button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 animate-in zoom-in duration-300">
             <AlertCircle className="w-5 h-5" />
             <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Result Section */}
        {parcel && (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase tracking-wider">Current Status</CardDescription>
                    <CardTitle className="pt-2">
                       <Badge variant="outline" className={cn("text-sm py-1 px-4", getStatusColor(parcel.statusLogs[parcel.statusLogs.length - 1].status))}>
                         {parcel.statusLogs[parcel.statusLogs.length-1].status}
                       </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {parcel.deliveryBoy?.liveLocation && (
                      <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2 animate-pulse">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                          Live: {parcel.deliveryBoy.liveLocation.currentArea || 'In Transit'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase tracking-wider">Shipment Type</CardDescription>
                    <CardTitle className="pt-2 text-zinc-200 flex items-center gap-2">
                       <Truck className="w-5 h-5 text-primary" /> {parcel.type} ({parcel.weight}kg)
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs uppercase tracking-wider">Estimated Delivery</CardDescription>
                    <CardTitle className="pt-2 text-zinc-200 flex items-center gap-2">
                       <Calendar className="w-5 h-5 text-primary" /> {parcel.estimatedDeliveryDate ? new Date(parcel.estimatedDeliveryDate).toLocaleDateString() : 'Processing'}
                    </CardTitle>
                  </CardHeader>
                </Card>
             </div>

             <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardHeader className="border-b border-zinc-800 bg-zinc-950/50">
                   <CardTitle className="text-lg">Delivery Timeline</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                   <div className="relative space-y-8">
                      {/* Timeline Line */}
                      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-zinc-800" />
                      
                      {parcel.statusLogs.slice().reverse().map((log: any, idx: number) => (
                        <div key={idx} className="relative flex gap-6">
                           <div className={cn(
                             "z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-zinc-900",
                             idx === 0 ? "bg-primary text-white" : "bg-zinc-800 text-zinc-500"
                           )}>
                              {idx === 0 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-zinc-600" />}
                           </div>
                           <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                 <h4 className={cn("font-bold text-lg", idx === 0 ? "text-white" : "text-zinc-400")}>{log.status}</h4>
                                 <span className="text-xs text-zinc-600 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                              </div>
                              <p className="text-zinc-500 text-sm italic">{log.note || 'No additional notes provided'}</p>
                              {log.location && (
                                <p className="text-xs text-primary flex items-center gap-1 mt-1">
                                   <MapPin className="w-3 h-3" /> {log.location}
                                </p>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </CardContent>
             </Card>
          </div>
        )}
      </div>

      <div className="mt-auto py-8 text-center text-zinc-700 text-xs">
         © 2024 ExpressFlow Logistics. All rights reserved.
      </div>
    </div>
  );
};

export default PublicTracking;
