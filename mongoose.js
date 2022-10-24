let mongoose = require('mongoose');
const config = require(`${__dirname}/../config.json`);

mongoose.connect(config.mongoose);
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Connection error: ' + err.message);
});

db.once('open', function callback() {
    console.log('Connected to DB (' + config.mongoose + ')');
});

module.exports = mongoose;

