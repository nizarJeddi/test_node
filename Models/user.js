const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new schema(
  {
    name: {
      type: String,
      required: [true, "Le champ 'name' est obligatoire. Veuillez le saisir."],
    },
    email: {
      type: String,
      required: [true, "Le champ 'email' est obligatoire. Veuillez le saisir."],
    },
    password: {
      type: String,
      required: [
        true,
        "Le champ 'password' est obligatoire. Veuillez le saisir.",
      ],
    },
    role: {
      type: String,
      default: "CLIENT"
    },
    token:{
      type:String,
      default:''
    }
  },
  { timestamps: true, versionKey: false }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
