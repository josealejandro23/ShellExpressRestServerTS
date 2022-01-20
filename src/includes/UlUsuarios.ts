import { Request } from "express";
import bcryptjs  from 'bcryptjs'

import Usuario from "../models/usuario";
import { TResponseData, TJSONObject, getResponseData } from "../utils/UlTypes";

export const getUsuarios = async (req: Request): Promise<TResponseData> => {
   return new Promise<TResponseData>(async (resolve, reject) => {
      try {
         const {limite = 15, desde = 0} = req.query;
         let body : TJSONObject = {};
         //se crea un filtro para traer solo usuarios activos
         const query = {estado : true};

         //se consultan los usuarios de la db
         const [total,usuarios] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query)
               .skip(Number(desde))
               .limit(Number(limite))
         ]);

         body = {
            total,
            usuarios
         }
         resolve(getResponseData(req, body));
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });
};

export const postUsuario = async (req: Request): Promise<TResponseData> => {
   return new Promise<TResponseData>(async (resolve, reject) => {  
      try {
         let body: TJSONObject = {};
         const { nombre, correo, password, rol } = req.body;

         let usuario = new Usuario({nombre,correo,password,rol});

         //encriptación del password
         const salt = bcryptjs.genSaltSync(10); //número de vueltas para encriptar el pass
         usuario.password = bcryptjs.hashSync(password, salt);
         //guardar en db
         await usuario.save();

         body = {
            usuario
         }

         resolve(getResponseData(req, body));
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });
};

export const putUsuario = async (req: Request): Promise<TResponseData> => {
   return new Promise<TResponseData>(async (resolve, reject) => {
      try {
         let body: TJSONObject = {};

         const { id } = req.params;
         //se extraen los parámetros que no nos intereza actualizar directamente
         const { rol, google, _id, password, ...resto } = req.body;

         //si envían el pass es porque lo van a actualizar y se genera el nuevo hash
         if(password){
            const salt = bcryptjs.genSaltSync(10);
            resto.password = bcryptjs.hashSync(password,salt);
         }

         const usuarioDB = await Usuario.findByIdAndUpdate(id,resto)
         body = {
            usuarioDB
         }
         resolve(getResponseData(req, body));
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });
};

export const deleteUsuario = async (req: Request): Promise<TResponseData> => {
   return new Promise<TResponseData>( async (resolve, reject) => {
      try {
         let body: TJSONObject = {};
         const { id } = req.params;

         //eliminación física de la DB, no recomendado
         // const usuario = await Usuario.findByIdAndDelete( id );
         // const uid = req.uid;
         const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

         //obtener usuario autenticado
         const usuarioautenticado = req.usuario;
         body = {
            usuario,
            usuarioautenticado
         }

         resolve(getResponseData(req, body));
      } catch (error) {
         console.log(error);
         reject(error);
      }
   });
};
