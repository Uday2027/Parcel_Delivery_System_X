import React, { useMemo } from 'react';
import { useCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetMyParcelsQuery } from '@/redux/features/parcel/parcelApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, Clock, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIDeliveryInsight from '@/components/dashboard/AIDeliveryInsight';
import type { IParcel } from '@/types';
import { socket } from '@/lib/socket';

const Dashboard: React.FC = () => {
  const user = useCurrentUser();
  const { data: parcelsData, isLoading, refetch } = useGetMyParcelsQuery(undefined);
  const [isSocketConnected, setIsSocketConnected] = React.useState(false);

  React.useEffect(() => {
    socket.connect();
    
    socket.on('connect', () => setIsSocketConnected(true));
    socket.on('disconnect', () => setIsSocketConnected(false));
    
    // Listen for any parcel update relevant to the user
    socket.on('parcel-updated', () => {
        refetch(); // Refresh data when any parcel changes
    });

    return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('parcel-updated');
        socket.disconnect();
    };
  }, [refetch]);

  const stats = useMemo(() => {
    const parcels: IParcel[] = parcelsData?.data || [];
    
    const active = parcels.filter(p => !['Delivered', 'Cancelled'].includes(p.statusLogs[p.statusLogs.length - 1].status)).length;
    const pending = parcels.filter(p => ['Requested', 'Approved'].includes(p.statusLogs[p.statusLogs.length - 1].status)).length;
    const delivered = parcels.filter(p => p.statusLogs[p.statusLogs.length - 1].status === 'Delivered').length;
    const totalSpent = parcels.reduce((acc, p) => acc + p.fee, 0);

    return [
      { title: 'Active Parcels', value: active.toString(), icon: Truck, color: 'text-blue-500' },
      { title: 'Pending Pickup', value: pending.toString(), icon: Clock, color: 'text-amber-500' },
      { title: 'Delivered', value: delivered.toString(), icon: CheckCircle, color: 'text-emerald-500' },
      { title: 'Total Spent', value: `৳ ${totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'text-primary' },
    ];
  }, [parcelsData]);

  const recentParcels = useMemo(() => {
    return (parcelsData?.data || []).slice(-5).reverse();
  }, [parcelsData]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-zinc-500 animate-pulse">Initializing your logistics hub...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white capitalize flex items-center gap-3">
            Welcome back, {user?.name.split(' ')[0]}
            {isSocketConnected && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-500 font-bold uppercase tracking-wider animate-in fade-in duration-1000">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
                </span>
            )}
          </h1>
          <p className="text-zinc-500 mt-1">Here is what's happening with your deliveries today.</p>
        </div>
        <Link to="/book-parcel">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8">
                Book New Parcel
            </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all group overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-zinc-100 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" /> Recent Shipments
                </CardTitle>
                <Link to="/my-parcels">
                    <Button variant="ghost" className="text-primary hover:text-primary/80 text-xs px-0 h-auto">View All</Button>
                </Link>
            </CardHeader>
            <CardContent>
               {recentParcels.length > 0 ? (
                 <div className="space-y-4">
                    {recentParcels.map((parcel: IParcel) => (
                        <div key={parcel._id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-primary border border-zinc-800">
                                    <Truck className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-200">{parcel.trackingId}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">{parcel.type}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-zinc-300">৳ {parcel.fee}</p>
                                <p className="text-[10px] text-primary">{parcel.statusLogs[parcel.statusLogs.length-1].status}</p>
                            </div>
                        </div>
                    ))}
                 </div>
               ) : (
                <div className="text-zinc-500 text-sm text-center py-12 border-2 border-dashed border-zinc-800 rounded-lg">
                    No recent activity found.
                </div>
               )}
            </CardContent>
         </Card>

         <div className="space-y-8">
            <AIDeliveryInsight parcels={parcelsData?.data || []} userId={user?.userId || ''} />

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-zinc-100">Live Support</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-zinc-400 text-sm">Need help with a delivery? Our team is available 24/7.</p>
                        <Button variant="outline" className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-800">
                            Chat with Support
                        </Button>
                    </div>
                </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
