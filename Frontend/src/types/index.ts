export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  DELIVERY_BOY = "DELIVERY_BOY",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isActive: string;
  userId?: string;
  isVerified?: boolean;
  address?: string;
  picture?: string;
}

export interface IStatusLog {
  status: string;
  note?: string;
  updatedBy: string;
  timestamp: string;
  location?: string;
}

export interface IParcel {
  _id: string;
  trackingId: string;
  sender: string | IUser;
  receiver: string | IUser;
  phone: number;
  type: string;
  weight: number;
  pickupAddress: string;
  deliveryAddress: string;
  fee: number;
  estimatedDeliveryDate?: string;
  statusLogs: IStatusLog[];
  deliveryBoy?: string | IUser;
  paymentStatus?: 'Pending' | 'Paid';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}
