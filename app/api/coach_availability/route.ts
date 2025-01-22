import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const coachId = url.searchParams.get("coachId");

  try {
    const whereCondition = coachId ? { coachId: Number(coachId) } : {};

    const coachAvailabilities = await prisma.coachAvailability.findMany({
      where: whereCondition,
    });
    return NextResponse.json(coachAvailabilities); // Return data as JSON
  } catch (error) {
    console.error("Error fetching coach availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { startTime, EndTime, coachId } = await request.json();

  try {
    const newAvailability = await prisma.coachAvailability.create({
      data: {
        startTime: new Date(startTime),
        EndTime: new Date(EndTime),
        coachId: Number(coachId),
      },
    });

    return NextResponse.json(newAvailability, { status: 201 });
  } catch (error) {
    console.error("Error creating coach availability:", error);
    return NextResponse.json(
      { error: "Failed to create availability" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { id, startTime, EndTime, coachId } = await request.json();

  try {
    const updatedAvailability = await prisma.coachAvailability.update({
      where: {
        id: Number(id), // Specify the unique identifier (e.g., id)
      },
      data: {
        startTime: new Date(startTime),
        EndTime: new Date(EndTime),
        coachId: Number(coachId),
      },
    });

    return NextResponse.json(updatedAvailability, { status: 201 });
  } catch (error) {
    console.error("Error creating coach availability:", error);
    return NextResponse.json(
      { error: "Failed to create availability" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const deletedAvailability = await prisma.coachAvailability.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(deletedAvailability, { status: 200 });
  } catch (error) {
    console.error("Error deleting coach availability:", error);
    return NextResponse.json(
      { error: "Failed to delete availability" },
      { status: 500 }
    );
  }
}
