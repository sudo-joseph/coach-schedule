This is a toy project that was meant to build a coach<>student scheduling tool. The goal was to build an app that could satisfy the following user stores: 

* Coaches can add slots of availability to their calendars. These slots are always 2 hours long and each slot can be booked by exactly 1 student.

* Coaches can view their own upcoming slots.

* Students can book upcoming, available slots for any coach.

* When a slot is booked, both the student and coach can view each other’s phone-number.

* After they complete a call with a student, coaches will record the student’s satisfaction (an integer 1-5) and write some free-form notes.

* Coaches should be able to review their past scores and notes for all of their calls.*

At the moment, only the first story is implemented, I may revisit this in the future. 

## Getting Started

This guide will walk you through the steps to get the project up and running locally, assuming the initial setup has already been done.

## Step 1: Clone the Repository

Clone the project repository to your local machine:

```bash
git clone git@github.com:sudo-joseph/coach-schedule.git
cd coach-schedule
```

## Step 2: Install Dependencies

Install the project dependencies:

```bash
npm install
```

## Step 3: Set Up Environment Variables

Make sure you have a `.env` file in the root of the project. If not, create one by copying from `.env.example`:

```bash
cp .env.example .env
```

## Step 4: Run Prisma Migrations

Since Prisma migrations are already set up, you need to run them to ensure your local database is up-to-date.

Run the following command to apply migrations:

```bash
npx prisma migrate dev
```

Generate the prisma client: 
```bash
npx prisma generate
```

Seed the database: 
```bash
npx prisma db seed
```

## Step 5: Start the Application

Run the development server with:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Step 7: Working with Prisma

If you need to make changes to the database schema, follow these steps:

1. Modify the `prisma/schema.prisma` file to define new models or update existing ones.
2. Generate a new migration to reflect those changes:

    ```bash
    npx prisma migrate dev --name your-migration-name
    ```

3. Apply the migration and regenerate Prisma Client:

    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```


