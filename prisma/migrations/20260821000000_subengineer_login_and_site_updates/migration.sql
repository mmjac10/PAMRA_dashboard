-- AlterTable
ALTER TABLE "Subengineer" ADD COLUMN     "email" TEXT,
ADD COLUMN     "passwordHash" TEXT;

-- CreateTable
CREATE TABLE "SiteUpdate" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "subengineerId" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteUpdatePhoto" (
    "id" TEXT NOT NULL,
    "siteUpdateId" TEXT NOT NULL,
    "imageData" BYTEA NOT NULL,
    "contentType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteUpdatePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subengineer_email_key" ON "Subengineer"("email");

-- CreateIndex
CREATE INDEX "SiteUpdate_projectId_idx" ON "SiteUpdate"("projectId");

-- CreateIndex
CREATE INDEX "SiteUpdate_subengineerId_idx" ON "SiteUpdate"("subengineerId");

-- CreateIndex
CREATE INDEX "SiteUpdatePhoto_siteUpdateId_idx" ON "SiteUpdatePhoto"("siteUpdateId");

-- AddForeignKey
ALTER TABLE "SiteUpdate" ADD CONSTRAINT "SiteUpdate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteUpdate" ADD CONSTRAINT "SiteUpdate_subengineerId_fkey" FOREIGN KEY ("subengineerId") REFERENCES "Subengineer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteUpdatePhoto" ADD CONSTRAINT "SiteUpdatePhoto_siteUpdateId_fkey" FOREIGN KEY ("siteUpdateId") REFERENCES "SiteUpdate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
