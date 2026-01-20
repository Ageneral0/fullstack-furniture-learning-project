const express = require('express');
require("dotenv").config();
const pool = require('./pool');


const app = express();
const session = require('express-session');
const port = process.env.PORT || 3001;
const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30000 * 60,
        secure: false
    }
}));



//MIDDLEWARE
function checkAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }
    next();
}



//LOGIN
app.get('/login', (req, res) => {
    res.render('login.ejs');

});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await pool.query(sql, values);
    const user = result.rows[0];

    if (!user) {
        console.log("User not found");
        return res.redirect('/register');
    }
    bcrypt.compare(password, user.password_hash, (err, result) => {
        if (result) {
            console.log("Login successful");
            req.session.user = user;
            res.redirect('/');
        } else {
            console.log("Login failed");
            res.redirect('/login');
        }
    });
});


//REGISTRATION
app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (email, password_hash) VALUES ($1, $2)";
        const values = [req.body.email, hashedPassword];
        await pool.query(sql, values);
        res.redirect('/login');
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).send("/register")
        }
        res.redirect('/register');
    }
});

// Product routes
app.get('/products', (req, res) => {
    // Ideally query DB here, for now render the same page which has the grid
    res.render('Web_Furniture.ejs');
});

//SEARCH
app.get('/search', checkAuth, async (req, res) => {
    try {
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;
        const totalProductsResult = await pool.query("SELECT COUNT(*) FROM products WHERE name ILIKE $1", [`%${query}%`]);
        const totalProducts = await totalProductsResult.rows[0].count;
        const totalPages = await Math.ceil(totalProducts / limit);
        const sql = "SELECT * FROM products WHERE name ILIKE $1 OFFSET $2 LIMIT $3";
        const values = [`%${query}%`, offset, limit];
        const result = await pool.query(sql, values);
        const products = result.rows;
        res.render('search.ejs', { products, page, totalPages, query });

    } catch (err) {
        console.log(err);
    }

});

//filter

app.get('/filter', checkAuth, async (req, res) => {
    const category = 1;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const totalProductsResult = await pool.query("SELECT COUNT(*) FROM products WHERE category = $1");
    const totalProducts = await totalProductsResult.rows[0].count;
    const totalPages = await Math.ceil(totalProducts / limit);
    const sql = "SELECT * FROM products WHERE category_id = $1 OFFSET $2 LIMIT $3";
    const values = [category, offset, limit];
    const result = await pool.query(sql, values);
    const products = result.rows;
    console.log(products);
    res.render('filter.ejs', { products, page, totalPages });
})

// HOME PAGE
app.get('/', checkAuth, (req, res) => {
    res.render('home.ejs');
});

//SHOP
app.get('/shop', checkAuth, (req, res) => {
    res.render('Web_Furniture.ejs');
});

// Product Indepth Page
app.get('/product-indepth', checkAuth, (req, res) => {
    res.render('product_indepth_info.ejs');
});

// Placeholder routes
const placeholders = ['/pages', '/work', '/blog', '/features'];
placeholders.forEach(route => {
    app.get(route, checkAuth, (req, res) => {
        res.send(`<h1>${route.substring(1)} page - Not Implemented</h1>`);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


