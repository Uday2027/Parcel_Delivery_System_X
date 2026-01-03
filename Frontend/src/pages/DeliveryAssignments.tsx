import React from 'react';
import { useGetAssignedParcelsQuery, useUpdateParcelStatusMutation } from '@/redux/features/parcel/parcelApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Truck, Phone, CheckCircle2, Loader2, Navigation, PackageCheck, Box } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import type { IParcel, IUser } from '@/types';

const DeliveryAssignments: React.FC = () => {
  const { data: parcels, isLoading, isFetching, refetch } = useGetAssignedParcelsQuery(undefined) as { data: { data: IParcel[] } | undefined, isLoading: boolean, isFetching: boolean, refetch: any };
  const [updateStatus, { isLoading: isUpdating }] = useUpdateParcelStatusMutation();

  const handleUpdate = async (id: string, status: string, note: string) => {
    try {
      await updateStatus({ id, status, note }).unwrap();
      toast.success(`Parcel status updated to ${status}.`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Update failed.');
    }
  };

  const currentStatus = (parcel: IParcel) => parcel.statusLogs[parcel.statusLogs.length - 1].status;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-zinc-500 animate-pulse">Fetching your assigned route...</p>
      </div>
    );
  }

  const parcelsList = parcels?.data || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3 italic">
            <Navigation className="w-8 h-8 text-primary" /> Delivery Fleet
          </h1>
          <p className="text-zinc-500 mt-1">Manage your active assignments and update delivery progress.</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
          onClick={() => refetch()}
        >
          <Box className={cn("w-4 h-4", isFetching && "animate-spin")} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {parcelsList.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
              <Truck className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-600 font-medium">No parcels assigned to you yet.</p>
          </div>
        ) : (
          parcelsList.map((parcel) => (
            <Card key={parcel._id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all group overflow-hidden flex flex-col">
              <div className="h-1 bg-gradient-to-r from-primary via-blue-500 to-indigo-500 opacity-50" />
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-[10px] font-mono border-zinc-700 text-zinc-400">
                    {parcel.trackingId}
                  </Badge>
                  <Badge className={cn(
                    "uppercase text-[10px] font-bold",
                    currentStatus(parcel) === 'Delivered' ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/20" : "bg-primary/20 text-primary border-primary/20"
                  )}>
                    {currentStatus(parcel)}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-zinc-100 font-bold group-hover:text-primary transition-colors">
                  {(parcel.receiver as IUser).name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-zinc-500">
                    <Phone className="w-3 h-3" /> {parcel.phone}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                            <div className="w-0.5 h-8 bg-zinc-800" />
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <div className="flex flex-col gap-4 text-xs">
                            <div className="space-y-1">
                                <p className="text-zinc-500 uppercase font-bold tracking-tighter">Pickup</p>
                                <p className="text-zinc-300 leading-snug">{parcel.pickupAddress}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-zinc-500 uppercase font-bold tracking-tighter">Delivery</p>
                                <p className="text-zinc-300 leading-snug">{parcel.deliveryAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-zinc-800 bg-zinc-950/30 flex gap-2">
                {currentStatus(parcel) === 'Approved' && (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    onClick={() => handleUpdate(parcel._id, 'Dispatched', 'Parcel has been picked up')}
                    disabled={isUpdating}
                  >
                    <Truck className="w-4 h-4 mr-2" /> Mark Dispatched
                  </Button>
                )}
                {currentStatus(parcel) === 'Dispatched' && (
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    onClick={() => handleUpdate(parcel._id, 'Delivered', 'Parcel successfully delivered')}
                    disabled={isUpdating}
                  >
                    <PackageCheck className="w-4 h-4 mr-2" /> Mark Delivered
                  </Button>
                )}
                {currentStatus(parcel) === 'Delivered' && (
                  <div className="flex items-center justify-center w-full py-2 text-emerald-500 font-bold text-sm bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Delivery Complete
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryAssignments;
