import { NextFunction, Request, Response } from "express"
import { TResponseError } from "../utils/UlTypes";

export const errorHandler = (error : any, req : Request, res : Response, next : NextFunction) =>{
   req.fhFin = new Date();
   const statusCode = 500;

   let result : TResponseError = {
      result : false,
      fhinicio: req.fhInicio,
      fhfin : req.fhFin,
      tiempo : req.fhFin.getTime() - req.fhInicio.getTime(),
      msg : 'Ha ocurrido un error al procesar su solicitud: ' + error
   }
   res.status(statusCode).json(result);

   next();
}