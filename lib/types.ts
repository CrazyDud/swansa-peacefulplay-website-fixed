export type GameRecord = {
  id: string;
  placeId: string;
  universeId: string;
  robloxUrl: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorType: string;
  genre: string;
  thumbnailUrl: string;
  visits: number;
  playing: number;
  rating: number;
  maxPlayers: number;
  launchedAt: string;
  isVisible: boolean;
  isFeatured: boolean;
  sortOrder: number;
  addedAt: string;
  lastSyncedAt: string;
};

export type NewGameRecord = Omit<GameRecord, "id" | "addedAt" | "lastSyncedAt">;
