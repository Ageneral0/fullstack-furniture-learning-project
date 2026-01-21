const express = require('express');
require("dotenv").config();
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware Setup
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
    secret: 'my-secret-key', // In production, this should be in .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30000 * 60,
        secure: false // Set to true in production with HTTPS
    }
}));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const mainRoutes = require('./routes/mainRoutes');

// Use Routes
app.use(authRoutes);
app.use(productRoutes);
app.use(mainRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
