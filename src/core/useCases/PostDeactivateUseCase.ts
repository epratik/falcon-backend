import { inject, injectable } from "tsyringe";
import { IPostRepository } from "../interfaces/repositories/IPostRepository";
import { IPostDeactivateUseCase } from "../interfaces/useCases/IPostDeactivateUseCase";

@injectable()
export class PostDeactivateUseCase implements IPostDeactivateUseCase {
    constructor(
        @inject("IPostRepository") private postRepo: IPostRepository
    ) { }

    execute = async (postId: number): Promise<void> => {
        await this.postRepo.deactivatePost(postId);
    }
}