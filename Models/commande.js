const mongoose = require("mongoose");
const schema = mongoose.Schema;
const commandeSchema = new schema(
  {
    client: {
      name: { type: String },
      email: { type: String },
    },
    liste_achats: [],
  },
  { timestamps: true, versionKey: false }
);
const Commande = mongoose.model("Commande", commandeSchema);
module.exports = Commande;
