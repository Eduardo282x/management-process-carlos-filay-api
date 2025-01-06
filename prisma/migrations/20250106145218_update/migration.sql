/*
  Warnings:

  - The primary key for the `Activities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idActivity` on the `Activities` table. All the data in the column will be lost.
  - The primary key for the `MethodPayment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idMethodPayment` on the `MethodPayment` table. All the data in the column will be lost.
  - The primary key for the `Payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idPayment` on the `Payments` table. All the data in the column will be lost.
  - The primary key for the `Registration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `grade` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `idRegistration` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Students` table. All the data in the column will be lost.
  - The primary key for the `TypePayment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idTypePayment` on the `TypePayment` table. All the data in the column will be lost.
  - Added the required column `grade` to the `Activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countNumber` to the `MethodPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `MethodPayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MethodPayment" DROP CONSTRAINT "MethodPayment_typeId_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Students" DROP CONSTRAINT "Students_parentId_fkey";

-- AlterTable
ALTER TABLE "Activities" DROP CONSTRAINT "Activities_pkey",
DROP COLUMN "idActivity",
ADD COLUMN     "grade" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Activities_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MethodPayment" DROP CONSTRAINT "MethodPayment_pkey",
DROP COLUMN "idMethodPayment",
ADD COLUMN     "countNumber" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD CONSTRAINT "MethodPayment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_pkey",
DROP COLUMN "idPayment",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Payments_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_pkey",
DROP COLUMN "grade",
DROP COLUMN "idRegistration",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Registration_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Students" DROP COLUMN "parentId";

-- AlterTable
ALTER TABLE "TypePayment" DROP CONSTRAINT "TypePayment_pkey",
DROP COLUMN "idTypePayment",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "TypePayment_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "StudentParent" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "parentId" INTEGER NOT NULL,

    CONSTRAINT "StudentParent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentParent" ADD CONSTRAINT "StudentParent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentParent" ADD CONSTRAINT "StudentParent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MethodPayment" ADD CONSTRAINT "MethodPayment_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TypePayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "MethodPayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
