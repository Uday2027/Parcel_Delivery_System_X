import { Server as HttpServer, createServer } from "http";
import { Server as SocketServer } from "socket.io";
import mongoose from "mongoose"
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: HttpServer;
let io: SocketServer;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.MONGO_URI)
        console.log("Database Connected Successfully!");

        const httpServer = createServer(app);
        io = new SocketServer(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Socket.io connection logic
        io.on("connection", (socket) => {
            console.log("A user connected:", socket.id);

            socket.on("join-parcel", (parcelId: string) => {
                socket.join(parcelId);
                console.log(`Socket ${socket.id} joined parcel room: ${parcelId}`);
            });

            socket.on("update-location", (data: { parcelId: string; lat: number; lng: number }) => {
                const { parcelId, lat, lng } = data;
                io.to(parcelId).emit("location-updated", { lat, lng });
                console.log(`Broadcasted location for parcel ${parcelId}: ${lat}, ${lng}`);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });

        if (process.env.NODE_ENV !== 'production') {
            server = httpServer.listen(envVars.PORT, () => {
                console.log(`Server with Socket.io is listening at PORT ${envVars.PORT}`);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

startServer();
seedSuperAdmin();

export { io };
export default app;

process.on("unhandledRejection", () => {
    console.log('Unhandled Rejection Detected!...Server Shutting Down');;

    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
})

process.on("uncaughtException", () => {
    console.log('Uncaught Exception Detected!...Server Shutting Down');;

    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
})

process.on("SIGTERM", () => {
    console.log('SIGTERM signal received!...Server Shutting Down');;

    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
})
