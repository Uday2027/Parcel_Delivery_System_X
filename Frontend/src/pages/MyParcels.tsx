import React from 'react';
import { useGetMyParcelsQuery, useCancelParcelMutation } from '@/redux/features/parcel/parcelApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import type { IParcel, IUser } from '@/types';

const MyParcels: React.FC = () => {
  const { data: parcels, isLoading, isFetching, refetch } = useGetMyParcelsQuery(undefined);
  const [cancelParcel, { isLoading: isCancelling }] = useCancelParcelMutation();

  const handleCancel = async (id: string) => {
    try {
      await cancelParcel(id).unwrap();
      toast.success('Parcel cancelled successfully.');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to cancel parcel.');
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-zinc-500 animate-pulse">Retrieving your shipments...</p>
      </div>
    );
  }

  const parcelsList = (parcels as any)?.data as IParcel[] || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" /> My Shipments
          </h1>
          <p className="text-zinc-500 mt-1">Manage and track your outgoing and incoming parcels.</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
        <CardHeader className="bg-zinc-950/50 border-b border-zinc-800">
          <CardTitle className="text-lg text-zinc-300">Active & Past Deliveries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/30">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-300 font-bold uppercase text-[10px] tracking-widest pl-6">Tracking ID</TableHead>
                <TableHead className="text-zinc-300 font-bold uppercase text-[10px] tracking-widest">Receiver & Type</TableHead>
                <TableHead className="text-zinc-300 font-bold uppercase text-[10px] tracking-widest">Fee (৳)</TableHead>
                <TableHead className="text-zinc-300 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="text-right text-zinc-300 font-bold uppercase text-[10px] tracking-widest pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parcelsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-zinc-600">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-12 h-12 opacity-10" />
                      <p>No parcels found in your history.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                parcelsList.map((parcel) => (
                  <TableRow key={parcel._id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <TableCell className="font-mono text-primary text-xs font-bold pl-6">{parcel.trackingId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-200">{(parcel.receiver as IUser).name || 'Unknown'}</span>
                        <span className="text-[10px] text-zinc-500">{parcel.type} • {parcel.weight}kg</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-300 font-medium">৳ {parcel.fee}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-semibold text-[10px] uppercase px-2 py-0.5", getStatusColor(parcel.statusLogs[parcel.statusLogs.length - 1].status))}>
                        {parcel.statusLogs[parcel.statusLogs.length - 1].status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2 pr-6">
                      <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white hover:bg-zinc-800">
                         <Search className="w-4 h-4 mr-1" /> Track
                      </Button>
                      {parcel.statusLogs[parcel.statusLogs.length - 1].status === 'Pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10"
                          onClick={() => handleCancel(parcel._id)}
                          disabled={isCancelling}
                        >
                           <XCircle className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Decorative Branding */}
      <div className="flex justify-center opacity-20 py-12">
         <TruckIcon className="w-24 h-24 text-zinc-500" />
      </div>
    </div>
  );
};

const TruckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="14" height="8" x="2" y="7" rx="2" ry="2"/>
    <path d="M16 8h2.062a2 2 0 0 1 1.789 1.106l2.149 4.298a2 2 0 0 1 .154.596v3a1 1 0 0 1-1 1h-1"/>
    <circle cx="7" cy="18" r="2"/>
    <circle cx="17" cy="18" r="2"/>
  </svg>
)

export default MyParcels;
