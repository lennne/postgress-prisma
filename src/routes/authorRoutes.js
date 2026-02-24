const express = require('express')
const { AddAuthorController, getAllAuthorsController, getAuthorByIdController, updateAuthorByIdController, deleteAuthorByIdController } = require('../controllers/authorController')
const router = express.Router()

router.post('/add-author', AddAuthorController);
router.get('/', getAllAuthorsController);
router.get('/:id', getAuthorByIdController);
router.put('/:id', updateAuthorByIdController);
router.delete('/:id', deleteAuthorByIdController);

module.exports = router