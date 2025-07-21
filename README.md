# Link Snippets

Save and tag useful links — a simple fullstack app built with modern tools.

This is a personal learning project built to explore Prisma, PostgreSQL, and a modern Next.js stack. It’s not intended for production use, but it explores good practices around project structure, tooling, and modern workflows.

---

## 🧱 Stack

- **Next.js** (App Router, TypeScript)
- **Prisma** (ORM)
- **PostgreSQL** (via Docker)
- **React + Tailwind CSS** (UI)
- **Jest + React Testing Library** (testing)
- **ESLint + Prettier + Husky** (tooling)

---

## 🚀 Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/jsanchezmarega/link-snippets.git
   cd link-snippets
   ```

2. **Start PostgreSQL with Docker**

   ```bash
   docker-compose up -d
   ```

3. **Set up environment variables**

   Create a `.env` file in the root:

   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=linksnippets
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/linksnippets
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Run Prisma migrations**

   ```bash
   docker-compose exec app npx prisma migrate dev --name init
   ```

6. **Start the app**

   ```bash
   npm run dev
   ```

   App will be running at [http://localhost:3000](http://localhost:3000)

---

## 🛠 Features

- Add a link with title, URL, and tags
- View list of saved links
- Code is structured for clarity and maintainability, with basic test coverage

---

## 📌 Notes

- This is mainly for personal learning, but I’m always open to feedback.
