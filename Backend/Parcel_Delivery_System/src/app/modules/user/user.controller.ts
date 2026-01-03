import { Request, Response } from "express"
import Status from "http-status-codes"
import UserServices from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { io } from "../../../server";
import { Parcel } from "../parcel/parcel.model";

const createUser = catchAsync(async(req: Request, res: Response)=> {
    const user = await UserServices.createUserService(req.body)
    
    sendResponse(res, {
        success: true,
        Status: Status.CREATED,
        message: "User Created Successfully!",
        data: user,
    })
})

const createAdmin = catchAsync(async(req: Request, res: Response)=> {
    const user = await UserServices.createAdminService(req.body)
    
    sendResponse(res, {
        success: true,
        Status: Status.CREATED,
        message: "Admin Created Successfully!",
        data: user,
    })
})

const updateUser = catchAsync(async (req: Request, res: Response) => {
    
    const userId = req.params.id;

    const verifiedToken = req.user;

    const payload = req.body;

    const user = await UserServices.updateUser(userId, payload, verifiedToken)
    
    sendResponse(res, {
        success: true,
        Status: Status.CREATED,
        message: "User Updated Successfully!",
        data: user,
    })
})

const getAllUsers = catchAsync(async(req: Request, res: Response) => {
    const users = await UserServices.getAllUsers();

    sendResponse(res, {
        success: true,
        Status: Status.CREATED,
        message: "All Users Retrived!",
        data: users.data,
        meta: users.meta
    })
})

const searchUsers = catchAsync(async (req: Request, res: Response) => {
    const query = req.query.searchTerm as string;
    const users = await UserServices.searchUsers(query);

    sendResponse(res, {
        success: true,
        Status: Status.OK,
        message: "Users found successfully",
        data: users
    })
})

const updateLiveLocation = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { lat, lng, currentArea } = req.body;

    const user = await UserServices.updateLiveLocation(userId, { lat, lng, currentArea });

    // Emit live location to all parcels assigned to this delivery boy
    if (io) {
        const activeParcels = await Parcel.find({ deliveryBoy: userId });
        activeParcels.forEach(parcel => {
            io.to(parcel._id.toString()).emit('location-updated', {
                parcelId: parcel._id,
                lat,
                lng,
                currentArea
            });
        });
        console.log(`Emitted location update for delivery boy: ${userId}`);
    }

    sendResponse(res, {
        success: true,
        Status: Status.OK,
        message: "Live location updated successfully",
        data: user
    })
})

export const userControllers = {
    createUser,
    getAllUsers,
    updateUser,
    createAdmin,
    searchUsers,
    updateLiveLocation
}