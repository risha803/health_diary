/*
  Warnings:

  - The primary key for the `HealthEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `HealthEntry` table. All the data in the column will be lost.
  - The `id` column on the `HealthEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "HealthEntry" DROP CONSTRAINT "HealthEntry_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "headache" DROP NOT NULL,
ALTER COLUMN "symptoms" DROP NOT NULL,
ALTER COLUMN "symptoms" SET DATA TYPE TEXT,
ADD CONSTRAINT "HealthEntry_pkey" PRIMARY KEY ("id");
