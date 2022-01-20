import mongoose from "mongoose";

export const dbConnection = async ()=>{
   try {
      //se inicializa la conexión y se extrae la cadena de conexión a la base de datos
      await mongoose.connect(String(process.env.MONGODB));

      console.log('DB iniciada correctamente');
   } catch (e) {
      console.error('Error en la db',e);
      throw new Error("Error al inicializar la base de datos");
   }
}