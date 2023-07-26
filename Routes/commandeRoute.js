const express = require("express");
const Route = express.Router();

const sendEmail = require("../email_send/mailer");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../Models/user");
const Product = require("../Models/product");
dotenv.config();

const secretCode = process.env.SECRET_KEY;

const authentification = async (req, res, next) => {
  const bearer = req.headers["authorization"];
  const tab = bearer.split(" ");
  const token = tab[1];

  jwt.verify(token, secretCode, async (err, data) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        res.status(401).send("session expirée, veuillez vous reconnecter.");
      } else {
        res.status(400).send("ops ! passez au login pour se connecter");
      }
    } else {
      const user = await User.findOne({ email: data.email });
      if (user) {
        req.client = user;
        next();
      }
      if (!user) {
        res.status(400).send("user non trouvé dans db");
      }
    }
  });
};

Route.post("/achatProduits", authentification,async(req,res)=>{

  try {
    const {pannier,prix_total}=req.body;

   pannier.map(async(el)=>{
    const find=await Product.findOne({name:el.nom});
    if (find) {
      find.set({ ...find, quantity: find.quantity -el.quantité});
      await find.save()
    }
   })
   res.status(200).send(` hello ${req.client.name} ! félécitation achat effectué avec succés`)

  } catch (error) {
    console.log(error);
  }


    //  res.status(200).send({user:req.client})
});



module.exports = Route; 
