import React, { useState, useMemo } from 'react';
import { useGetAllParcelsQuery, useAssignDeliveryBoyMutation } from '@/redux/features/parcel/parcelApi';
import { useGetDeliveryBoysQuery } from '@/redux/features/user/userApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { UserPlus, CheckCircle2, Loader2, RefreshCw, MapPin } from 'lucide-react';
import { useUpdateParcelStatusMutation } from '@/redux/features/parcel/parcelApi';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import type { IParcel, IUser } from '@/types';

const AdminParcels: React.FC = () => {
  const { data: parcels, isLoading, isFetching, refetch } = useGetAllParcelsQuery(undefined);
  const { data: deliveryBoys } = useGetDeliveryBoysQuery(undefined);
  const [assignDeliveryBoy, { isLoading: isAssigning }] = useAssignDeliveryBoyMutation();
  
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null);
  const [selectedDB, setSelectedDB] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newLocation, setNewLocation] = useState('');
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateParcelStatusMutation();

  const parcelsList = useMemo(() => {
    const list = (parcels as any)?.data as IParcel[] || [];
    if (statusFilter === 'all') return list;
    return list.filter(p => p.statusLogs[p.statusLogs.length - 1].status.toLowerCase() === statusFilter.toLowerCase());
  }, [parcels, statusFilter]);

  const handleAssign = async () => {
    if (!selectedParcel || !selectedDB) return;
    try {
      await assignDeliveryBoy({ parcelId: selectedParcel, deliveryBoyId: selectedDB }).unwrap();
      toast.success('Delivery person assigned successfully.');
      setIsModalOpen(false);
      setSelectedParcel(null);
      setSelectedDB(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Assignment failed.');
    }
  };

  const handleLocationUpdate = async () => {
    if (!selectedParcel || !newLocation) return;
    try {
      const currentParcel = parcelsList.find(p => p._id === selectedParcel);
      const currentStatus = currentParcel?.statusLogs[currentParcel.statusLogs.length - 1].status || 'Requested';
      
      await updateStatus({ 
        id: selectedParcel, 
        status: currentStatus, 
        location: newLocation,
        note: `Location updated to ${newLocation}`
      }).unwrap();
      
      toast.success('Location updated successfully.');
      setIsLocationModalOpen(false);
      setNewLocation('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Update failed.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'approved': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'dispatched': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-zinc-500 animate-pulse">Loading global shipments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white italic">Global Logistics Control</h1>
          <p className="text-zinc-500 mt-1">Monitor all parcels and assign delivery personnel.</p>
        </div>
        <div className="flex items-center gap-2">
            <select 
                className="bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary/50"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="all">All Status</option>
                <option value="requested">Requested</option>
                <option value="approved">Approved</option>
                <option value="dispatched">Dispatched</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
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
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-300 font-bold uppercase text-[10px] tracking-widest px-6 py-4">Tracking ID</TableHead>
              <TableHead className="text-zinc-300 font-bold uppercase text-[10px] tracking-widest px-6 py-4">Sender & Receiver</TableHead>
              <TableHead className="text-zinc-300 font-bold uppercase text-[10px] tracking-widest px-6 py-4">Status</TableHead>
              <TableHead className="text-zinc-300 font-bold uppercase text-[10px] tracking-widest px-6 py-4">Delivery Boy</TableHead>
              <TableHead className="text-right text-zinc-300 font-bold uppercase text-[10px] tracking-widest px-6 py-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parcelsList.map((parcel) => (
              <TableRow key={parcel._id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                <TableCell className="font-mono text-primary text-xs font-bold px-6">{parcel.trackingId}</TableCell>
                <TableCell className="px-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 uppercase">From:</span>
                        <span className="text-sm text-zinc-200">{(parcel.sender as IUser).name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 uppercase">To:</span>
                        <span className="text-sm text-zinc-200">{(parcel.receiver as IUser).name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6">
                  <Badge variant="outline" className={cn("font-semibold text-[10px] uppercase px-2 py-0.5", getStatusColor(parcel.statusLogs[parcel.statusLogs.length - 1].status))}>
                    {parcel.statusLogs[parcel.statusLogs.length - 1].status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6">
                  {parcel.deliveryBoy ? (
                    <div className="flex items-center gap-2 text-zinc-300 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {(parcel.deliveryBoy as IUser).name || 'Assigned'}
                    </div>
                  ) : (
                    <span className="text-zinc-600 italic text-xs">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-right px-6">
                    <div className="flex items-center gap-2">
                      <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all font-bold"
                          onClick={() => {
                              setSelectedParcel(parcel._id);
                              setIsLocationModalOpen(true);
                          }}
                      >
                          <MapPin className="w-4 h-4 mr-2" /> Update Location
                      </Button>
                      {!parcel.deliveryBoy && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:bg-primary/10 hover:text-primary transition-all font-bold"
                            onClick={() => {
                                setSelectedParcel(parcel._id);
                                setIsModalOpen(true);
                            }}
                        >
                            <UserPlus className="w-4 h-4 mr-2" /> Assign
                        </Button>
                      )}
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Assignment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Assign Delivery Person</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Select a member from the delivery crew to handle this shipment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto pr-2">
            {(deliveryBoys as IUser[])?.map((db) => (
              <div 
                key={db._id}
                onClick={() => setSelectedDB(db._id)}
                className={cn(
                  "p-4 rounded-xl border border-zinc-800 cursor-pointer transition-all flex items-center justify-between group",
                  selectedDB === db._id ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20" : "bg-zinc-950 hover:border-zinc-700"
                )}
              >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {db.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-zinc-200">{db.name}</p>
                        <p className="text-xs text-zinc-500">{db.email}</p>
                    </div>
                </div>
                {selectedDB === db._id && <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in" />}
              </div>
            ))}
            {(deliveryBoys as IUser[])?.length === 0 && <p className="text-center py-8 text-zinc-600">No delivery boys available.</p>}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-zinc-400">Cancel</Button>
            <Button 
                onClick={handleAssign} 
                disabled={!selectedDB || isAssigning}
                className="bg-primary hover:bg-primary/90 min-w-[120px]"
            >
              {isAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Location Update Modal */}
      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Update Parcel Location</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Record the current physical location of this shipment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
              <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Current Location</label>
                  <Input 
                    placeholder="e.g., Dhaka Sorting Center, Gazipur Hub..."
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-zinc-100"
                  />
              </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsLocationModalOpen(false)} className="text-zinc-400">Cancel</Button>
            <Button 
                onClick={handleLocationUpdate} 
                disabled={!newLocation || isUpdatingStatus}
                className="bg-primary hover:bg-primary/90 min-w-[120px]"
            >
              {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Journal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminParcels;
