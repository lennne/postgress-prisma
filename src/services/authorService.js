require('dotenv').config()

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function addAuthorService(name) {
    try{
        const newlyCreatedAuthor = await prisma.author.create({
            data: {
                name
            },
        })

        return newlyCreatedAuthor;
    }catch(error){
        console.error(error)
        throw error
    }
    
}

async function getAllAuthorsService(){
    try {
        const authors = await prisma.author.findMany({
            include : { books : true}
        })

        return authors
    } catch (error) {
        console.error(error);
        throw error
    }
}

async function getAuthorByIdService(id) {
    try {
        const author = await prisma.author.findUnique({
            where : {id}, 
            include : { author : true }
        })

        if(!author){
            throw new Error(`The author id: ${id} does not exists`)
        }

        return author;
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function updateAuthorByIdService(id, title) {
    try {
        const author = await prisma.author.findUnique({
            where : {id}, 
            include : { author : true }
        })

        if(!author){
            throw new Error(`The author with id: ${id} does not exist`)
        }
        const updatedAuthor = await prisma.author.update({
            where: {id},
            data : {
                title : title
            },
            include : { author : true}
        })

        return updatedAuthor;
    } catch (error) {
        console.error(error)
        throw error
    }
}

async function deleteAuthorByIdService(id) {
    try{
        const deletedBook = await prisma.author.delete({
            where : {id},
            include : { author : true}
        })

        return deletedBook;
    }catch(error){
        console.error(error)
        throw error
    }
}

module.exports = { addAuthorService, deleteAuthorByIdService, updateAuthorByIdService, getAuthorByIdService, getAllAuthorsService }