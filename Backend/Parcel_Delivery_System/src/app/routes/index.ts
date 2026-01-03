import { Router } from "express"
import { userRoutes } from "../modules/user/user.route"
import { AuthRouter } from "../auth/auth.routes"
import { parcelRouter } from "../modules/parcel/parcel.route"
import { paymentRoutes } from "../modules/payment/payment.route"

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: AuthRouter
    },
    {
        path: "/parcel",
        route: parcelRouter
    },
    {
        path: "/payment",
        route: paymentRoutes
    }

]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})