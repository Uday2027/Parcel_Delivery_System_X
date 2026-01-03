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
exports.io = void 0;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
let server;
let io;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.MONGO_URI);
        console.log("Database Connected Successfully!");
        const httpServer = (0, http_1.createServer)(app_1.default);
        exports.io = io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        // Socket.io connection logic
        io.on("connection", (socket) => {
            console.log("A user connected:", socket.id);
            socket.on("join-parcel", (parcelId) => {
                socket.join(parcelId);
                console.log(`Socket ${socket.id} joined parcel room: ${parcelId}`);
            });
            socket.on("update-location", (data) => {
                const { parcelId, lat, lng } = data;
                io.to(parcelId).emit("location-updated", { lat, lng });
                console.log(`Broadcasted location for parcel ${parcelId}: ${lat}, ${lng}`);
            });
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
        if (process.env.NODE_ENV !== 'production') {
            server = httpServer.listen(env_1.envVars.PORT, () => {
                console.log(`Server with Socket.io is listening at PORT ${env_1.envVars.PORT}`);
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
(0, seedSuperAdmin_1.seedSuperAdmin)();
exports.default = app_1.default;
process.on("unhandledRejection", () => {
    console.log('Unhandled Rejection Detected!...Server Shutting Down');
    ;
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", () => {
    console.log('Uncaught Exception Detected!...Server Shutting Down');
    ;
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log('SIGTERM signal received!...Server Shutting Down');
    ;
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
