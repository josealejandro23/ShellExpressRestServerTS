import { Router, Request,Response } from "express";

export type TJSONObject = {
   [key : string] : any
}

export type TJSONArray = [any];

export abstract class TControlador {
   path : string;
   router : Router
   constructor(path:string) {
      this.path = path;
      this.router = Router();
      this.fijarRutas();
   }

   protected abstract fijarRutas():void; 
}

export type TResponseData = {
   headers: {
      resultado: boolean;
      fhinicio: Date;
      fhfin: Date;
      tiempo: number;
   };
   body: TJSONObject;
};

export const getResponseData = (req: Request, body:TJSONObject) : TResponseData=>{
   req.fhFin = new Date(); 
   return {
      headers: {
         resultado: true,
         fhinicio: req.fhInicio,
         fhfin: req.fhFin,
         tiempo: req.fhFin.getTime() - req.fhInicio.getTime(),
      },
      body,
   };
}

export type TResponseError = {
   fhinicio : Date,
   fhfin : Date,
   tiempo : number,
   result : boolean,
   msg : string
}

// Tipos para agregar información adicional a las respuestas con error
export type THTTPError = { internalcode: number, getmsg: Function }

export type THTTPErrorInfo = {
   name: string,
   statuscode: number,
   error: { [key: string]: THTTPError }
}