import { Schema, model } from "mongoose";

const rolSchema = new Schema({
   rol: {
      type: "string",
      required: [true, "el rol es obligatorio"],
   },
});

export default model("Role", rolSchema);
