import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// 1x1 transparent PNG, used as placeholder photo bytes for seed data.
const PLACEHOLDER_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);

function sitePhoto(weekOf: string) {
  return { imageData: PLACEHOLDER_PNG, contentType: "image/png", weekOf: new Date(weekOf) };
}

function bottleneckPhoto() {
  return { imageData: PLACEHOLDER_PNG, contentType: "image/png" };
}

function physicalMilestone(
  title: string,
  targetPercent: number,
  achievedPercent: number,
  targetDate: string,
  achievedDate: string | null
) {
  return {
    type: "PHYSICAL" as const,
    title,
    targetDate: new Date(targetDate),
    achievedDate: achievedDate ? new Date(achievedDate) : null,
    targetValue: targetPercent,
    achievedValue: achievedPercent,
  };
}

function costMilestone(
  title: string,
  targetAmount: number,
  achievedAmount: number,
  targetDate: string,
  achievedDate: string | null
) {
  return {
    type: "COST" as const,
    title,
    targetDate: new Date(targetDate),
    achievedDate: achievedDate ? new Date(achievedDate) : null,
    targetValue: targetAmount,
    achievedValue: achievedAmount,
  };
}

const SUBENGINEERS = [
  { name: "Ali Raza", contact: "ali.raza@example.com" },
  { name: "Sana Tariq", contact: "sana.tariq@example.com" },
  { name: "Bilal Ahmed", contact: "bilal.ahmed@example.com" },
];

const PROJECTS = [
  {
    name: "Lahore Canal Road Widening",
    latitude: 31.5204,
    longitude: 74.3587,
    cost: 450_000_000,
    status: "IN_PROGRESS" as const,
    health: "ON_TRACK" as const,
    type: "NEW" as const,
    subengineer: 0,
    milestones: [
      physicalMilestone("Earthwork completion", 100, 100, "2026-03-01", "2026-02-20"),
      physicalMilestone("Asphalt paving", 100, 60, "2026-08-01", null),
      costMilestone("Phase 1 disbursement", 150_000_000, 150_000_000, "2026-03-15", "2026-03-10"),
    ],
    bottlenecks: [
      { description: "Utility line relocation delayed by WASA approval.", photos: [bottleneckPhoto()] },
    ],
    sitePhotos: [sitePhoto("2026-07-06"), sitePhoto("2026-07-13"), sitePhoto("2026-07-20")],
  },
  {
    name: "Multan Government School Block",
    latitude: 30.1575,
    longitude: 71.5249,
    cost: 82_500_000,
    status: "IN_PROGRESS" as const,
    health: "AT_RISK" as const,
    type: "NEW" as const,
    subengineer: 1,
    milestones: [
      physicalMilestone("Foundation and structure", 100, 100, "2026-05-01", "2026-04-28"),
      costMilestone("Materials procurement budget", 40_000_000, 35_000_000, "2026-06-01", null),
    ],
    bottlenecks: [{ description: "Cement price spike required budget re-approval.", photos: [] }],
    sitePhotos: [sitePhoto("2026-07-13"), sitePhoto("2026-07-20")],
  },
  {
    name: "Faisalabad Ravi Bridge Rehabilitation",
    latitude: 31.4504,
    longitude: 73.135,
    cost: 210_000_000,
    status: "ON_HOLD" as const,
    health: "DELAYED" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 0,
    milestones: [physicalMilestone("Structural assessment", 100, 100, "2026-04-15", "2026-04-10")],
    bottlenecks: [{ description: "On hold pending flood-season structural review.", photos: [] }],
    sitePhotos: [sitePhoto("2026-07-20")],
  },
  {
    name: "Rawalpindi Flyover Construction",
    latitude: 33.5651,
    longitude: 73.0169,
    cost: 620_000_000,
    status: "IN_PROGRESS" as const,
    health: "ON_TRACK" as const,
    type: "NEW" as const,
    subengineer: 2,
    milestones: [
      physicalMilestone("Pier foundations", 100, 100, "2026-02-01", "2026-01-25"),
      physicalMilestone("Girder installation", 100, 75, "2026-08-15", null),
      costMilestone("Steel procurement", 200_000_000, 200_000_000, "2026-03-01", "2026-02-27"),
    ],
    bottlenecks: [],
    sitePhotos: [sitePhoto("2026-07-06"), sitePhoto("2026-07-13"), sitePhoto("2026-07-20"), sitePhoto("2026-07-27")],
  },
  {
    name: "Gujranwala GT Road Widening",
    latitude: 32.1877,
    longitude: 74.1945,
    cost: 153_000_000,
    status: "IN_PROGRESS" as const,
    health: "AT_RISK" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 1,
    milestones: [physicalMilestone("Road base preparation", 100, 55, "2026-08-01", null)],
    bottlenecks: [
      { description: "Encroachment removal along service road delayed by court order.", photos: [bottleneckPhoto()] },
    ],
    sitePhotos: [sitePhoto("2026-07-20"), sitePhoto("2026-07-27")],
  },
  {
    name: "Sialkot Industrial Zone Access Road",
    latitude: 32.4945,
    longitude: 74.5229,
    cost: 124_000_000,
    status: "IN_PROGRESS" as const,
    health: "ON_TRACK" as const,
    type: "NEW" as const,
    subengineer: 0,
    milestones: [
      physicalMilestone("Drainage culverts", 100, 100, "2026-05-15", "2026-05-12"),
      costMilestone("Phase 1 disbursement", 60_000_000, 60_000_000, "2026-05-20", "2026-05-18"),
    ],
    bottlenecks: [],
    sitePhotos: [sitePhoto("2026-07-13"), sitePhoto("2026-07-20"), sitePhoto("2026-07-27")],
  },
  {
    name: "Bahawalpur City Roads Upgrade",
    latitude: 29.3956,
    longitude: 71.6836,
    cost: 167_000_000,
    status: "IN_PROGRESS" as const,
    health: "DELAYED" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 2,
    milestones: [physicalMilestone("Resurfacing - Zone A", 100, 30, "2026-06-01", null)],
    bottlenecks: [
      { description: "Contractor mobilization delayed; replacement contractor being onboarded.", photos: [] },
    ],
    sitePhotos: [sitePhoto("2026-07-20")],
  },
  {
    name: "Sargodha Water Supply Scheme",
    latitude: 32.0836,
    longitude: 72.6711,
    cost: 98_000_000,
    status: "IN_PROGRESS" as const,
    health: "AT_RISK" as const,
    type: "NEW" as const,
    subengineer: 1,
    milestones: [
      physicalMilestone("Tube well installation", 100, 80, "2026-06-15", null),
      costMilestone("Pipeline materials", 45_000_000, 30_000_000, "2026-07-01", null),
    ],
    bottlenecks: [{ description: "Electricity connection for pumping station pending WAPDA.", photos: [] }],
    sitePhotos: [sitePhoto("2026-07-06"), sitePhoto("2026-07-20")],
  },
  {
    name: "Sahiwal Regional Road Rehabilitation",
    latitude: 30.6682,
    longitude: 73.1114,
    cost: 142_000_000,
    status: "IN_PROGRESS" as const,
    health: "ON_TRACK" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 0,
    milestones: [physicalMilestone("Full-depth reclamation", 100, 90, "2026-07-15", null)],
    bottlenecks: [],
    sitePhotos: [sitePhoto("2026-07-13"), sitePhoto("2026-07-20"), sitePhoto("2026-07-27")],
  },
  {
    name: "Dera Ghazi Khan Drainage Project",
    latitude: 30.0561,
    longitude: 70.6339,
    cost: 76_000_000,
    status: "PLANNED" as const,
    health: "DELAYED" as const,
    type: "NEW" as const,
    subengineer: 2,
    milestones: [physicalMilestone("Detailed design approval", 100, 40, "2026-05-01", null)],
    bottlenecks: [
      { description: "Design approval stalled at provincial irrigation department.", photos: [bottleneckPhoto()] },
    ],
    sitePhotos: [sitePhoto("2026-07-20")],
  },
];

async function main() {
  await db.sitePhoto.deleteMany();
  await db.bottleneckPhoto.deleteMany();
  await db.bottleneck.deleteMany();
  await db.milestone.deleteMany();
  await db.project.deleteMany();
  await db.subengineer.deleteMany();
  await db.user.deleteMany();

  const devPasswordHash = await bcrypt.hash("ChangeMe123!", 12);
  await db.user.create({
    data: {
      email: "engineer@example.com",
      passwordHash: devPasswordHash,
      name: "Dev Engineer",
    },
  });
  console.log("Seeded dev login: engineer@example.com / ChangeMe123!");

  const subengineers = [];
  for (const subengineer of SUBENGINEERS) {
    subengineers.push(await db.subengineer.create({ data: subengineer }));
  }

  for (const project of PROJECTS) {
    await db.project.create({
      data: {
        name: project.name,
        latitude: project.latitude,
        longitude: project.longitude,
        cost: project.cost,
        status: project.status,
        health: project.health,
        type: project.type,
        subengineerId: subengineers[project.subengineer].id,
        milestones: { create: project.milestones },
        bottlenecks: {
          create: project.bottlenecks.map((b) => ({
            description: b.description,
            photos: { create: b.photos },
          })),
        },
        sitePhotos: { create: project.sitePhotos },
      },
    });
  }

  console.log(`Seeded ${PROJECTS.length} projects across ${subengineers.length} subengineers.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
