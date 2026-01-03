import React, { useState } from 'react';
import { useLazyGetParcelByTrackingIdQuery } from '@/redux/features/parcel/parcelApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, MapPin, Package, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const TrackParcel: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [track, { data: response, isLoading, error }] = useLazyGetParcelByTrackingIdQuery();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      track(trackingId);
    }
  };

  const parcel = response ? (response as unknown as { 
    trackingId: string, 
    currentStatus: string, 
    history: any[], 
    deliveryBoy?: any 
  }) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Requested': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
      case 'Approved': return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      case 'Dispatched': return 'bg-purple-500/20 text-purple-500 border-purple-500/20';
      case 'Delivered': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20';
      case 'Cancelled': return 'bg-red-500/20 text-red-500 border-red-500/20';
      default: return 'bg-zinc-500/20 text-zinc-500 border-zinc-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-3 italic">
          <Package className="w-10 h-10 text-primary" /> Track Shipment
        </h1>
        <p className="text-zinc-500">Monitor your parcel's journey through our network in real-time.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-50" />
        <CardContent className="p-8">
          <form onSubmit={handleTrack} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                placeholder="Enter your 12-digit tracking ID (e.g., TRK-2023...)"
                className="pl-12 h-14 bg-zinc-950 border-zinc-800 text-lg focus:ring-primary/50"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-all active:scale-95" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Trace Now'}
            </Button>
          </form>

          {error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center font-medium animate-in shake duration-500">
              Invalid Tracking ID. Please double-check and try again.
            </div>
          )}
        </CardContent>
      </Card>

      {parcel && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          <Card className="md:col-span-2 bg-zinc-900 border-zinc-800 shadow-xl self-start">
            <CardHeader className="border-b border-zinc-800 bg-zinc-950/20">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-zinc-100 flex items-center gap-2">
                   Live Status Journal
                </CardTitle>
                <Badge className={cn("px-4 py-1 rounded-full text-xs font-bold uppercase", getStatusColor(parcel.currentStatus))}>
                    {parcel.currentStatus}
                </Badge>
              </div>
              {(parcel as any).deliveryBoy?.liveLocation && (
                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3 animate-pulse">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">
                    Live Tracking: {(parcel as any).deliveryBoy.liveLocation.currentArea || 'In Transit'}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-zinc-800/50">
                {parcel.history?.slice().reverse().map((log: any, index: number) => (
                  <div key={index} className="relative flex items-start gap-8 group">
                    <div className={cn(
                        "absolute left-5 -translate-x-1/2 mt-1.5 w-4 h-4 rounded-full border-4 border-zinc-900 z-10 transition-colors",
                        index === 0 ? "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" : "bg-zinc-800"
                    )} />
                    <div className="ml-10 space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                            <p className={cn("font-bold text-lg", index === 0 ? "text-white" : "text-zinc-400")}>{log.status}</p>
                            <span className="text-xs font-mono text-zinc-500">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        {log.note && <p className="text-sm text-zinc-500 leading-relaxed italic">"{log.note}"</p>}
                        {log.location && (
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <MapPin className="w-3 h-3" /> {log.location}
                            </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-xl h-fit">
            <CardHeader>
                <CardTitle className="text-lg text-zinc-100">Shipment Details</CardTitle>
                <CardDescription>Comprehensive overview of your parcel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-primary">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Tracking ID</p>
                            <p className="text-sm font-mono text-zinc-200">{parcel.trackingId}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                           <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                             <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Booking Date</p>
                             <p className="text-sm text-zinc-200">
                                {parcel.history && parcel.history[0] ? new Date(parcel.history[0].timestamp).toLocaleDateString() : 'N/A'}
                             </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-500">Service Type</span>
                            <span className="text-zinc-200 font-medium">Standard Logistics</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-zinc-500">Payment Status</span>
                            <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">Authorized</span>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
