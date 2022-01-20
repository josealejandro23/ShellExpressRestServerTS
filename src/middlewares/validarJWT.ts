import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

import Usuario from "../models/usuario";
import { TErrorServer, RstError, Error401, TErr400, TErr401 } from "../utils/UlError";

export const validarJWT = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const token = req.header("x-token");
      if (!token) throw RstError(Error401, TErr401.other, "No se ha recibido un token con la petición");

      //se valida que el token sí sea correcto, esto retorna el token completo
      //esta validación retorna el payload del token y de ahí se puede tener la info de usuario
      const { userid }: any = jwt.verify(token, String(process.env.SECRETORPRIVATEKEY));
      //obtener el usuario
      const usuario = await Usuario.findById(userid);
      //validar que el usuario exista físicamente en la DB
      if (!usuario)
         throw RstError(
            Error401,
            TErr401.other,
            "El usuario que intenta hacer la petición no existe en la base de datos"
         );

      //validar si es un usuario activo o inactivo
      if (!usuario.estado)
         throw RstError(Error401, TErr401.other, "El usuario que intenta hacer la petición no está activo en la DB");

      //se guarda la propiedad como usuario autenticado
      req.usuario = usuario;

      next();
   } catch (error) {
      console.log(error);
      next(error);
   }
};
