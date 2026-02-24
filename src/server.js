require('dotenv').config()

const express = require('express');
const app = express();

const authorRoutes = require('./routes/authorRoutes')
const bookRoutes = require('./routes/bookRoutes')

const PORT = process.env.PORT || 3000;

app.use(express.json())

app.use('/api/author',authorRoutes)
app.use('/api/book',bookRoutes)

app.listen(PORT, () => {
    console.log(`Server is now runnnig on port ${PORT}`)
})