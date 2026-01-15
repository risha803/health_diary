-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "height" INTEGER,
    "weight" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthEntry" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "feeling" INTEGER NOT NULL,
    "temperature" DOUBLE PRECISION,
    "pressureSystolic" INTEGER,
    "pressureDiastolic" INTEGER,
    "pulse" INTEGER,
    "headache" BOOLEAN NOT NULL,
    "symptoms" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HealthEntry" ADD CONSTRAINT "HealthEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
