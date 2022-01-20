import { servidorRest } from "./models/server";
import { TControlador } from './utils/UlTypes';
import { TLoginController } from './controllers/login';
import { TUserController } from "./controllers/Usuarios";


const TControladores : Array<TControlador> = [
   new TLoginController,
   new TUserController
]

//con el siguiente bloque se modifica el objeto Request y se le añaden nuevas propiedades para poder leerlas en cualquier parte
//se guarda la propiedad usuario para poder mover la info del usuario que hace la petición
declare global {
   namespace Express {
      interface Request {
         fhInicio : Date,
         fhFin : Date,
         usuario : any
      }
   }
}

const server = new servidorRest(TControladores);
server.startServer();