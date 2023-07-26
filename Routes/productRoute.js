const express = require("express");
const Product = require("../Models/product");
const Route = express.Router();

Route.post("/addproduct",async(req,res)=>{
  const {name,detail,quantité,prix}=req.body
  try {
    const find= await Product.findOne({name:name});
    if (find) {
      res.status(400).send(`ops le nom de produit : "${name}" existe dans votre base des données ! `)
    }
    else {
      const ajout =await Product.create({name:name,description:detail,quantity:quantité,price:prix});
      res.status(200).send({message:` le produit : "${name}" a été ajouté avec succés dans la base des données `,produit:ajout})
    }
  } catch (error) {
    console.log(error);
  }
})
Route.put("/addQuantity/:id",async(req,res)=>{
  try {
    const {quantité}=req.body;
    const {id}=req.params
    const product=await Product.findById(id);
    if (!product) {
      res.status(400).send("produit non trouvé ;vérifiez l'id de produit");
    };
     product.set({ ...product, quantity:quantité });
     const modifiedProduct=await product.save();
     res.status(200).send({message:`quantité de produit : ${product.name} a été mise à jour avec succés`,produit_Modifié:modifiedProduct})

  } catch (error) {
    console.log(error);
  }
})

module.exports = Route; 