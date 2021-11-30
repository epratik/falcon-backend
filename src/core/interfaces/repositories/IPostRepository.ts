import { TopPostsDto } from "../../dto/TopPostsDto";

export interface IPostRepository{
    getTopPosts(limit: number, offset: number, tag: string | undefined): Promise<TopPostsDto[]>;
}