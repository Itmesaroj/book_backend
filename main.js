const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const bookrouter=require("./router/book.router")
const server = express();
const connection = require("./mongoDB/connection");

server.use(express.json());

app.use(cors({
    origin: true, 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  }));
const auth = require("./router/auth");
server.use("/user", auth);
server.use("/api",bookrouter);
server.get("/", (req, res) => {
    res.send("This is data");
});


server.listen(process.env.PORT || 3000, async () => {
    try {
        await connection;
        console.log("Database is successfully connected and server is running");
    } catch (err) {
        console.error(err);
        console.log("Some error occurred");
    }
});
