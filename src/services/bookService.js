const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//add a record
async function addBookService(title, publishedDate, authorId) {
    try{
        const newlyCreatedBook = await prisma.book.create({
            data : {
                title,
                publishedDate,
                author : {
                    connect : {id : authorId}
                }
            }, include : { author : true } // whenever a new book is created based on the author Id set above, 
                                            // it's going to pick the author object and return the author response
        })
        
        return newlyCreatedBook;
    }catch(error){
        console.log(error);
        throw error
    }
}


//update a record 

//delete a record


module.exports = { addBookService}