"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_routes_1 = require("../auth/auth.routes");
const parcel_route_1 = require("../modules/parcel/parcel.route");
const payment_route_1 = require("../modules/payment/payment.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoutes
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRouter
    },
    {
        path: "/parcel",
        route: parcel_route_1.parcelRouter
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRoutes
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
