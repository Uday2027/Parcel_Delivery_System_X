import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IParcel } from '@/types';

interface AIDeliveryInsightProps {
  parcels: IParcel[];
  userId: string;
}

const AIDeliveryInsight: React.FC<AIDeliveryInsightProps> = ({ parcels, userId }) => {
  const insights = useMemo(() => {
    if (!parcels || parcels.length === 0) return null;

    const actingAsSender = parcels.filter(p => 
      typeof p.sender === 'string' ? p.sender === userId : p.sender?._id === userId
    ).length;
    const actingAsReceiver = parcels.filter(p => 
      typeof p.receiver === 'string' ? p.receiver === userId : p.receiver?._id === userId
    ).length;
    
    const primaryRole = actingAsSender >= actingAsReceiver ? 'Sender' : 'Receiver';
    const urgentParcels = parcels.filter(p => {
        const lastStatus = p.statusLogs[p.statusLogs.length - 1].status;
        return lastStatus !== 'Delivered' && lastStatus !== 'Cancelled' && p.weight > 10;
    });

    return {
      primaryRole,
      urgentCount: urgentParcels.length,
      suggestion: primaryRole === 'Sender' 
        ? "You've been busy shipping! Most of your parcels are heavy. Consider 'Bulk Shield' insurance for your next high-weight delivery."
        : "You have several incoming packages. The AI predicts peak delivery times between 2 PM - 4 PM based on local fleet activity.",
      priorityLabel: urgentParcels.length > 0 ? "High Priority Detected" : "Smooth Operations"
    };
  }, [parcels, userId]);

  if (!insights) return null;

  return (
    <Card className="bg-zinc-900/50 border-zinc-800 border-l-4 border-l-primary overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Brain className="w-24 h-24 text-primary" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-zinc-100 flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" /> AI Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
            <div className={cn(
                "p-2 rounded-lg bg-zinc-950 border border-zinc-800",
                insights.urgentCount > 0 ? "text-amber-500" : "text-emerald-500"
            )}>
                {insights.urgentCount > 0 ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div className="space-y-1">
                <p className="text-zinc-100 text-sm font-medium">{insights.priorityLabel}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{insights.suggestion}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-800/50">
            <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Detected Role</p>
                <p className="text-xs text-zinc-300 flex items-center gap-1.5 mt-0.5">
                    <TrendingUp className="w-3 h-3 text-primary" /> {insights.primaryRole} Mode
                </p>
            </div>
            <div className="bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Priority Load</p>
                <p className="text-xs text-zinc-300 mt-0.5">{insights.urgentCount} Heavy Clusters</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIDeliveryInsight;
