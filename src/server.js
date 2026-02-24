require('dotenv').config()

const express = require('express');
const app = express();

const authorRoutes = require('./routes/authorRoutes')

const PORT = process.env.PORT || 3000;

app.use(express.json())

app.use('/api/author',authorRoutes)

app.listen(PORT, () => {
    console.log(`Server is now runnnig on port ${PORT}`)
})