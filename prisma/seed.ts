import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

type ScopeItemSeed = {
  item: string;
  quantity: string | null;
  progress: string | null;
};

const SITE_PHOTOS_ROOT = path.join(__dirname, "seed-assets", "site-photos");
const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};
const SITE_PHOTO_WEEK_START = new Date("2026-07-06");

function sitePhotosForProject(oneBasedIndex: number) {
  const dir = path.join(SITE_PHOTOS_ROOT, String(oneBasedIndex).padStart(2, "0"));
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .sort()
    .map((fileName, i) => {
      const ext = path.extname(fileName).toLowerCase();
      const weekOf = new Date(SITE_PHOTO_WEEK_START);
      weekOf.setDate(weekOf.getDate() + i * 7);
      return {
        imageData: fs.readFileSync(path.join(dir, fileName)),
        contentType: CONTENT_TYPE_BY_EXT[ext] ?? "application/octet-stream",
        weekOf,
      };
    });
}

const SUBENGINEERS = [
  { name: "M/S MH Engineering Services" },
  { name: "M/S United Construction Company" },
  { name: "M/S Good Luck Construction Company" },
  { name: "M. Shahzaib Govt. Contractor" },
  { name: "M/s AL-Zubair Construction Company" },
  { name: "M/S Ameen & Sons" },
  { name: "M/s AL-Meezan Associates" },
  { name: "AISK Constructor" },
  { name: "M/S Thal Enterprises" },
  { name: "M/S Shan Construction Company" },
];

const PROJECTS = [
  {
    name: "Rehabilitation of RCC Road, Boundary Wall, Construction of Fiber Pharya Shed and Gate in Fruit and Vegetable Market Ravi Link Road Lahore",
    latitude: 31.601304,
    longitude: 74.309512,
    cost: 271_059_000,
    status: "IN_PROGRESS" as const,
    health: "AT_RISK" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 0,
    location: "Lahore",
    adminApproval: 276_000_000,
    workOrderAmount: 238_400_000,
    workDoneAmount: 70_900_000,
    percentWorkDone: 30,
    scopeItems: [
      { item: "Dismantling/Road Clearance", quantity: "2490 Rft", progress: "1100 Rft has been completed" },
      { item: "Laying of Sub-Base", quantity: "2490 Rft", progress: "1100 Rft has been Completed" },
      { item: "RCC Road with 05 Feet Tuff Paver on Shoulders", quantity: "2490 Rft with 30 feet wide", progress: "15680 Sft and 11798 Sft completed" },
      { item: "RCC Sewer Lines", quantity: '12" i/d 485 Rft, 24" i/d 280 Rft', progress: '485 Rft 12i/d completed, 24" under progress' },
      { item: "Rehabilitation of Boundary wall", quantity: "1330 Rft", progress: "350 rft constructed, 600 Rft dismantled" },
      { item: "Fiber Pharia Shed", quantity: "17152 Sft", progress: "Excluded from scope" },
      { item: "Construction of Gate and Gate Pillars", quantity: "03-Nos", progress: "Under progress" },
      { item: "Tuff Paver at Side Footpaths/Pharia portion", quantity: "129950 Sft", progress: "2350 Sft completed" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Construction of Office Building for Market Committee Office TT Singh",
    latitude: 30.954804,
    longitude: 72.492077,
    cost: 35_824_000,
    status: "IN_PROGRESS" as const,
    health: "DELAYED" as const,
    type: "NEW" as const,
    subengineer: 0,
    location: "Toba Tek Singh",
    adminApproval: 36_000_000,
    workOrderAmount: 33_875_000,
    workDoneAmount: 9_700_000,
    percentWorkDone: 29,
    scopeItems: [
      { item: "Foundation work up to plinth level (Pacca brick work)", quantity: "3151 Cft", progress: "Completed" },
      { item: "Pacca brick work Ground Floor", quantity: "561 Cft", progress: "Completed" },
      { item: "Pacca brick work First Floor", quantity: null, progress: "Under Progress" },
      { item: "RCC Lintel of ground floor", quantity: "5791 Cft", progress: "Completed" },
      { item: "Plaster work", quantity: "9372 Sft", progress: "Under Progress" },
      { item: "Installation of tile, doors, sanitary work, electric installation", quantity: "No.", progress: "Not started yet" },
      { item: "2nd floor brick work", quantity: "No", progress: "Not Started yet" },
      { item: "Tuff Paver", quantity: "1105 Sft", progress: "Not Started yet" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Establishment of New Grain Market Mandi Bahaudin",
    latitude: 32.559272,
    longitude: 73.496226,
    cost: 677_980_000,
    status: "IN_PROGRESS" as const,
    health: "DELAYED" as const,
    type: "NEW" as const,
    subengineer: 1,
    location: "Mandi Bahauddin",
    adminApproval: 677_960_000,
    workOrderAmount: 473_560_000,
    workDoneAmount: 135_000_000,
    percentWorkDone: 29,
    scopeItems: [
      { item: "Building works", quantity: null, progress: "65% work has been completed" },
      { item: "RCC Boundary wall", quantity: "1368 Rft", progress: null },
      { item: "Entrance/exit gates", quantity: "04 No", progress: null },
      { item: "Administration Block", quantity: "1133 Sft", progress: null },
      { item: "Canteen", quantity: "1600 Sft", progress: null },
      { item: "Masjid", quantity: "1133 Sft", progress: null },
      { item: "Toilet Block", quantity: "689 Sft", progress: null },
      { item: "Grower Hall", quantity: "1120 Sft", progress: null },
      { item: "Solid Waste", quantity: "696 Sft", progress: null },
      { item: "Auction Platform", quantity: "39057 Sft", progress: null },
      { item: "Weighbridge", quantity: "02 No", progress: null },
      { item: "Street lights", quantity: "80 No", progress: null },
      { item: "LED Cobra Head luminaries", quantity: "160 No.", progress: null },
      { item: "Sewerage Works", quantity: "22'X12' 15' I/D", progress: null },
      { item: 'RCC Sewer (15",18",21",24")', quantity: "6079 Sft", progress: null },
      { item: "Water distribution System", quantity: "4500 Rft", progress: null },
      { item: "RCC Road", quantity: "81368 Sft", progress: null },
      { item: "Parking area", quantity: "28208 Sft", progress: null },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Construction of RCC Road and Auction Sheds in Fruit and Vegetable Market Jhang Road Faisalabad",
    latitude: 31.358663,
    longitude: 72.952801,
    cost: 151_079_000,
    status: "IN_PROGRESS" as const,
    health: "AT_RISK" as const,
    type: "NEW" as const,
    subengineer: 2,
    location: "Faisalabad",
    adminApproval: 152_000_000,
    workOrderAmount: 141_194_000,
    workDoneAmount: 63_320_000,
    percentWorkDone: 45,
    scopeItems: [
      { item: "Dismantling/removing Road Metaling/PCC", quantity: "2650/2625 Sft", progress: "Completed" },
      { item: "Laying of Sub-Base", quantity: "15725 Sft", progress: "Completed" },
      { item: "RCC Road", quantity: "1000 Rft", progress: "Completed" },
      { item: "Tuff Paver on both side of road", quantity: "26000 Sft", progress: "Completed" },
      { item: "RCC of parking Portion alongwith sub-base", quantity: "3864 Sft", progress: "Completed" },
      { item: "Dismantling of RCC Sheds", quantity: "2121 Sft", progress: "Completed" },
      { item: "Repair of Column and Beams", quantity: "24 Sheds", progress: "Under Progress" },
      { item: "Installation/fixing of Cement fiber Sheds", quantity: "24 No", progress: "Under Progress" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Establishment of Fruit and Vegetable Market Mandi Bahauddin",
    latitude: 32.558609,
    longitude: 73.497936,
    cost: 601_976_000,
    status: "IN_PROGRESS" as const,
    health: "ON_TRACK" as const,
    type: "NEW" as const,
    subengineer: 1,
    location: "Mandi Bahauddin",
    adminApproval: 601_976_000,
    workOrderAmount: 238_400_000,
    workDoneAmount: null,
    percentWorkDone: null,
    scopeItems: [
      { item: "Dismantling/Road Clearance", quantity: "2607 Rft", progress: "2607 Rft has been completed" },
      { item: "Laying of Sub-Base", quantity: "2607 Rft", progress: "2607 Rft has been Completed" },
      { item: "Design Construction testing and disinfecting RCC OHR 10000", quantity: "RCC OHR 10000", progress: "Completed in all respect" },
      { item: "Auction Shed", quantity: "25761 Sft", progress: "Complete in all Respect" },
      { item: "Rehabilitation of Boundary wall", quantity: "1949 Rft", progress: "1949 Rft Completed in all Respect" },
      { item: "Fiber Pharia Shed", quantity: "10400 Sft", progress: "10400 Sft Completed in all Respect" },
      { item: "Construction of Main Building and Toilet, Grower, Canteen, Bank", quantity: "05-Nos", progress: "Under Near Completion in progress" },
      { item: "Tuff Paver at Side Footpaths/Pharia portion", quantity: "33932 Sft", progress: "33932 Sft has been completed" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Addition/Alteration and Renovation of PAMRA Complex, Building 21 Davis Road Lahore",
    latitude: 31.559,
    longitude: 74.335,
    cost: 99_900_000,
    status: "IN_PROGRESS" as const,
    health: "DELAYED" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 0,
    location: "Lahore",
    adminApproval: 99_900_000,
    workOrderAmount: 95_670_000,
    workDoneAmount: 21_000_000,
    percentWorkDone: 22,
    scopeItems: [
      { item: "3rd Floor", quantity: null, progress: "90%" },
      { item: "2nd Floor", quantity: null, progress: "60%" },
      { item: "1st Floor", quantity: null, progress: "10%" },
      { item: "Ground Floor", quantity: null, progress: "05%" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Establishment of New Fruit & Vegetable Market Dhollay Wala Kasur",
    latitude: 31.1156,
    longitude: 74.4502,
    cost: 1_495_100_000,
    status: "IN_PROGRESS" as const,
    health: "DELAYED" as const,
    type: "NEW" as const,
    subengineer: 4,
    location: "Kasur",
    adminApproval: 1_495_100_000,
    workOrderAmount: 1_432_650_000,
    workDoneAmount: 152_970_000,
    percentWorkDone: 11,
    scopeItems: [
      { item: "Weigh Bridge", quantity: null, progress: "Nil" },
      { item: "Boundary Wall", quantity: null, progress: "45%" },
      { item: "Washroom/Toilet Block", quantity: null, progress: "Nil" },
      { item: "Parking Area", quantity: null, progress: "Nil" },
      { item: "Grading Unit", quantity: null, progress: "Nil" },
      { item: "Tuck shop", quantity: null, progress: "Nil" },
      { item: "Masjid, Canteen Cafeteria", quantity: null, progress: "Nil" },
      { item: "Rest House", quantity: null, progress: "Nil" },
      { item: "Office of Market Committee", quantity: null, progress: "Nil" },
      { item: "Internal Roads", quantity: null, progress: "Earthwork filling 70%" },
      { item: "Bank", quantity: null, progress: "Nil" },
      { item: "Cold Storage", quantity: null, progress: "Nil" },
      { item: "Green Area", quantity: null, progress: "Nil" },
      { item: "Agriculture Research Center", quantity: null, progress: "Nil" },
      { item: "Dispensery", quantity: null, progress: "Nil" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Construction of Office Building and Road at Fruit & Vegetable Market Muzaffargarh",
    latitude: 30.063163,
    longitude: 71.209511,
    cost: 25_000_000,
    status: "IN_PROGRESS" as const,
    health: "ON_TRACK" as const,
    type: "NEW" as const,
    subengineer: 5,
    location: "Muzaffargarh",
    adminApproval: 25_000_000,
    workOrderAmount: 22_695_286,
    workDoneAmount: 20_500_000,
    percentWorkDone: 90,
    scopeItems: [
      { item: "Construction of Roads with provision of Tuff Pavor (80mm)", quantity: null, progress: "65%" },
      { item: "Construction of covered drain", quantity: null, progress: "100%" },
      { item: "Raising of covered drain", quantity: null, progress: "100%" },
      { item: "Construction of Market Committee office with Boundary Wall and Gate", quantity: null, progress: "10%" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Rehabilitation of Carpet Roads and Provision of LED street lights in Grain Market Multan",
    latitude: 30.175427,
    longitude: 71.469544,
    cost: 56_000_000,
    status: "IN_PROGRESS" as const,
    health: "ON_TRACK" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 3,
    location: "Multan",
    adminApproval: 56_000_000,
    workOrderAmount: 53_123_605,
    workDoneAmount: 38_650_000,
    percentWorkDone: 73,
    scopeItems: [
      { item: "Construction of road with sewerage post office to shop no 206", quantity: null, progress: "80%" },
      { item: "Construction of road with sewerage shop no 103 to 134 and 147", quantity: null, progress: "80%" },
      { item: "Construction of road with sewerage chowk Malik Shakeel to Chowk Fawara", quantity: null, progress: null },
      { item: "Provision of Solar LED Street lights", quantity: null, progress: null },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Construction of Disposal Station, Rehabilitation of roads and repair of Market Committee Office Building in Fruit & Vegetable Market Pakpattan",
    latitude: 30.370108,
    longitude: 73.366678,
    cost: 78_000_000,
    status: "PLANNED" as const,
    health: "DELAYED" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 6,
    location: "Pakpattan",
    adminApproval: 78_000_000,
    workOrderAmount: 71_414_172,
    workDoneAmount: 0,
    percentWorkDone: 0,
    scopeItems: [
      { item: "Construction of roads within the market", quantity: null, progress: "35%" },
      { item: "Repair of covered auction platform", quantity: null, progress: "10%" },
      { item: "Construction of covered drain for storm water within the market", quantity: null, progress: "Nil" },
      { item: "Repair of Disposal/Repair of Gate and Gate Pillars", quantity: null, progress: "Nil" },
      { item: "Rehabilitation and renovation of market committee office", quantity: null, progress: "80%" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Construction of Main Entrance Gate, Repair of RCC Road, Auction Shed, Cycle Stand Shed, Paint of Boundary Wall and Provision of Led Street Lights in New Fruit & Vegetable Market Multan",
    latitude: 30.1975,
    longitude: 71.47,
    cost: 26_812_000,
    status: "IN_PROGRESS" as const,
    health: "DELAYED" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 3,
    location: "Multan",
    adminApproval: 26_812_000,
    workOrderAmount: 26_295_517,
    workDoneAmount: 470_000,
    percentWorkDone: 2,
    scopeItems: [
      { item: "Weather Shield of overall Boundary wall", quantity: null, progress: "100%" },
      { item: "Repair of Boundary wall with brick work and plaster", quantity: null, progress: "80%" },
      { item: "Repair of RCC Road (Patch Work) within the market", quantity: null, progress: "20%" },
      { item: "Construction of main entrance gate", quantity: null, progress: "Design/Drawing finalized" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Construction of Toilet Block, Gate and Repair of boundary wall in F&V Market, Chiniot",
    latitude: 31.713865,
    longitude: 73.03724,
    cost: 6_474_000,
    status: "IN_PROGRESS" as const,
    health: "AT_RISK" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 5,
    location: "Chiniot",
    adminApproval: 6_500_000,
    workOrderAmount: 5_858_783,
    workDoneAmount: 3_040_000,
    percentWorkDone: 52,
    scopeItems: [
      { item: "Construction of Toilet Block", quantity: "No. (1)", progress: "85%" },
      { item: "Construction of Boundary Wall", quantity: "Rft (120)", progress: "100%" },
      { item: "Construction of Gate and Gate Pillars", quantity: "No. (1)", progress: "10%" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Establishment of Fruit & Vegetable Market Lahore-Faisalabad Bypass Road Sheikhupura",
    latitude: 31.694555,
    longitude: 74.012937,
    cost: 263_500_000,
    status: "IN_PROGRESS" as const,
    health: "AT_RISK" as const,
    type: "NEW" as const,
    subengineer: 0,
    location: "Sheikhupura",
    adminApproval: 263_500_000,
    workOrderAmount: 239_000_000,
    workDoneAmount: 123_000_000,
    percentWorkDone: 51,
    scopeItems: [
      { item: 'RCC Sewer (12" i/d to 18"i/d)', quantity: "3175 Rft", progress: "Completed" },
      { item: "Screening Chamber (18.75'x10.75')", quantity: "1 job", progress: "Completed" },
      { item: "Collecting Tank Dia 15'", quantity: "1 job", progress: "Completed" },
      { item: "RCC Roads (Parking)", quantity: "94265 Cft", progress: "34872 Cft partially completed" },
      { item: "Office Building 3 stories", quantity: "6000 sft", progress: "2000 Sft - Super structure of 1st floor completed" },
      { item: "Sullage Carrier (Slab)", quantity: "2751 Rft", progress: "3001 Rft - 95% Completed" },
      { item: "Weight Bridge", quantity: "1 job", progress: "Work in progress" },
      { item: "Tuff Tile", quantity: "44018 Sft", progress: "32900 Sft partially completed" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Construction of RESCUE-1122 standby station, repair of boundary wall and RCC Toe wall at New Grain Market Rahim Yar Khan and Construction of New Toilet Block Kot Simaba Feeder Market",
    latitude: 28.4212,
    longitude: 70.2989,
    cost: 17_500_000,
    status: "IN_PROGRESS" as const,
    health: "ON_TRACK" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 7,
    location: "Rahim Yar Khan",
    adminApproval: 17_500_000,
    workOrderAmount: 14_774_509,
    workDoneAmount: 15_450_000,
    percentWorkDone: 100,
    scopeItems: [
      { item: "Boundary wall", quantity: "Rft", progress: "100%" },
      { item: "Construction of Toilet Block in Kot Samaba", quantity: "No.(1)", progress: "30%" },
      { item: "Repair of open auction platform", quantity: "Sft", progress: "65%" },
      { item: "Construction of RESCUE-1122 stand by station with storage tank", quantity: "No.", progress: "55%" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Rehabilitation of RCC Road, in front of shops no. 64 to 94 along with Tuff Pavers in Grain Market Dijkot Road, Faisalabad",
    latitude: 31.38,
    longitude: 73.085,
    cost: 45_927_000,
    status: "IN_PROGRESS" as const,
    health: "ON_TRACK" as const,
    type: "MAINTENANCE_REPAIR" as const,
    subengineer: 2,
    location: "Faisalabad",
    adminApproval: 45_000_000,
    workOrderAmount: 26_000_000,
    workDoneAmount: 25_840_000,
    percentWorkDone: 99,
    scopeItems: [
      { item: "Dismantling/removing Road Metaling/Brick masonry", quantity: "2550/300 Sft", progress: "Completed" },
      { item: "Laying of Sub-Base", quantity: "31312 Sft", progress: "Completed" },
      { item: "RCC Road", quantity: "800 Rft", progress: "Completed" },
      { item: "Tuff Paver on both side of road", quantity: "12800 Sft", progress: "Completed" },
      { item: "Manhole raising", quantity: "12 No", progress: "Completed" },
      { item: "Laying of RCC Sewer line (Pharia Market)", quantity: "850 Rft", progress: "Under Progress" },
      { item: "RCC Road Portion", quantity: "770 Rst", progress: "Not Started yet" },
      { item: "Tuff Paver", quantity: "1105 Sft", progress: "Not Started yet" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Establishment Of New Grain Market Hasilpur",
    latitude: 29.69577,
    longitude: 72.554451,
    cost: 902_810_000,
    status: "IN_PROGRESS" as const,
    health: "DELAYED" as const,
    type: "NEW" as const,
    subengineer: 8,
    location: "Hasilpur",
    adminApproval: 902_810_000,
    workOrderAmount: 821_552_550,
    workDoneAmount: 160_270_000,
    percentWorkDone: 20,
    scopeItems: [
      { item: "Construction of RCC Roads/Auction Platforms", quantity: null, progress: "30%" },
      { item: "Provision of Storm water drains, Sewerage, Water Supply, OHR", quantity: null, progress: "Nil" },
      { item: "Construction Of Admin. Office/Rest House", quantity: null, progress: "40%" },
      { item: "Construction of Main Entrance Road and Boundary Wall", quantity: null, progress: "40%" },
      { item: "Construction of Market Committee office with Boundary Wall", quantity: null, progress: "45%" },
    ] satisfies ScopeItemSeed[],
  },
  {
    name: "Construction of Shed Office Toilet Block Boundary Wall Tuff Paver Gate and Gate Pillars Security Room Water Supply in New Fruit and Vegetable Market Sialkot",
    latitude: 32.4525,
    longitude: 74.5189,
    cost: 324_945_000,
    status: "IN_PROGRESS" as const,
    health: "AT_RISK" as const,
    type: "NEW" as const,
    subengineer: 9,
    location: "Sialkot",
    adminApproval: 326_240_000,
    workOrderAmount: 303_403_000,
    workDoneAmount: 90_000_000,
    percentWorkDone: 30,
    scopeItems: [
      { item: "Auction Shed No. 01", quantity: null, progress: "Foundation 100%" },
      { item: "Auction Shed No. 02", quantity: null, progress: "No Work Started yet" },
      { item: "Auction Shed No. 03", quantity: null, progress: "90%" },
      { item: "Auction Shed No. 04", quantity: null, progress: "95%" },
      { item: "Auction Shed No. 05", quantity: null, progress: "No Work Started yet" },
      { item: "MC Office", quantity: null, progress: "No Work Started yet" },
      { item: "Toilet Blocks", quantity: null, progress: "No Work Started yet" },
      { item: "Boundary Wall", quantity: null, progress: "Earthwork Complete" },
      { item: "Gate and Gate Pillars", quantity: null, progress: "No Work Started yet" },
      { item: "Parking", quantity: null, progress: "No Work Started yet" },
      { item: "Street Lights", quantity: null, progress: "No Work Started yet" },
      { item: "Water Supply and Reservoir", quantity: null, progress: "No Work Started yet" },
    ] satisfies ScopeItemSeed[],
  },
];

async function main() {
  await db.sitePhoto.deleteMany();
  await db.bottleneckPhoto.deleteMany();
  await db.bottleneck.deleteMany();
  await db.scopeItem.deleteMany();
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

  for (const [index, project] of PROJECTS.entries()) {
    await db.project.create({
      data: {
        name: project.name,
        latitude: project.latitude,
        longitude: project.longitude,
        cost: project.cost,
        status: project.status,
        health: project.health,
        type: project.type,
        location: project.location,
        adminApproval: project.adminApproval,
        workOrderAmount: project.workOrderAmount,
        workDoneAmount: project.workDoneAmount,
        percentWorkDone: project.percentWorkDone,
        subengineerId: subengineers[project.subengineer].id,
        scopeItems: {
          create: project.scopeItems.map((scopeItem, scopeIndex) => ({
            item: scopeItem.item,
            quantity: scopeItem.quantity,
            progress: scopeItem.progress,
            order: scopeIndex,
          })),
        },
        sitePhotos: {
          create: sitePhotosForProject(index + 1),
        },
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
