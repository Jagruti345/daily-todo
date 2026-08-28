# Daily Todo

Daily Todo is a modern, high-performance daily task management web application built with **Next.js 16 (App Router)**, **React 19**, **Prisma**, **MongoDB**, and **Tailwind CSS**.

It provides real-time task scheduling, category filtering, search, interactive completion progress tracking, and user authentication with secure password hashing and JWT sessions.

---

## Key Features

- 🔐 **User Authentication**: Sign in & Sign up with password hashing (`bcryptjs`) and secure HttpOnly JWT session cookies (`jose`).
- 📁 **User Isolation**: All tasks are strictly scoped to the authenticated user ID (`userId`).
- 📅 **Date & Time Scheduling**: Navigate between days or filter tasks by date.
- 🏷️ **Categories & Priority**: Group tasks by category (`Work`, `Study`, `Health`, `Personal`, `Exercise`, `Coding`) and priority (`LOW`, `MEDIUM`, `HIGH`).
- 🔍 **Live Search & Filters**: Instantly search tasks by title or filter by category pills.
- 📊 **Progress Bar Banner**: Real-time completion statistics and visual progress bar.
- 🎨 **Ultra-Modern UI**: Clean glassmorphism styling, responsive layout, dark theme accents, and modal dialogs.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **ORM**: [Prisma v6](https://www.prisma.io/)
- **Security**: `bcryptjs` (password hashing) + `jose` (JWT cookies)

---

## Getting Started

### 1. Clone the repository & install dependencies

```bash
git clone https://github.com/Jagruti345/daily-todo.git
cd daily-todo
npm install
```

### 2. Environment Setup

Create a `.env` or `.env.local` file in the root directory:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/daily-todo?retryWrites=true&w=majority"
SESSION_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
```

### 3. Database Push & Prisma Generation

Generate the Prisma client and sync schema with MongoDB:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Login, signup, logout, and auth state routes
│   │   └── todos/         # Protected CRUD API routes for todos
│   ├── login/             # Dedicated login page
│   ├── globals.css        # Glassmorphism and theme styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page entry point
├── components/
│   ├── AuthForm.tsx       # Auth card component with logo badge
│   ├── Dashboard.tsx      # Main dashboard with stats, search & category filters
│   └── TodoForm.tsx       # Task creation & edit modal form
├── lib/
│   ├── auth.ts            # Password hashing, JWT signing, & cookie helpers
│   ├── data.ts            # Category and priority constants
│   └── prisma.ts          # Prisma Client singleton
├── prisma/
│   └── schema.prisma      # Prisma schema for User & Todo models
└── types/
    ├── auth.ts            # Auth user & JWT interfaces
    └── todo.ts            # Todo TypeScript interfaces
```

---

## API Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Log in user & issue JWT cookie | ❌ |
| `POST` | `/api/auth/logout` | Clear session cookie | ❌ |
| `GET` | `/api/auth/me` | Get current user profile | ❌ |
| `GET` | `/api/todos` | Fetch user's tasks | ✅ |
| `POST` | `/api/todos` | Create a new task | ✅ |
| `GET` | `/api/todos/[id]` | Fetch single task | ✅ |
| `PUT` | `/api/todos/[id]` | Update task completion/details | ✅ |
| `DELETE` | `/api/todos/[id]` | Delete task | ✅ |

---

## License

This project is open source and available under the [MIT License](LICENSE).
