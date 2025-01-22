import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentDate = new Date();
  
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);
  tomorrow.setHours(11, 0, 0, 0);

  const dayAfterTomorrow = new Date(currentDate);
  dayAfterTomorrow.setDate(currentDate.getDate() + 2);
  dayAfterTomorrow.setHours(11, 0, 0, 0);

  const coaches = await prisma.user.createMany({
    data: [
      { name: 'Alice', phoneNumber: '1234567890', email: 'alice@example.com', type: 'COACH' },
      { name: 'Bob', phoneNumber: '1234567891', email: 'bob@example.com', type: 'COACH' },
    ],
  });

  const students = await prisma.user.createMany({
    data: [
      { name: 'Charlie', phoneNumber: '1234567892', email: 'charlie@example.com', type: 'STUDENT' },
      { name: 'David', phoneNumber: '1234567893', email: 'david@example.com', type: 'STUDENT' },
    ],
  });

  const alice = await prisma.user.findUnique({ where: { email: 'alice@example.com' } });
  const bob = await prisma.user.findUnique({ where: { email: 'bob@example.com' } });

  if (!alice || !bob) {
    throw new Error('Coaches were not created successfully.');
  }

  await prisma.coachAvailability.createMany({
    data: [
      {
        coachId: alice.id,
        startTime: tomorrow,
        EndTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
      },
      {
        coachId: alice.id,
        startTime: dayAfterTomorrow,
        EndTime: new Date(dayAfterTomorrow.getTime() + 2 * 60 * 60 * 1000),
      },
      {
        coachId: bob.id,
        startTime: tomorrow,
        EndTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
      },
      {
        coachId: bob.id,
        startTime: dayAfterTomorrow,
        EndTime: new Date(dayAfterTomorrow.getTime() + 2 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('Database has been seeded')
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
