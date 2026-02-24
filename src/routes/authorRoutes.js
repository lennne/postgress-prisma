const express = require('express')
const { AddAuthController } = require('../controllers/authorController')
const router = express.Router()

router.post('/add-author', AddAuthController);

module.exports = router