import { Request, Response } from "express";
import Usuario from "../models/usuario";
import { TResponseData, TJSONObject, getResponseData } from '../utils/UlTypes';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../utils/generarJWT';
import { RstError, Error401, TErr401 } from '../utils/UlError';


export const loginUsuario = async (req : Request) : Promise<TResponseData> => {
   return new Promise<TResponseData>(async (resolve, reject) => {
      try {
         let body : TJSONObject = {};
         const { correo, password } = req.body;
         //verificar si el correo existe
         const usuario = await Usuario.findOne({ correo: correo });
         if (!usuario) 
            throw RstError(Error401, TErr401.other, "El usuario/pasword no es correcto - usuario");
         
         //verificar si el usuario está activo en la DB
         if (!usuario.estado) 
            throw RstError(Error401, TErr401.other, "El usuario/password no son correctos - estado: false");
         
         //verificar el password, esta función valida si el password recibido es igual al de la db
         const bValida = bcryptjs.compareSync(password, usuario.password);
         if (!bValida) 
            throw RstError(Error401, TErr401.other, "El usuario/password no son correctos - password");
         
         //crear JWT
         const token = await generarJWT(usuario.id);
         body = {
            usuario,
            token
         }
         resolve(getResponseData(req,body));
      } catch (e) {
         reject(e)
      }
   })
}