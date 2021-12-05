import { PostPatchType } from "../../dto/PostPatchDto";

export interface ILikeUnlikeUseCase {
    execute(postId: number, patchType: PostPatchType): Promise<void>
}