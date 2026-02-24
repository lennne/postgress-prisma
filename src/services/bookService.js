require('dotenv').config()

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

//get all books
async function getAllBooksService(){
    try {
        const books = await prisma.book.findMany({
            include : { author : true } //also include the author information
        });

        return books
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getBookByIdService(id){
    try {
        const book = await prisma.book.findUnique({
            where : {id},
            include : { author: true }
        })

        if(!book){
            throw new Error(`Book with id ${id} not found`)
        }

        return book
    } catch (error) {
        console.error(error)
        throw error
    }
}

//update a record 
async function updateBookService(id, title){
    try {

        //  const book = await prisma.book.findUnique({
        //     where : {id},
        // })

        // if(!book){
        //     throw new Error(`Book with id ${id} not found`)
        // }
        // const updatedBook = await prisma.book.update({
        //     where: {id},
        // data : {
        //     title : title
        // },
        // include : { author : true}
        // })

        //using transactions
        const updatedBookTransactions = prisma.$transaction(async (prisma) => {
            //check if book with id exists
            const book = await prisma.book.findUnique({
                where: {id}
            })

            if(!book){
                throw new Error(`Book with id: ${id} is not present`)
            }

            return prisma.book.update({
                where: {id},
                data : {
                    title : title 
                }, 
                include : {
                    author : true
                }
            });
        });
        return updatedBookTransactions
    } catch (error) {
        throw error
    }
}

//delete a record
async function deleteBookService(id){
    try {
        const deletedBook = await prisma.book.delete({
            where : {id},
            include : { author: true },
        });

        //when you delete author it should delete the corresponding books (CASCADE METHOD)
        return deletedBook
    } catch (error) {
        throw error
    }
}

module.exports = { addBookService, addBookService, getAllBooksService, updateBookService, getBookByIdService, deleteBookService}