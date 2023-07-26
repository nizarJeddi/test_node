const express = require("express");
const Route = express.Router();

const sendEmail = require("../email_send/mailer");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../Models/user");
const Product = require("../Models/product");
const Commande = require("../models/commande");


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


const genererContenuTableauHTML = (donnees,prix) => {
  let contenuHTML =
    '<table border="1" style="width: 100%; border-collapse: collapse; font-size: 16px;">';
  contenuHTML +=
    "<tr><th style='background-color: #f2f2f2; padding: 10px;'>Nom</th><th style='background-color: #f2f2f2; padding: 10px;'>Prix (dt)</th><th style='background-color: #f2f2f2; padding: 10px;'>Quantité</th></tr>";

  donnees.forEach((personne) => {
    contenuHTML += `<tr><td>${personne.nom}</td><td>${personne.price}</td><td>${personne.quantité}</td></tr>`;
  });
 contenuHTML +=
   '<tfoot><tr><td colspan="3" style="text-align: center; background-color: #f2f2f2; padding: 10px;">';
   contenuHTML += ` Montant total :${prix} dinars`;
     contenuHTML += "</td></tr></tfoot>";
  contenuHTML += "</table>";
  return contenuHTML;
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

   const mailOptions = {
     from: process.env.EMAIL_ADDRESS,
     to: req.client.email,
     subject: ` hello ${req.client.name} voilà votre Commande liste d'achats sur notre site (testing API)`,
     html: genererContenuTableauHTML(req.body.pannier,req.body.prix_total),
   };
    await sendEmail(mailOptions);
    const ajoutCommande = await Commande.create({
      client: { name: req.client.name,email:req.client.email },
      liste_achats:pannier
    });
   res.status(200).send(` hello ${req.client.name} ! félécitation achat effectué avec succés`)

  } catch (error) {
    console.log(error);
    //erreuur
  }


    //  res.status(200).send({user:req.client})
});

Route.get("/getCommandesAdmin",async(req,res)=>{
  try {
    const data = await Commande.find();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
  
})


module.exports = Route; 
