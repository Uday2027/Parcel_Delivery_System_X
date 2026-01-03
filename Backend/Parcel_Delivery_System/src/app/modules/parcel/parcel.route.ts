import { Router } from 'express';
import { createParcel, getMyParcels, cancelParcel, getAllParcels, updateParcelStatus, publicTracking, filterParcels, assignDeliveryBoy, getDeliveryBoyParcels } from './parcel.controller';
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from '../user/user.interface';
import { deliveryUpdate } from '../delivery/deliveryUpdate';

export const parcelRouter = Router();

parcelRouter.post('/create', checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN), createParcel);

parcelRouter.get('/my', checkAuth(Role.USER), getMyParcels);

parcelRouter.patch('/cancel/:id', checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN), cancelParcel);

parcelRouter.get("/all-parcel", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getAllParcels);

parcelRouter.patch("/status/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DELIVERY_BOY), updateParcelStatus);

parcelRouter.post('/delivery/update', checkAuth(Role.DELIVERY_BOY, Role.ADMIN, Role.SUPER_ADMIN), deliveryUpdate);

parcelRouter.get('/tracking/:trackingId', publicTracking);

parcelRouter.post('/filter-parcel', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), filterParcels);
parcelRouter.post('/assign-delivery-boy', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), assignDeliveryBoy);
parcelRouter.get('/assigned-parcels', checkAuth(Role.DELIVERY_BOY, Role.ADMIN, Role.SUPER_ADMIN), getDeliveryBoyParcels);



