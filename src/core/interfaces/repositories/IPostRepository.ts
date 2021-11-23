import { Post } from "../../model/Post";

export interface IPostRepository{
    getTopPosts(limit: number, offset: number): Promise<Post[]>;
}