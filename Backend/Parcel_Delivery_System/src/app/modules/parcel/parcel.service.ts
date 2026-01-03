import { Parcel } from "./parcel.model";

export const getAllParcel = async () => {
    const parcels = await Parcel.find({})
        .populate('sender receiver deliveryBoy', 'name email phone picture')
        .sort({ createdAt: -1 });

    const totalParcel = await Parcel.countDocuments();

    return {
        totalParcel: totalParcel,
        data: parcels
    }
}