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
exports.confirmPayment = exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const env_1 = require("../../config/env");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const parcel_model_1 = require("../parcel/parcel.model");
const stripe = new stripe_1.default(env_1.envVars.STRIPE_SECRET_KEY);
exports.createPaymentIntent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { parcelId } = req.body;
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        res.status(404).json({ success: false, message: 'Parcel not found' });
        return;
    }
    const amount = Math.round(parcel.fee * 100); // Stripe expects cents
    const paymentIntent = yield stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        Status: http_status_codes_1.default.OK,
        message: "Payment intent created successfully",
        data: {
            clientSecret: paymentIntent.client_secret,
        }
    });
}));
exports.confirmPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { parcelId, transactionId } = req.body;
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        res.status(404).json({ success: false, message: 'Parcel not found' });
        return;
    }
    parcel.paymentStatus = 'Paid';
    parcel.transactionId = transactionId;
    yield parcel.save();
    (0, sendResponse_1.default)(res, {
        success: true,
        Status: http_status_codes_1.default.OK,
        message: "Payment confirmed successfully",
        data: parcel
    });
}));
