import { Request, Response } from 'express';
import { Parcel } from '../parcel/parcel.model';

export const deliveryUpdate = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user || user.role !== 'DELIVERY_BOY') {
    return res.status(403).json({ message: 'Only delivery personnel can update status' });
  }

  const { parcelId, stage } = req.body;
  const status = stage === 'Pickup' ? 'Dispatched' : stage === 'Dropoff' ? 'Delivered' : null;
  if (!status) return res.status(400).json({ message: 'Invalid delivery stage' });

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

  parcel.statusLogs.push({ status, updatedBy: user._id, timestamp: new Date() });
  await parcel.save();

  res.status(200).json({ success: true, message: `Parcel marked as ${status}` });
};