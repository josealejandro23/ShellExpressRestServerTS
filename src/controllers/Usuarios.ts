import { NextFunction, Response,Request } from "express";
import {check,query} from 'express-validator'

import {TControlador} from "../utils/UlTypes";
import {rutas} from '../includes/UlConst';
import { getUsuarios, postUsuario, putUsuario, deleteUsuario } from '../includes/UlUsuarios';
import {
   validarQuerys,
   validarCampos,
   existeEmail,
   esRolValido,
   validarJWT,
   tieneRol,
   existeUsuarioID,
} from "../middlewares/index";

export class TUserController extends TControlador {
   constructor() {
      super(rutas.usuario);
   }

   protected fijarRutas(): void {
      this.router.get("/:id?", [query(["limite", "desde"]).custom(validarQuerys), validarCampos], this.getUsers);

      this.router.post(
         "/",
         [
            check("correo", "El correo no es válido").isEmail(), //agrega el error al request si es que sucede
            check("nombre", "El nombre es obligatorio").not().isEmpty(),
            check("password", "El password es obligatorio y mayor a 6 letras").isLength({ min: 6 }),
            //se valida que el rol exista en la base de datos, validación personalizada
            //check("rol").custom(rol => esRolValido(rol)) es equivalente a la siguiente línea check("rol").custom(esRolValido),
            check("correo").custom(existeEmail),
            check("rol").custom(esRolValido),
            validarCampos,
         ],
         this.createUser
      );

      this.router.put(
         "/:id?",
         [
            check("id", "No es un id válido").isMongoId(),
            check("id").custom(existeUsuarioID),
            check("rol").custom(esRolValido),
            validarCampos,
         ],
         this.updateUser
      );

      this.router.delete(
         "/:id?",
         [
            validarJWT,
            tieneRol("ADMIN"),
            check("id", "No es un id válido").isMongoId(),
            check("id").custom(existeUsuarioID),
            validarCampos,
         ],
         this.deleteUser
      );
   }

   //--get usuarios
   private async getUsers(req: Request, res: Response, next: NextFunction) {
      try {
         res.status(200).json(await getUsuarios(req));
      } catch (error) {
         next(error);
      }
   }

   //--crear usuario
   private async createUser(req: Request, res: Response, next: NextFunction) {
      try {
         res.status(200).json(await postUsuario(req));
      } catch (error) {
         next(error);
      }
   }

   //--editar usuario
   private async updateUser(req: Request, res: Response, next: NextFunction) {
      try {
         res.status(200).json(await putUsuario(req));
      } catch (error) {
         next(error);
      }
   }

   //--delete usuario
   private async deleteUser(req: Request, res: Response, next: NextFunction) {
      try {
         res.status(200).json(await deleteUsuario(req));
      } catch (error) {
         next(error);
      }
   }
}