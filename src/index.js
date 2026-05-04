//Modules:
const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require("./config/dbconection");
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");

dbConnect();

const app = express();

//Middlewares
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

//Error-Control

//Server 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
})

