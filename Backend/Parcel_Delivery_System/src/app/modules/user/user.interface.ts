import { Types } from "mongoose";

export enum Role{
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    DELIVERY_BOY = "DELIVERY_BOY"
}

export interface IauthProvider {
    provider: "google"| "credentials";
    providerId: string;
}

export enum isActive{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser  {
    _id?: Types.ObjectId;
    name: string
    email: string;
    password?: string
    phone ?: string;
    picture ?: string;
    address?: string
    isDeleted?: string
    isActive?: isActive
    isVerified?: boolean
    role?: Role;
    auth: IauthProvider[];
    liveLocation?: {
        lat: number;
        lng: number;
        lastUpdated: Date;
        currentArea?: string;
    };
}