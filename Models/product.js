const mongoose = require("mongoose");
const schema = mongoose.Schema;
const productSchema = new schema(
  {
    name: {
      type: String,
      required: [true, "Le champ 'name' est obligatoire. Veuillez le saisir."],
    },
    description: {
      type: String,
      required: [
        true,
        "Le champ 'description' est obligatoire. Veuillez le saisir.",
      ],
    },
    quantity: {
      type: Number,
      required: [
        true,
        "Le champ 'quantity' est obligatoire. Veuillez le saisir.",
      ],
    },
    price: {
      type: Number,
      required: [true, "Le champ 'price' est obligatoire. Veuillez le saisir."],
    },
  },
  { timestamps: true, versionKey: false }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
