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


