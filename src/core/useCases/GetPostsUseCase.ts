import { inject, injectable } from "tsyringe";
import { IPostRepository } from "../interfaces/repositories/IPostRepository";
import { IGetPostsUseCase } from "../interfaces/useCases/IGetPostsUseCase";
import { Post } from "../model/Post";

@injectable()
export class GetPostsUseCase implements IGetPostsUseCase{
    
    constructor(@inject('IPostRepository') private postRepo:IPostRepository) {
    }

    execute = async (listId: number): Promise<Post[]> => {
        return await this.postRepo.getPosts(listId);
    }
}