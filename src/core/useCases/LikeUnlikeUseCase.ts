import { inject, injectable } from "tsyringe";
import { PostPatchType, PostPatchTypeSchema } from "../dto/PostPatchDto";
import { IPostRepository } from "../interfaces/repositories/IPostRepository";
import { ILikeUnlikeUseCase } from "../interfaces/useCases/ILikeUnlikeUseCase";

@injectable()
export class LikeUnlikeUseCase implements ILikeUnlikeUseCase {
    constructor(
        @inject("IPostRepository") private postRepo: IPostRepository
    ) { }

    execute = async (postId: number, patchType: PostPatchType, userId: number): Promise<void> => {
        if (patchType === PostPatchTypeSchema.enum.Like)
            await this.postRepo.like(postId, userId);
        else
            await this.postRepo.unlike(postId);           
    }
}