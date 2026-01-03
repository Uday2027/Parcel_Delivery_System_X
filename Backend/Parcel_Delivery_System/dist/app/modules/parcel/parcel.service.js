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
exports.getAllParcel = void 0;
const parcel_model_1 = require("./parcel.model");
const getAllParcel = () => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({})
        .populate('sender receiver deliveryBoy', 'name email phone picture')
        .sort({ createdAt: -1 });
    const totalParcel = yield parcel_model_1.Parcel.countDocuments();
    return {
        totalParcel: totalParcel,
        data: parcels
    };
});
exports.getAllParcel = getAllParcel;
