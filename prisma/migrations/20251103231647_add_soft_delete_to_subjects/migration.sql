-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "deletedAt" TIMESTAMP(3);
