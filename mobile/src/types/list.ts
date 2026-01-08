export interface List {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  color: string | null;
  members: Record<string, ListMember>;
  items: Record<string, Item>;
  itemCount: number;
  completedCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface ListMember {
  role: 'owner' | 'editor';
  displayName: string;
  joinedAt: number;
}

export interface UserList {
  listId: string;
  listName: string;
  role: 'owner' | 'editor';
  isShared: boolean;
  lastAccessedAt: number;
}

export interface CreateListInput {
  name: string;
  color?: string;
}

export interface UpdateListInput {
  name?: string;
  color?: string;
}
