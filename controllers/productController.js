const pool = require('../pool');

const getProducts = (req, res) => {
    res.render('Web_Furniture.ejs');
};

const getSearch = async (req, res) => {
    try {
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;

        if (!query) return res.redirect('/products');

        const totalProductsResult = await pool.query("SELECT COUNT(*) FROM products WHERE name ILIKE $1", [`%${query}%`]);
        const totalProducts = parseInt(totalProductsResult.rows[0].count);
        const totalPages = Math.ceil(totalProducts / limit);

        const sql = "SELECT * FROM products WHERE name ILIKE $1 OFFSET $2 LIMIT $3";
        const values = [`%${query}%`, offset, limit];
        const result = await pool.query(sql, values);
        const products = result.rows;

        res.render('search.ejs', { products, page, totalPages, query });

    } catch (err) {
        console.log(err);
        res.redirect('/products');
    }
};

const getFilter = async (req, res) => {
    try {
        const category = 1;
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;

        const totalProductsResult = await pool.query("SELECT COUNT(*) FROM products WHERE category = $1", [category]);
        const totalProducts = parseInt(totalProductsResult.rows[0].count);
        const totalPages = Math.ceil(totalProducts / limit);

        const sql = "SELECT * FROM products WHERE category_id = $1 OFFSET $2 LIMIT $3";
        const values = [category, offset, limit];
        const result = await pool.query(sql, values);
        const products = result.rows;
        console.log(products);
        res.render('filter.ejs', { products, page, totalPages });
    } catch (err) {
        console.error(err);
        res.redirect('/products');
    }
};

const getShop = async (req, res) => {
    res.render('Web_Furniture.ejs');

};

const getProductIndepth = (req, res) => {
    res.render('product_indepth_info.ejs');
};

module.exports = {
    getProducts,
    getSearch,
    getFilter,
    getShop,
    getProductIndepth
};





//DEBUGING

async function gettProducts() {
    const products = await pool.query("SELECT * FROM products");
    console.log(products);
}

gettProducts();


