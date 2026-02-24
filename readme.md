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

## 🛠 Docker Configuration

This project uses **Docker Compose** to orchestrate the application and the database. Below is an explanation of the volume mapping used in the `docker-compose.yml`:

### Volume Mapping Breakdown

| Service | Mapping | Type | Purpose |
| --- | --- | --- | --- |
| **App** | `.:/usr/src/app` | **Bind Mount** | Synchronizes source code for hot-reloading. |
| **App** | `/usr/src/app/node_modules` | **Anonymous Volume** | **Hides** the Mac node_modules so Linux ones can work. |
| **Database** | `postgres_data:/var/lib/postgresql/data` | **Named Volume** | Persists database records across container restarts. |

---

### 1. Application Volume (`.:/usr/src/app`)

This creates a two-way link between your local project folder and the container's working directory.

* **Development Workflow:** Any changes you make to your files (e.g., `schema.prisma`, `src/index.ts`) in VS Code are instantly reflected inside the container.
* **Efficiency:** You do not need to rebuild the Docker image every time you save a file; the container simply "sees" the new code.

### 2. Database Volume (`postgres_data:/var/lib/postgresql/data`)

This is a managed volume used to store the physical PostgreSQL data files.

* **Data Persistence:** Containers are ephemeral. Without this volume, deleting the container would delete your entire database (including your `Book` table and migration history).
* **Safety:** By using a **Named Volume** (`postgres_data`), Docker stores the data in a dedicated, optimized area of your hard drive. Even if you run `docker-compose down`, your data remains safe in the volume.

### 3. The "Hole" in the Sync (`/usr/src/app/node_modules`)  

That specific line—`/usr/src/app/node_modules`—is what we call an **Anonymous Volume**.

When you see a volume path in a Docker Compose file that doesn't have a colon (`:`) or a source folder, you are essentially telling Docker: **"Don't let the Mac sync anything into this specific folder."**

You might be wondering: *"If I'm already syncing my whole project with `.:/usr/src/app`, why do I need this extra line for node_modules?"*

It solves a major conflict between **Mac** and **Linux** (which Docker runs on):

1. **The Conflict:** Your Mac creates `node_modules` for macOS. Docker needs `node_modules` for Linux. If you sync them, your app will likely crash because the compiled binaries (like Prisma's engine) are different for Mac and Linux.
2. **The "Hole" in the Sync:** By adding `/usr/src/app/node_modules` without a mapping, you are telling Docker to "cut a hole" in your sync. Docker will use its own internal Linux version of `node_modules` and ignore whatever is in the `node_modules` folder on your MacBook.

This is an **Anonymous Volume**. Unlike the other mappings, it has no source directory.

* **Purpose:** It prevents your MacBook's `node_modules` from overwriting the container's `node_modules`.
* **The Problem it Solves:** Some packages (like **Prisma** and **Bcrypt**) compile differently for Mac and Linux. If you sync your Mac's `node_modules` into the Linux container, the app will crash due to "Incompatible Binary" errors.
* **The Solution:** This volume tells Docker to keep its own internal, Linux-compatible version of `node_modules` separate from your local files.
