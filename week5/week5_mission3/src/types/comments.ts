export interface CommentAuthor {
  name: string;
  avatar?: string;
}

export interface CommentData {
  id: string;
  content: string;
  author: CommentAuthor;
}

export interface CommentApiResponse {
  data: {
    data: CommentData[];
    nextCursor: number | null;
  };
}
