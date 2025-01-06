-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "identify" TEXT NOT NULL,
    "rolId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Students" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "identify" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "parentId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grades" (
    "id" SERIAL NOT NULL,
    "grade" TEXT NOT NULL,

    CONSTRAINT "Grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subjects" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "Subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activities" (
    "idActivity" SERIAL NOT NULL,
    "activity" TEXT NOT NULL,
    "dateActivity" TIMESTAMP(3) NOT NULL,
    "studentId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("idActivity")
);

-- CreateTable
CREATE TABLE "Parents" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "identify" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "idRegistration" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "period" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "gradesId" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("idRegistration")
);

-- CreateTable
CREATE TABLE "Payments" (
    "idPayment" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "datePay" TIMESTAMP(3) NOT NULL,
    "namePayer" TEXT NOT NULL,
    "lastNamePayer" TEXT NOT NULL,
    "identifyPayer" TEXT NOT NULL,
    "phonePayer" TEXT NOT NULL,
    "paymentMethodId" INTEGER NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("idPayment")
);

-- CreateTable
CREATE TABLE "MethodPayment" (
    "idMethodPayment" SERIAL NOT NULL,
    "typeId" INTEGER NOT NULL,
    "bank" TEXT NOT NULL,
    "identify" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "MethodPayment_pkey" PRIMARY KEY ("idMethodPayment")
);

-- CreateTable
CREATE TABLE "TypePayment" (
    "idTypePayment" SERIAL NOT NULL,
    "typePayment" TEXT NOT NULL,

    CONSTRAINT "TypePayment_pkey" PRIMARY KEY ("idTypePayment")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_gradesId_fkey" FOREIGN KEY ("gradesId") REFERENCES "Grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payments"("idPayment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "MethodPayment"("idMethodPayment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MethodPayment" ADD CONSTRAINT "MethodPayment_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TypePayment"("idTypePayment") ON DELETE RESTRICT ON UPDATE CASCADE;
