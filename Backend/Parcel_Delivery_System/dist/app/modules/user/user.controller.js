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
exports.userControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = __importDefault(require("./user.service"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const server_1 = require("../../../server");
const parcel_model_1 = require("../parcel/parcel.model");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.default.createUserService(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        Status: http_status_codes_1.default.CREATED,
        message: "User Created Successfully!",
        data: user,
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.default.createAdminService(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        Status: http_status_codes_1.default.CREATED,
        message: "Admin Created Successfully!",
        data: user,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = yield user_service_1.default.updateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        Status: http_status_codes_1.default.CREATED,
        message: "User Updated Successfully!",
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_service_1.default.getAllUsers();
    (0, sendResponse_1.default)(res, {
        success: true,
        Status: http_status_codes_1.default.CREATED,
        message: "All Users Retrived!",
        data: users.data,
        meta: users.meta
    });
}));
const searchUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.searchTerm;
    const users = yield user_service_1.default.searchUsers(query);
    (0, sendResponse_1.default)(res, {
        success: true,
        Status: http_status_codes_1.default.OK,
        message: "Users found successfully",
        data: users
    });
}));
const updateLiveLocation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { lat, lng, currentArea } = req.body;
    const user = yield user_service_1.default.updateLiveLocation(userId, { lat, lng, currentArea });
    // Emit live location to all parcels assigned to this delivery boy
    if (server_1.io) {
        const activeParcels = yield parcel_model_1.Parcel.find({ deliveryBoy: userId });
        activeParcels.forEach(parcel => {
            server_1.io.to(parcel._id.toString()).emit('location-updated', {
                parcelId: parcel._id,
                lat,
                lng,
                currentArea
            });
        });
        console.log(`Emitted location update for delivery boy: ${userId}`);
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        Status: http_status_codes_1.default.OK,
        message: "Live location updated successfully",
        data: user
    });
}));
exports.userControllers = {
    createUser,
    getAllUsers,
    updateUser,
    createAdmin,
    searchUsers,
    updateLiveLocation
};
