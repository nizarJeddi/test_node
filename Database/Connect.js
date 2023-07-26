const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/test_node")
  .then(() => console.log("Connected au mongodb sur local!"));
