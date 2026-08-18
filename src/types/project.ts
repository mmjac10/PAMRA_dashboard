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
  workDoneAmount: number | null;
  percentWorkDone: number | null;
};

export type ScopeItemDTO = {
  item: string;
  quantity: string | null;
  progress: string | null;
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
  latitude: number;
  longitude: number;
  cost: number;
  status: ProjectStatus;
  health: ProjectHealth;
  subengineerName: string;
  location: string | null;
  adminApproval: number | null;
  workOrderAmount: number | null;
  workDoneAmount: number | null;
  percentWorkDone: number | null;
  scopeOfWork: ScopeItemDTO[];
  bottlenecks: BottleneckDTO[];
  sitePhotos: SitePhotoDTO[];
};
