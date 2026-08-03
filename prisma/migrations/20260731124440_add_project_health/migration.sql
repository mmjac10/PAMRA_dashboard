-- CreateEnum
CREATE TYPE "ProjectHealth" AS ENUM ('ON_TRACK', 'AT_RISK', 'DELAYED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "health" "ProjectHealth" NOT NULL DEFAULT 'ON_TRACK';
