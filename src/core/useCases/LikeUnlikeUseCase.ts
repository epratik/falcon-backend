import { inject, injectable } from "tsyringe";
import { PostPatchType } from "../dto/PostPatchDto";
import { IPostRepository } from "../interfaces/repositories/IPostRepository";
import { ILikeUnlikeUseCase } from "../interfaces/useCases/ILikeUnlikeUseCase";

@injectable()
export class LikeUnlikeUseCase implements ILikeUnlikeUseCase {
    constructor(
        @inject("IPostRepository") private postRepo: IPostRepository
    ) { }

    execute = async (postId: number, patchType: PostPatchType): Promise<void> => {
        if (patchType === PostPatchType.Like)
            await this.postRepo.like(postId);
        else
            await this.postRepo.unlike(postId);           
    }
}