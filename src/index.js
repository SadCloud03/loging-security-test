//Modules:
const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require("./config/dbconection");

dbConnect();

const app = express();

//Middlewares
app.use(express.json());

//Routes

//Error-Control

//Server 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
})

