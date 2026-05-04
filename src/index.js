//Modules:
const express = require('express');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const dbConnect = require("./config/dbconection");
const path = require('path');

// API Routes
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");

// View Routes (For rendering EJS)
const viewRoutes = require("./routes/viewRoutes"); 

dbConnect();

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // For your CSS/JS files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// View Routes - This makes http://localhost:3001/login work
app.use("/", viewRoutes); 

// API Routes - These handle the logic (POST, DELETE, etc.)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

//Server 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});