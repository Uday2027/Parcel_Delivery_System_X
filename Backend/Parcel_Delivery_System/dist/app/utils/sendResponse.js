"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data.Status).json({
        Status: data.Status,
        success: data.success,
        message: data.message,
        data: data.data,
        meta: data.meta,
    });
};
exports.default = sendResponse;
