import Usuario from "../models/usuario";
import Role from "../models/role"
import { Response, Request, NextFunction } from 'express';
import { Error500, TErr500, RstError, Error401, TErr401 } from '../utils/UlError';

export const existeEmail = async (correo: string = "") => {
   const bExiste = await Usuario.findOne({ correo: correo });
   //si el correo ya existe no se puede crear el usuario
   if (bExiste) {
      throw new Error(`El correo "${correo}" ya existe en la DB`);
   }
};

export const esRolValido = async (rol = '') =>{
   const existeRol = await Role.findOne({rol:rol}); 
   if(!existeRol || !rol){
      throw new Error(`El rol ${rol} no existe en la DB`);
   }
   return true;
}

export const validarQuerys = (query: string) => {
   if (!query || query === "0") return true;
   let val = Number(query);
   if (!val) {
      throw new Error("Las querys límite y desde deben ser números");
   }
   return true;
};

export const existeUsuarioID = async (id : string = '') => {
   const usuario = await Usuario.findById(id);
   if(!usuario){
      throw new Error("No existe un usuario asociado a ese id");
   }
}

//--Esta función tiene la capacidad de recibir argumentos diferentes a los 3 de un middlewares, para ello
//--debe retornar una función con la forma esperada por el arreglo de middlewares, es decir req,res,next
export const tieneRol = ( ...roles:String[] ) =>{
   return(req : Request, res : Response, next : NextFunction) => {
      try {
         //se valida que efectivamente venga un objeto usuario que debió crearse en la validación del jwt
         if (!req.usuario)
            throw RstError(Error500, TErr500.other, "Se quiere verificar el rol sin validar el token primero");

         //se valida que el rol del usuario si esté entre los permitidos
         if (!roles.includes(req.usuario.rol))
            throw RstError(Error401, TErr401.other, "El servicio requiere uno de estos roles: " + roles);

         next();
      } catch (error) {
         next(error)
      }
   }
}

