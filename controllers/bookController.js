const Book = require('../module/booksModule')

const addBook = async (req, res) => {
    try {
        const { title, author, publishedYear, genre } = req.body;
        const newBook = await Book.create({
            title, author, publishedYear, genre, updatedBy: req.user._id,
        })
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const deleteBookById = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id)
        if (!book) return res.status(404).json({ message: 'Book not found' })
        res.json({ message: 'Book deleted successfully' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('updateBy', 'name email')
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateBook = async (req, res) => {
    try {
        const updates = { ...req.body, updatedBy: req.user._id };
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        )
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' })
        res.json(updateBook)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
module.exports = {
    addBook,
    deleteBookById,
    getAllBooks,
    updateBook,
}