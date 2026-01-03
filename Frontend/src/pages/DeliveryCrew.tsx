import React from 'react';
import { useGetDeliveryBoysQuery } from '@/redux/features/user/userApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, User, ShieldCheck, Mail, Phone, Loader2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const DeliveryCrew: React.FC = () => {
  const { data: crew, isLoading } = useGetDeliveryBoysQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-zinc-500 animate-pulse">Gathering delivery fleet intelligence...</p>
      </div>
    );
  }

  const crewList = crew || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3 italic">
            <Users className="w-8 h-8 text-primary" /> Delivery Fleet
          </h1>
          <p className="text-zinc-500 mt-1">Manage and monitor all active delivery personnel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crewList.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
              <User className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-600 font-medium">No delivery personnel registered yet.</p>
          </div>
        ) : (
          crewList.map((member) => (
            <Card key={member._id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all group overflow-hidden">
               <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg text-zinc-100 truncate flex items-center gap-2">
                             {member.name}
                             {member.isVerified && <ShieldCheck className="w-4 h-4 text-primary" />}
                          </CardTitle>
                          <Badge variant="outline" className="text-[10px] uppercase border-zinc-800 text-zinc-500">
                              {member.role || 'Delivery Boy'}
                          </Badge>
                      </div>
                  </div>
               </CardHeader>
               <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                          <Mail className="w-4 h-4 text-zinc-600" />
                          <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                          <Phone className="w-4 h-4 text-zinc-600" />
                          <span>{member.phone || '+880-XXXX-XXXXXX'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                          <MapPin className="w-4 h-4 text-zinc-600" />
                          <span className="truncate">{member.address || 'Dhaka, Bangladesh'}</span>
                      </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/50 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                      <span className="text-zinc-600">Status</span>
                      <span className={cn(
                          "px-2 py-0.5 rounded",
                          member.isActive === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      )}>
                          {member.isActive || 'Active'}
                      </span>
                  </div>
               </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryCrew;
