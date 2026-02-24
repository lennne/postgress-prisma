# Postgres-Prisma Concept Project

This project is a dedicated deep-dive into **Modern Relational Database Management** using **PostgreSQL** and **Prisma ORM**. It transitions from raw SQL query patterns to a type-safe, schema-driven architecture, focusing on the core principles of data integrity, relational modeling, and atomic transactions.



## Project Architecture

The project follows a clean **Controller-Service-Repository** pattern to decouple business logic from database operations, ensuring the code remains testable and scalable.

* **Controllers:** Handle HTTP request/response logic and input parsing.
* **Services:** Contain the core business logic and orchestrate database interactions.
* **Prisma Layer:** Manages the schema definition, migrations, and type-safe query generation.
* **Postgres Pool:** Utilizes a custom `@prisma/adapter-pg` to provide high-performance connection pooling.

---

## 🛠️ Key Technical Features

### 1. Relational Modeling (1:N Relationship)

The system implements a classic **One-to-Many** relationship between `Author` and `Book`.

* **Cascading Deletes:** Configured at the schema level (`onDelete: Cascade`), ensuring that deleting an author automatically cleans up all associated books in the database.
* **Relational Queries:** Utilizes Prisma’s `include` and `connect` features to perform eager loading and relational writes in single operations.

### 2. Atomic Interactive Transactions

To ensure data consistency, the project utilizes `prisma.$transaction`. This prevents "partial updates" where a check might pass but the subsequent write fails, maintaining the **ACID** properties of the database.

### 3. Connection Pooling & Performance

Rather than relying on Prisma's default engine for connections, this project integrates the `pg` native driver with an **Adapter**. This allows for:

* Efficient reuse of database connections.
* Lower latency for high-concurrency requests.
* Better control over idle connection timeouts.

---

## Project Structure

```text
postgress-prisma/
├── prisma/
│   ├── schema.prisma        # Single source of truth for DB models
│   └── migrations/          # Version-controlled SQL migration history
├── src/
│   ├── controllers/         # Express request handlers
│   ├── services/            # Business logic & Prisma queries
│   ├── routes/              # API endpoint definitions
│   └── server.js            # Express application entry point
└── prisma.config.js         # Centralized Prisma environment configuration

```



## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install

```

### 2. Environment Setup

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/prisma-concepts"
PORT=3000

```

### 3. Run Migrations

Generate your database tables based on the Prisma schema:

```bash
npx prisma migrate dev --name init

```

### 4. Start the Server

```bash
npm start

```

---

##  API Endpoints Summary

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/author/add-author` | `POST` | Create a new author |
| `/api/author/` | `GET` | Fetch all authors with their books |
| `/api/author/:id` | `GET` | Get specific author details |
| `/api/book/` | `POST` | Add a book linked to an author |
| `/api/book/:id` | `PUT` | Update book title via Transaction |
| `/api/author/:id` | `DELETE` | Delete author (Cascades to Books) |

**Would you like me to add a section on how to use "Prisma Studio" to visualize this data in your browser?**


### How to "Clean Up"

1. Delete tables from `template1`, 
you should be able to get a clean run. Just to be safe, follow this final sequence:

1. **Check Template1 one last time:** Make sure `template1` has **zero** user tables. It should be a pristine, empty vessel.

2. **Drop your target DB:** dropdb prisma-with-postgress

3. **Delete your migrations folder:**
```bash
rm -rf prisma/migrations

```

4. **Run the Init:**
```bash
npx prisma migrate dev --name init

```