import { Post } from "../../model/Post";
import { Preview } from "../../model/Preview"

export interface IGetLinkPreviewUseCase {
    execute(post: Post): Promise<Preview>;
}