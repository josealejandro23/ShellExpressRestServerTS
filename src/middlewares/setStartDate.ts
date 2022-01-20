import { NextFunction, Request, Response } from "express"

export const setStartDate = (req:Request, res:Response,next : NextFunction) =>{
   req.fhInicio = new Date();
   next();
}