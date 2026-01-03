import { Types } from 'mongoose';

export type ParcelStatus =
  | 'Requested'
  | 'Approved'
  | 'Dispatched'
  | 'In Transit'
  | 'Delivered'
  | 'Cancelled';

export interface IStatusLog {
  status: ParcelStatus;
  note?: string;
  updatedBy?: Types.ObjectId; 
  timestamp?: Date;
  location?: string;
}

export interface IParcel {
  _id?: Types.ObjectId;
  trackingId?: string;
  sender: Types.ObjectId; 
  receiver: Types.ObjectId; 
  phone: number;
  type: string; 
  weight: number;
  pickupAddress: string;
  deliveryAddress: string;
  fee: number;
  estimatedDeliveryDate?: Date;
  isFlagged?: boolean;
  isHeld?: boolean;
  deliveryBoy?: Types.ObjectId; 
  statusLogs: IStatusLog[];
  paymentStatus: 'Pending' | 'Paid';
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
