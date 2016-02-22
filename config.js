var config = {};

config.db = {};
// the URL shortening host - shortened URLs will be this + base58 ID
// i.e.: http://localhost:3000/3Ys
config.webhost = 'http://localhost:3000/';

// your MongoDB host and database name
config.db.host = 'rgrjs_user:2totoo22@ds013738.mongolab.com:13738';
config.db.name = 'rgrjs';

module.exports = config;
