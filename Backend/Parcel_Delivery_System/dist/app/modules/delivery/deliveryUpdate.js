"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryUpdate = void 0;
const parcel_model_1 = require("../parcel/parcel.model");
const deliveryUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user || user.role !== 'DELIVERY_BOY') {
        return res.status(403).json({ message: 'Only delivery personnel can update status' });
    }
    const { parcelId, stage } = req.body;
    const status = stage === 'Pickup' ? 'Dispatched' : stage === 'Dropoff' ? 'Delivered' : null;
    if (!status)
        return res.status(400).json({ message: 'Invalid delivery stage' });
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        return res.status(404).json({ message: 'Parcel not found' });
    parcel.statusLogs.push({ status, updatedBy: user._id, timestamp: new Date() });
    yield parcel.save();
    res.status(200).json({ success: true, message: `Parcel marked as ${status}` });
});
exports.deliveryUpdate = deliveryUpdate;
