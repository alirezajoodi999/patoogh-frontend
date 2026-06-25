export interface Comment {
  _id: string;
  contentId: string;
  userId: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };
  parentId: string | null;
  text: string;
  likes: string[];
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[];
}

export interface CreateCommentDto {
  contentId: string;
  parentId?: string | null;
  text: string;
}