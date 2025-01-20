import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const coachId = url.searchParams.get('coachId'); 

  try {
    const whereCondition = coachId
    ? { coachId: Number(coachId) } 
    : {}; 

    const coachAvailabilities = await prisma.coachAvailability.findMany({where: whereCondition});
    console.log(coachAvailabilities)
    return NextResponse.json(coachAvailabilities); // Return data as JSON
  } catch (error) {
    console.error('Error fetching coach availability:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
