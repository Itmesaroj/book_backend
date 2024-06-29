const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connection = mongoose.connect(process.env.MONGO_URI);

module.exports = connection;
