// import { JwtPayload } from "jsonwebtoken";



// declare global {
//     namespace Express{
//         interface Request{
//             user:JwtPayload
//         }
//     }
// }
import { IUser } from '../../interfaces/user.interface';
import { IParcel } from '../../interfaces/parcel.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      parcel?: IParcel;
    }
  }
}