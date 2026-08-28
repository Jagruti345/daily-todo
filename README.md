# Daily Todo - MongoDB-Backed Time-Based Task App

A minimal, fast Next.js app for managing daily tasks with time scheduling, MongoDB persistence, and dark mode.

## **Quick Start**

### 1. Setup Environment
```bash
# Copy .env.example and add your MongoDB URI
cp .env.example .env.local

# Edit .env.local with your connection string:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/daily-todo"
```

### 2. Install & Run
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## **Features**
- ✅ Create, read, update, delete tasks (MongoDB-backed)
- ✅ Time-based scheduling (single time field)
- ✅ Priority levels (LOW, MEDIUM, HIGH)
- ✅ Task categories
- ✅ Mark tasks complete
- ✅ Dark mode support
- ✅ Deployment-ready

## **Database Schema (MongoDB)**
```javascript
{
	id: ObjectId,           // Auto-generated
	title: String,          // Task name (required)
	time: String,           // Time in HH:mm format
	priority: String,       // LOW | MEDIUM | HIGH
	category: String,       // Work, Study, Health, etc.
	completed: Boolean,     // Default: false
	createdAt: DateTime,    // Auto-generated
	updatedAt: DateTime     // Auto-updated
}
```

## **API Endpoints**
- `GET /api/todos` - Fetch all tasks
- `POST /api/todos` - Create task
- `PUT /api/todos/[id]` - Update task
- `DELETE /api/todos/[id]` - Delete task

## **Deployment (Vercel)**
```bash
# 1. Push to GitHub
git push

# 2. Connect on Vercel dashboard
# 3. Add environment variables (DATABASE_URL)
# 4. Deploy
```

## **Tech Stack**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Prisma + MongoDB
- Dark mode (CSS only)

## **Project Structure**
```
app/
	├─ page.tsx          # Entry point
	├─ api/todos/        # API routes
	└─ layout.tsx        # Root layout
components/
	├─ Dashboard.tsx     # Main orchestrator
	└─ TodoForm.tsx      # Create/edit form
lib/
	├─ prisma.ts         # Prisma client
	└─ data.ts           # Constants (categories, priorities)
types/
	└─ todo.ts           # TypeScript types
prisma/
	└─ schema.prisma     # Database schema
```

## **Form Fields (Compact)**
- **Title** (required) - Task name
- **Time** - Scheduled time (HH:mm)
- **Priority** - LOW / MEDIUM / HIGH
- **Category** - Select from predefined list

---

**Minimal. Fast. Production-ready.**
