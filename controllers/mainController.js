const getHome = (req, res) => {
    res.render('home.ejs');
};

const getProfile = (req, res) => {
    res.render('profile.ejs');
};

const getPlaceholder = (req, res) => {
    const route = req.path;
    res.send(`<h1>${route.substring(1)} page - Not Implemented</h1>`);
};

module.exports = {
    getHome,
    getProfile,
    getPlaceholder
};
