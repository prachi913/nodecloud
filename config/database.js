const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.MONGO_DB_URI);

module.exports = {connect}