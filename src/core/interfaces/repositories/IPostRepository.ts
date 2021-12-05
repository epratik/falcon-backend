import { TopPostsDto } from "../../dto/TopPostsDto";

export interface IPostRepository{
    getTopPosts(limit: number, offset: number, tag: string | undefined): Promise<TopPostsDto[]>;
    like(postId: number): Promise<void>;
    unlike(postId: number): Promise<void>;
}