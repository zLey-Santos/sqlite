export interface IPost {
  content: string;
  created_at: string;
  id: number;
  count: number;
  initialPosts: string;
  user_id:number;
}

export type IResponseGetPost = {
  count: number;
  posts: IPost[];
 
};
