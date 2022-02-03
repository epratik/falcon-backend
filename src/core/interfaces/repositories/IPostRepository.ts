import { CreatePostDto } from "../../dto/CreatePostDto";
import { ViewPostsDto } from "../../dto/ViewPostsDto";
import { Post } from "../../model/Post";

export interface IPostRepository {
    getTopPosts(limit: number, offset: number, tag: string | undefined,  subTag: string | undefined): Promise<ViewPostsDto[]>;
    getFollowedPosts(limit: number, offset: number, userId: number): Promise<ViewPostsDto[]>;
    getPosts(listId: number): Promise<Post[]>;
    like(postId: number, userId: number): Promise<void>;
    unlike(postId: number, userId:number): Promise<void>;
    checkIfPostBelongsToUser(postId: number, userId: number): Promise<boolean>;
    createPost(postDto: CreatePostDto): Promise<void>;
    deactivatePost(postId: number): Promise<void>;
}