import { THTTPErrorInfo } from "./UlTypes";

// Clase con información adicional para entregar errores al cliente
export class TErrorServer extends Error {
   statusCode: number = Error500.statuscode;
   internalCode: number = 500000;
   constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, TErrorServer.prototype);
   }
}

//#region Enums con los posibles errores para cada código HTTP
export enum TErr400 {
   none = "none",
   param = "param",
   query = "query",
   bodyParam = "bodyparam",
   body = "body",
   other = "other",
}

export enum TErr500 {
   none = "none",
   db = "db",
   other = "other",
}

export enum TErr401 {
   none = "none",
   credentials = "credentials",
   token = "token",
   other = "other",
}
//#endregion

//#region Información ampliada de códigos HTTP
export const Error400: THTTPErrorInfo = {
   name: "RequestError",
   statuscode: 400,
   error: {
      none: { internalcode: 400000, getmsg: (s: string) => "" },
      param: {
         internalcode: 400010,
         getmsg: (s: string) => `No se ha entregado el parámetro ${s} en la URL de la petición.`,
      },
      query: {
         internalcode: 400020,
         getmsg: (s: string) => `No se ha entregado el parámetro ${s} en el query de la petición.`,
      },
      bodyparam: {
         internalcode: 400030,
         getmsg: (s: string) => `No se ha entregado el parámetro ${s} en el body del petición.`,
      },
      body: { internalcode: 400040, getmsg: (s: string) => "No se ha entregado el body de la petición" },
      other: { internalcode: 400999, getmsg: (s: string) => s },
   },
};

export const Error500: THTTPErrorInfo = {
   name: "ServerError",
   statuscode: 500,
   error: {
      none: { internalcode: 500000, getmsg: (s: string) => "" },
      other: { internalcode: 500999, getmsg: (s: string) => s },
   },
};

export const Error401: THTTPErrorInfo = {
   name: "Unauthorized",
   statuscode: 401,
   error: {
      none: { internalcode: 401000, getmsg: (s: string) => "" },
      credentials: { internalcode: 401010, getmsg: (s: string) => "Usuario o contraseña incorrectos" },
      token: { internalcode: 401020, getmsg: (s: string) => "Usuario no autenticado" },
      other: { internalcode: 401999, getmsg: (s: string) => s },
   },
};
//#endregion

/**
 * @param errorInfo Error HTTP a entregar
 * @param error Indica que información adicional se va a enviar al cliente
 * @param msg Mensaje adicional para agregar a la respuesta
 * @returns Error con la información para enviarla al cliente
 */
export function RstError(errorInfo: THTTPErrorInfo, error: TErr400 | TErr500 | TErr401, msg?: string): TErrorServer {
   let { internalcode, getmsg } = errorInfo.error[error];
   let response: TErrorServer = new TErrorServer(getmsg(msg));
   response.statusCode = errorInfo.statuscode;
   response.internalCode = internalcode;
   response.name = errorInfo.name;
   return response;
}
