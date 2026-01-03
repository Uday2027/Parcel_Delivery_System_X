import AppError from "../../errorHelpers/AppError";
import { IauthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import Status from "http-status-codes"
import bcrypt from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const createUserService = async (payload: Partial<IUser>) => {
    const { email, password, role, ...rest } = payload;

    if (role === "ADMIN") {
        throw new AppError(Status.BAD_REQUEST,"You are not allowed to Create ADMIN!");
    }
  
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new AppError(Status.BAD_REQUEST, "User Already exist!");
    }
  
    const allowedRoles = [
      Role.USER,
      Role.DELIVERY_BOY,
    ];
  
    if (role && !allowedRoles.includes(role)) {
      throw new AppError(Status.BAD_REQUEST, "Invalid role specified.");
    }
  
    const hashedPass = await bcrypt.hash(password as string, 10);
  
    const authProvider: IauthProvider = {
      provider: "credentials",
      providerId: email as string,
    };
  
    const user = await User.create({
      email,
      password: hashedPass,
      role: role || Role.USER, 
      auth: [authProvider],
      ...rest,
    });
  
    return user;
  };
  
  const createAdminService = async (payload: Partial<IUser>) => {
    const { email, password, role, ...rest } = payload;

  
    const isAdminExist = await User.findOne({ email });
    if (isAdminExist) {
      throw new AppError(Status.BAD_REQUEST, "Admin Already exist!");
    }
  
    const allowedRoles = [
      Role.ADMIN
    ];
  
    if (role && !allowedRoles.includes(role)) {
      throw new AppError(Status.BAD_REQUEST, "Invalid role specified.");
    }
  
    const hashedPass = await bcrypt.hash(password as string, 10);
  
    const authProvider: IauthProvider = {
      provider: "credentials",
      providerId: email as string,
    };
  
    const user = await User.create({
      email,
      password: hashedPass,
      role: Role.ADMIN, 
      auth: [authProvider],
      ...rest,
    });
  
    return user;
  };

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    
    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(Status.BAD_REQUEST,"User not exist!")
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER) {
            throw new AppError(Status.FORBIDDEN, "You are not authorized!");
        }

        if (decodedToken.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(Status.FORBIDDEN, "You are not authorized!");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(Status.FORBIDDEN, "You are not authorized!");
        }
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password,Number(envVars.BCRYPT_SALT_ROUND))
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    
    return newUpdatedUser;

}

const getAllUsers = async () => {
    const user = await User.find({});

    const totalUser = await User.countDocuments();

    return {
        data: user,
        meta: {
            total: totalUser
        }

    }
}

const searchUsers = async (query: string) => {
    const users = await User.find({
        $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } }
        ]
    });
    return users;
}

const updateLiveLocation = async (userId: string, location: { lat: number; lng: number; currentArea?: string }) => {
    const user = await User.findByIdAndUpdate(
        userId,
        {
            liveLocation: {
                ...location,
                lastUpdated: new Date()
            }
        },
        { new: true }
    );
    return user;
}

const UserServices = {
    createUserService,
    getAllUsers,
    updateUser,
    createAdminService, // Assuming createAdmin refers to createAdminService
    searchUsers,
    updateLiveLocation
}

export default UserServices;