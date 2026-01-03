import AppError from "../errorHelpers/AppError";
import { IUser } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model";
import Status from 'http-status-codes'
import bcrypt from 'bcryptjs';
import { createUserTokens, newAccessTokenUsingRefreshToken } from "../utils/userTokens";

const credentialLogin = async(payload:Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(Status.BAD_REQUEST,"Email does not exist!");
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(Status.BAD_REQUEST, "Invalid Password!");
    }

    const userTokens = createUserTokens(isUserExist);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}

const getNewAccessToken = async(refreshToken:string) => {
    
    const newAccessToken = newAccessTokenUsingRefreshToken(refreshToken);

    return {
        accessToken:newAccessToken
    }
}

export const AuthServices = {
    credentialLogin,
    getNewAccessToken
}