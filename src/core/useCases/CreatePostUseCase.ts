import { inject, injectable } from "tsyringe";
import { CreatePostDto } from "../dto/CreatePostDto";
import { IPostRepository } from "../interfaces/repositories/IPostRepository";
import { ICreatePostUseCase } from "../interfaces/useCases/ICreatePostUseCase";

@injectable()
export class CreatePostUseCase implements ICreatePostUseCase {
    constructor(
        @inject("IPostRepository") private postRepo: IPostRepository
    ) { }

    execute = async (postDto: CreatePostDto): Promise<void> => {
        await this.postRepo.createPost(postDto);
    }
}