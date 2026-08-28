import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateTodoInput } from "@/types/todo";
import { NextRequest, NextResponse } from "next/server";

// GET user's todos
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// POST create new todo for authenticated user
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. You must be logged in to add tasks." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CreateTodoInput;

    if (!body.title || !body.date || !body.time || !body.priority || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title: body.title,
        date: body.date,
        time: body.time,
        priority: body.priority,
        category: body.category,
        completed: false,
        userId: user.id,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("POST /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
