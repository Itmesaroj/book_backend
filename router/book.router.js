const express = require("express");
const BookModel = require("../model/books.module");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

// Create a new book
router.post("/create", auth, async (req, res) => {
    const { title, author, createdAt } = req.body;
    const { role, user_id } = req.user;

    console.log(req.body);
    try {
        if (!role.includes('CREATOR')) {
            return res.status(403).json({ "message": "You are not eligible to add books" });
        }

        const data = new BookModel({ title, author, user_id, createdAt });
        await data.save();
        res.status(201).json({ "message": "Data is added successfully" });
    } catch (err) {
        res.status(500).json({ "message": "An error occurred", "error": err.message });
    }
});

// View books by user ID
router.get("/:user_id", auth, async (req, res) => {
    const { user_id } = req.params;
    const { role, user_id: tokenUserId } = req.user;

    console.log(user_id);
    try {
        if (!role.includes("VIEWER") && user_id !== tokenUserId.toString()) {
            return res.status(403).json({ "message": "You are not eligible to view the books" });
        }

        const books = await BookModel.find({ user_id });
        res.status(200).json({ "books": books });
    } catch (err) {
        res.status(500).json({ "message": "An error occurred", "error": err.message });
    }
});

// Delete a book by ID
router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { role } = req.user;

    if (!role.includes('CREATOR')) {
        return res.status(402).json({ "message": "You are not eligible to delete books" });
    }
    try {
        await BookModel.findByIdAndDelete(id);
        res.status(200).json({ "message": "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ "message": "An error occurred", "error": err.message });
    }
});

router.patch("/:id", auth, async (req, res) => {
    const { title, author, createdAt } = req.body;
    const { id } = req.params;
    const { role } = req.user;

    console.log(id);
    console.log(req.body);
    if (!role.includes('CREATOR')) {
        return res.status(402).json({ "message": "You are not eligible to update books" });
    }
    try {
        const updatedBook = await BookModel.findByIdAndUpdate(id, { title, author, createdAt });
        res.status(200).json({ "message": "Book updated successfully", "book": updatedBook });
    } catch (err) {
        res.status(500).json({ "message": "An error occurred", "error": err.message });
    }
});

router.get("/",auth,async(req,res)=>{
    const {role}=req.user;

    try{
        if(!role.includes("VIEW_ALL")){
            return res.status(402).json({ "message": "You are not eligible to view all books" });
        }
        const data=await BookModel.find();
        res.status(200).json({"data":data})
    }catch(err){
        res.status(500).json({ "message": "An error occurred", "error": err.message });
    }
})


router.get("/books", auth, async (req, res) => {
    const { role } = req.user;
    const { old, new: newBooks } = req.query;

  
    try {
        let books;
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        if (old === '1' ) {
            books = await BookModel.find({ createdAt: { $lt: tenMinutesAgo } });
        } else if (newBooks === '1') {
            books = await BookModel.find({ createdAt: { $gte: tenMinutesAgo } });
        } else if (role.includes("VIEW_ALL")) {
            books = await BookModel.find({});
        } else {
            return res.status(403).json({ "message": "You are not eligible to view all books" });
        }

        res.status(200).json({ "books": books });
    } catch (err) {
        res.status(500).json({ "message": "An error occurred", "error": err.message });
    }
});

module.exports = router;
