const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

//création d'une instance de mon aplication express
const app = express();



/** data base connection */
require("./Database/Connect")


/** express config */
const dotenv = require("dotenv");
dotenv.config();
 app.use(cors());
app.use(morgan("tiny"));

app.use(express.json());
 
app.use(bodyParser.json());


/**initialise route */
const productRoute = require("./Routes/productRoute")

app.use('/api' , productRoute)

const userRoute = require("./Routes/userRoute");
app.use("/api", userRoute);

const commandeRoute=require("./Routes/commandeRoute");
app.use("/api",commandeRoute)




/** application listening port  */
app.listen(process.env.port||4000,function () {
  console.log("l'application test Node.js a été montée avec succés dans le serveur localhost ayant le port 4000");
})