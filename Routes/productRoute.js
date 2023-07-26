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

module.exports = Route; 