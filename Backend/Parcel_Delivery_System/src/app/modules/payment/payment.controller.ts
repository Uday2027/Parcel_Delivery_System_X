import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
import { envVars } from '../../config/env';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import Status from "http-status-codes"
import { Parcel } from '../parcel/parcel.model';

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

export const createPaymentIntent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { parcelId } = req.body;
  const parcel = await Parcel.findById(parcelId);

  if (!parcel) {
    res.status(404).json({ success: false, message: 'Parcel not found' });
    return;
  }

  const amount = Math.round(parcel.fee * 100); // Stripe expects cents

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  sendResponse(res, {
    success: true,
    Status: Status.OK,
    message: "Payment intent created successfully",
    data: {
      clientSecret: paymentIntent.client_secret,
    }
  });
});

export const confirmPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { parcelId, transactionId } = req.body;
    
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      res.status(404).json({ success: false, message: 'Parcel not found' });
      return;
    }
  
    parcel.paymentStatus = 'Paid';
    parcel.transactionId = transactionId;
    await parcel.save();
  
    sendResponse(res, {
      success: true,
      Status: Status.OK,
      message: "Payment confirmed successfully",
      data: parcel
    });
  });
