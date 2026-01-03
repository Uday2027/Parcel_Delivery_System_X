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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_service_1 = require("./auth.service");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialLogin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInfo = yield auth_service_1.AuthServices.credentialLogin(req.body);
    res.cookie("accessToken", loginInfo.accessToken, {
        httpOnly: true,
        secure: false
    });
    res.cookie("refreshToken", loginInfo.refreshToken, {
        secure: false,
        httpOnly: true
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        Status: http_status_codes_1.default.OK,
        message: "User logged in Successfully!",
        data: loginInfo,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewAccessToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Refresh token not received!");
    }
    const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    res.cookie("accessToken", tokenInfo.accessToken, {
        httpOnly: true,
        secure: false
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        Status: http_status_codes_1.default.OK,
        message: "User logged in Successfully!",
        data: tokenInfo,
    });
}));
exports.AuthControllers = {
    credentialLogin,
    getNewAccessToken
};
