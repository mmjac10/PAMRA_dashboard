export type ProjectHealth = "ON_TRACK" | "AT_RISK" | "DELAYED";
export type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";
export type ProjectType = "NEW" | "MAINTENANCE_REPAIR";

export type ProjectSummary = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cost: number;
  subengineerName: string;
  health: ProjectHealth;
  status: ProjectStatus;
  type: ProjectType;
};

export type MilestoneDTO = {
  id: string;
  type: "PHYSICAL" | "COST";
  title: string;
  description: string | null;
  targetDate: string | null;
  achievedDate: string | null;
  targetValue: number | null;
  achievedValue: number | null;
};

export type BottleneckDTO = {
  id: string;
  description: string;
  createdAt: string;
  photoIds: string[];
};

export type SitePhotoDTO = {
  id: string;
  weekOf: string;
};

export type ProjectDetail = {
  id: string;
  name: string;
  cost: number;
  status: ProjectStatus;
  health: ProjectHealth;
  subengineerName: string;
  subengineerContact: string | null;
  milestones: MilestoneDTO[];
  bottlenecks: BottleneckDTO[];
  sitePhotos: SitePhotoDTO[];
};
