"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const statusLogSchema = new mongoose_1.Schema({
    status: { type: String, enum: ['Requested', 'Approved', 'Dispatched', 'In Transit', 'Delivered', 'Cancelled'], required: true },
    note: { type: String },
    updatedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'USER' },
    timestamp: { type: Date, default: Date.now },
    location: { type: String },
});
const parcelSchema = new mongoose_1.Schema({
    trackingId: { type: String, unique: true },
    sender: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: Number, required: true },
    type: { type: String, required: true, },
    weight: { type: Number, required: true },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    fee: { type: Number, required: true },
    estimatedDeliveryDate: { type: Date },
    isFlagged: { type: Boolean, default: false },
    isHeld: { type: Boolean, default: false },
    deliveryBoy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    statusLogs: [statusLogSchema],
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    transactionId: { type: String },
}, {
    timestamps: true
});
parcelSchema.pre('save', function (next) {
    if (!this.trackingId) {
        const date = new Date();
        const formatted = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
        this.trackingId = `TRK-${formatted}-${Math.floor(Math.random() * 1000000)}`;
    }
    next();
});
exports.Parcel = mongoose_1.default.model('Parcel', parcelSchema);
