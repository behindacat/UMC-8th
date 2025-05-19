export interface CommentAuthor {
  id: number;
  name: string;
  avatar?: string;
}

export interface CommentData {
  id: number;
  content: string;
  author?: {
    id: number;
    name?: string;
  };
  createdAt?: string; // 이 부분 추가
}

export interface CommentApiResponse {
  data: {
    data: CommentData[];
    nextCursor: number | null;
  };
}
