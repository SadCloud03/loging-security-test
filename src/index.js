//Modules:
const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require("./config/dbconection");
const authRoutes = require("./routes/authRoutes"); 

dbConnect();

const app = express();

//Middlewares
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes)

//Error-Control

//Server 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
})

