const express = require("express");
const User=require("../Models/user");
const Route = express.Router();

const emailExistence = require("email-existence");
const emailValidity = async (req, res, next) => {
  try {
    emailExistence.check(req.body.adresse, async (err, response) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send(
            "Une erreur de serveur s'est produite lors de la vérification de l'adresse e-mail."
          );
      }

      if (response) {
        next();
      } else {
        // L'adresse e-mail n'existe pas
        res.status(400).send("L'adresse e-mail incorrècte !!!");
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
const emailFound=async (req, res,next) => {
  const { nom, adresse, password } = req.body;
  try {
    const find = await User.findOne({ email: adresse });
    if (find) {
      res
        .status(400)
        .send(` ops ! ${adresse} a été déja utilisé par un autre utilisateur`);
    }
    else {
      next()
    }
  } catch (error) {
    console.log(error);
  }
};

const bcrypt = require("bcrypt");

Route.post('/register',emailValidity,emailFound,async(req,res)=>{

  const { nom, adresse, password } = req.body;
  try {
    
   const saltRounds = 10;
   const hashedPassword = await bcrypt.hash(password, saltRounds);

   const postUser = await User.create({
     name: nom,
     email: adresse,
     password: hashedPassword,
     token: "",
     role:'CLIENT'
   });
   res
     .status(200)
     .send({ message: `félicitation ${nom} vous ètes maintenant inscrit au notre site ` , user: postUser });
  } catch (error) {
    console.log(error);
  }
})

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secretCode = process.env.SECRET_KEY;
Route.post("/login",async(req,res)=>{
  try {
     const user = await User.findOne({ email: req.body.adresse });

     if (!user) {
       return res.status(400).send("adresse email invalid !");
     }
     const verif = await bcrypt.compare(req.body.password, user.password);
     if (verif) {
       jwt.sign(
         { email: user.email },
         secretCode,
         { expiresIn: "10m" },
         async (err, result) => {
           if (err) {
             res
               .status(400)
               .send("erreur serveur pendant la création de token! ");
           } else {
             const updateUser = user.set({ ...user, token: result });
             await updateUser.save();
             res
               .status(200)
               .send({
                 message: `login validé ${user.name} ! bienvenue au notre site`,
                 token: result,
               });
           }
         }
       );
     } else {
       res.status(400).send("mot de passe incorrécte !!");
     }
  } catch (error) {
    console.log(error);
  }
})


module.exports = Route; 
