-- DropForeignKey
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "adminApproval" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "percentWorkDone" INTEGER,
ADD COLUMN     "scopeOfWork" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "workDoneAmount" DECIMAL(14,2),
ADD COLUMN     "workOrderAmount" DECIMAL(14,2);

-- DropTable
DROP TABLE "Milestone";

-- DropEnum
DROP TYPE "MilestoneType";
