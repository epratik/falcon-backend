import { CreatePostDto } from "../../dto/CreatePostDto";
import { TopPostsDto } from "../../dto/TopPostsDto";
import { Post } from "../../model/Post";

export interface IPostRepository {
    getTopPosts(limit: number, offset: number, tag: string | undefined): Promise<TopPostsDto[]>;
    getPosts(listId: number): Promise<Post[]>;
    like(postId: number): Promise<void>;
    unlike(postId: number): Promise<void>;
    checkIfPostBelongsToUser(postId: number, userId: number): Promise<boolean>;
    createPost(postDto: CreatePostDto): Promise<void>;
    deactivatePost(postId: number): Promise<void>;
}