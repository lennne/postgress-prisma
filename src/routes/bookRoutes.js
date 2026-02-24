const express = require('express')
const { addBookController, getAllBooksController, getBookByIdController, updateBookController, deleteBookController } = require('../controllers/bookController');

const router = express.Router()

router.post('/add-book', addBookController);
router.get('/', getAllBooksController);
router.get('/:id', getBookByIdController);
router.put('/:id', updateBookController);
router.delete('/:id', deleteBookController);

module.exports = router