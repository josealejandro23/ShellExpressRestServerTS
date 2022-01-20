import jwt from "jsonwebtoken";

export const generarJWT = ( userid : string = '') => {
   try {
      //carga útil del token
      const payload = { userid };
      //se crea el token
      const token = jwt.sign(payload, String(process.env.SECRETORPRIVATEKEY),{
         expiresIn:"20h"
      });
      return token;
   } catch (e) {
      throw new Error("Error al generar JWT: " + e);      
   }
}