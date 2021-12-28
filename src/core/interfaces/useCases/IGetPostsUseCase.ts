import { Post } from "../../model/Post";

export interface IGetPostsUseCase {
    execute(listId: number): Promise<Post[]>;
}