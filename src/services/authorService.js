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

module.exports = { addAuthorService }