const pool = require('../pool');
const bcrypt = require('bcrypt');

const getLogin = (req, res) => {
    res.render('login.ejs');
};

const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    try {
        const result = await pool.query(sql, values);
        const user = result.rows[0];

        if (!user) {
            console.log("User not found");
            return res.redirect('/register');
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
            console.log("Login successful");
            req.session.user = user;
            res.redirect('/');
        } else {
            console.log("Login failed");
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
};

const getRegister = (req, res) => {
    res.render('register.ejs');
};

const postRegister = async (req, res) => {
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (email, password_hash) VALUES ($1, $2)";
        const values = [req.body.email, hashedPassword];
        await pool.query(sql, values);
        res.redirect('/login');
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).send("/register");
        }
        res.redirect('/register');
    }
};

module.exports = {
    getLogin,
    postLogin,
    getRegister,
    postRegister
};
