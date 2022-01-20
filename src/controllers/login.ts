import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";

import { TControlador } from "../utils/UlTypes";
import { rutas } from "../includes/UlConst";
import { validarCampos } from '../middlewares/validarCampos';
import { loginUsuario } from '../includes/UlLogin';

export class TLoginController extends TControlador {
   constructor() {
      super(rutas.login);
   }
   protected fijarRutas(): void {
      this.router.post(
         "/",
         [
            check("correo", "El correo es obligatorio").isEmail(),
            check("password", "La contraseña es obligatoria").not().isEmpty(),
            validarCampos,
         ],
         this.loginUser
      );
   }

   private async loginUser(req: Request, res: Response, next : NextFunction) {
      try {
         res.status(200).json(await loginUsuario(req));
      } catch (e) {
         next(e)
      }
   }
}
