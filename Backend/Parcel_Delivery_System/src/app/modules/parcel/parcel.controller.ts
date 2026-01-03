import { NextFunction, Request, Response } from 'express';
import { Parcel } from './parcel.model';
import { IStatusLog } from './parcel.interface';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { getAllParcel } from './parcel.service';
import Status from "http-status-codes"
import mongoose from 'mongoose';
import { io } from '../../../server';

const calculateFee = (weight: number): number => {
  const ratePerKg = 50; //lets say
  return weight * ratePerKg;
};

export const createParcel = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  const { receiver, phone, weight, type, pickupAddress, deliveryAddress, estimatedDeliveryDate } = req.body;
  const sender = req.user?.userId;

  const fee = calculateFee(weight); 

  
    const newParcel = await Parcel.create({
      sender,
      receiver,
      phone,
      type,
      weight,
      pickupAddress,
      deliveryAddress,
      estimatedDeliveryDate,
      fee, 
      statusLogs: [
        {
          status: 'Requested',
          updatedBy: sender,
          location: pickupAddress
        } as IStatusLog,
      ],
    });

    sendResponse(res, {
      success: true,
      Status: Status.CREATED,
      message: "Parcel Created Succesfully ˗ˏˋ ★ ˎˊ˗",
      data: newParcel

  })
});


export const getMyParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  const parcels = await Parcel.find({ $or: [{ sender: userId }, { receiver: userId }] })
    .populate('sender receiver deliveryBoy', 'name email phone picture')
    .sort({ createdAt: -1 });
  
  sendResponse(res, {
    success: true,
    Status: Status.OK,
    message: "Your Parcel Fetched Successfully ˗ˏˋ ★ ˎˊ˗",
    data: parcels
  });
});


export const cancelParcel = (async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const parcelId = req.params.id;

  try {
    const parcel = await Parcel.findById(parcelId);

    if (!parcel || parcel.sender.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized or Parcel not found' });
    }

    const lastStatus = parcel.statusLogs[parcel.statusLogs.length - 1]?.status;

    if (['Dispatched', 'Delivered'].includes(lastStatus)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel after dispatch' });
    }

    parcel.statusLogs.push({
      status: 'Cancelled',
      updatedBy: new mongoose.Types.ObjectId(userId),
      timestamp: new Date(),
    });

    await parcel.save();

    return res.json({ success: true, message: 'Parcel cancelled successfully' });

  } catch (err) {
    console.error('Cancel error:', err);
    return res.status(500).json({ success: false, message: 'Cancellation failed', error: err });
  }
});

export const getAllParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await getAllParcel();

  sendResponse(res, {
    success: true,
    Status: Status.OK,
    message: "All Parcels Retrived!",
    data: users.data
  });
});


export const updateParcelStatus = async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  const userId = req.user?.userId;
  const { status, note, location } = req.body;

  try {
    const parcel = await Parcel.findById(parcelId).populate('deliveryBoy');
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    
    parcel.statusLogs.push({
      status,
      updatedBy: userId,
      note,
      location,
      timestamp: new Date(),
    });

    await parcel.save();
    
    const updatedParcel = await Parcel.findById(parcelId).populate('deliveryBoy');

    // Emit real-time update
    if (io) {
      io.to(parcelId).emit('parcel-updated', updatedParcel);
      console.log(`Emitted update for parcel: ${parcelId}`);
    }

    res.json({ success: true, message: 'Status updated', data: updatedParcel });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};


export const publicTracking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { trackingId } = req.params;
  const parcel = await Parcel.findOne({ trackingId }).populate('sender receiver deliveryBoy', 'name email phone picture');

  if (!parcel) {
     res.status(Status.NOT_FOUND).json({ message: 'Tracking ID not found' });
     return;
  }

  res.json({
    trackingId: parcel.trackingId,
    currentStatus: parcel.statusLogs.slice(-1)[0]?.status,
    history: parcel.statusLogs,
    deliveryBoy: parcel.deliveryBoy
  });
});


export const filterParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { status, from, to } = req.body;

  const query: any = {};

  if (status) {
    query['statusLogs.status'] = status;
  }

  if (from || to) {
    query['createdAt'] = {};
    if (from) query['createdAt'].$gte = new Date(from);
    if (to) query['createdAt'].$lte = new Date(to);
  }

  const parcels = await Parcel.find(query).populate('sender receiver deliveryBoy', 'name email phone picture');
  sendResponse(res, {
    success: true,
    Status: Status.OK,
    message: "Filtered Parcels Retrived!",
    data: parcels
  });
});
export const assignDeliveryBoy = catchAsync(async (req: Request, res: Response) => {
  const { parcelId, deliveryBoyId } = req.body;
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    res.status(404).json({ message: 'Parcel not found' });
    return;
  }

  parcel.deliveryBoy = new mongoose.Types.ObjectId(deliveryBoyId);
  parcel.statusLogs.push({
    status: 'Approved',
    updatedBy: (req as any).user?.userId,
    note: 'Delivery person assigned',
    timestamp: new Date()
  });

  await parcel.save();

  sendResponse(res, {
    success: true,
    Status: Status.OK,
    message: "Delivery person assigned successfully",
    data: parcel
  });
});

export const getDeliveryBoyParcels = catchAsync(async (req: Request, res: Response) => {
  const deliveryBoyId = req.user?.userId;
  const parcels = await Parcel.find({ deliveryBoy: deliveryBoyId }).populate('sender receiver', 'name email phone picture');
  
  sendResponse(res, {
    success: true,
    Status: Status.OK,
    message: "Assigned parcels fetched successfully",
    data: parcels
  });
});
