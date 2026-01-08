export interface Item {
  id: string;
  text: string;
  completed: boolean;
  completedAt: number | null;
  completedBy: string | null;
  completedByName: string | null;
  addedBy: string;
  addedByName: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateItemInput {
  text: string;
}

export interface UpdateItemInput {
  text?: string;
  completed?: boolean;
}
