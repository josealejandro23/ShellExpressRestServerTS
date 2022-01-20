import { Schema, model } from "mongoose";

/* 
   {
      nombre : 'jaun',
      correo : 'adfasdf@sdff.com',
      password : 'asdfdsfas',
      img : 'http://asdfadsf.jpg',
      rol : 'admin',
      estado : true // indica si el usuario está activo o ha sido borrado de la db false
      google : ture // indica si el user se creo con google autenthication o normal
   }
*/


const UsuarioSchema = new Schema({
   nombre: {
      type: String,
      required: [true, "Indique un nombre de usuario"],
   },
   correo: {
      type: String,
      required: [true, "Indique un nombre correo"],
      unique: true,
   },
   password: {
      type: String,
      required: [true, "Indique una contraseña"],
   },
   img: {
      type: String,
   },
   rol: {
      type: String,
      required: [true, "Indique un rol"],
      // enum : ['ADMIN','USER']
   },
   estado: {
      type: Boolean,
      default: true,
   },
   google: {
      type: Boolean,
      default: false,
   },
});

//se sobreescribe la función toJSON para eliminar los objetos que no me interesa retornar
UsuarioSchema.methods.toJSON = function () {
   //se saca en dos variables __V y password y todo lo demás se empaqueta en usuario
   const {__v, password, _id, ...usuario} = this.toObject();
   //se cambia el nombre de _id por uid, se extrae la variable y se crea la nueva llave
   usuario.userid = _id;
   return usuario;
}

export default model("Usuario", UsuarioSchema);