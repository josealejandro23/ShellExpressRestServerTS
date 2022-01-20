import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Error400, RstError, TErr400 } from '../utils/UlError';

export const validarCampos = (req: Request, res: Response, next: NextFunction) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) 
         throw RstError(Error400,TErr400.other,JSON.stringify(errors));

      next();
   } catch (error) {
      next(error)
   }
};