/*
  Warnings:

  - Added the required column `EndTime` to the `CoachAvailability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `CoachAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoachAvailability" ADD COLUMN     "EndTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
