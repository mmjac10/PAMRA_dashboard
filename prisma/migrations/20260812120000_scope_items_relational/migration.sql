-- AlterTable
ALTER TABLE "Project" DROP COLUMN "scopeOfWork";

-- CreateTable
CREATE TABLE "ScopeItem" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "quantity" TEXT,
    "progress" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ScopeItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScopeItem_projectId_idx" ON "ScopeItem"("projectId");

-- AddForeignKey
ALTER TABLE "ScopeItem" ADD CONSTRAINT "ScopeItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

