import mongoose, { model, Schema } from "mongoose";
import { IauthProvider, isActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IauthProvider>({
    provider: { type: String, required: true },
    providerId:{type:String,required:true}
},{versionKey:false, _id:false})

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(Role),
        required:true
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(isActive),
        default: isActive.ACTIVE
    },
    isVerified: { type: Boolean },
    auth:[authProviderSchema],
    liveLocation: {
        lat: { type: Number },
        lng: { type: Number },
        lastUpdated: { type: Date },
        currentArea: { type: String }
    }
}, {
    timestamps: true,
    versionKey:false
})

export const User = model<IUser>("User", userSchema)

