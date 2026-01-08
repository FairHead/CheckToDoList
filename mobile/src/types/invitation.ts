export interface Invitation {
  id: string;
  listId: string;
  listName: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  toPhoneNumber: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string | null;
  createdAt: number;
  respondedAt: number | null;
}

export interface CreateInvitationInput {
  listId: string;
  toUserId?: string;
  toPhoneNumber?: string;
  message?: string;
}
