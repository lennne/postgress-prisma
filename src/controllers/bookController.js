const { addBookService, getAllBooksService, getBookByIdService, updateBookService, deleteBookService } = require("../services/bookService");


exports.addBookController = async (req, res) => {
    try {
        const { title, publishedDate, authorId } = req.body;
        const book = await addBookService(title, new Date(publishedDate), authorId)


        return res.status(201).json(book)
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}



exports.getAllBooksController = async (req, res) => {
    try {
        const books = await getAllBooksService()

        return res.status(201).json(books)
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}



exports.getBookByIdController = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const book = await getBookByIdService(id);
        
        return res.status(201).json({
            success: true,
            book
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}



exports.updateBookController = async (req, res) => {
    try {

        const {title, authorId} = req.body;
        console.log(title, authorId)
        const book = await updateBookService(authorId, title);

        return res.status(201).json({
            success: true,
            book
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}



exports.deleteBookController = async (req, res) => {
    try {
        const id = req.params.id;
        const book = await deleteBookService(parseInt(id));

        return res.status(201).json({
            success: true,
            book
        })
    } catch (error) {
        return res.status(400).json({
            error: error.message
        })
    }
}
