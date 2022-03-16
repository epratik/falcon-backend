import { inject, injectable } from "tsyringe";
import { CreatePostDto } from "../dto/CreatePostDto";
import { IConfigManager } from "../interfaces/common/IConfigManager";
import { IAwsHelper } from "../interfaces/framework/IAwsHelper";
import { IHttpClient } from "../interfaces/framework/IHttpClient";
import { IPostRepository } from "../interfaces/repositories/IPostRepository";
import { ICreatePostUseCase } from "../interfaces/useCases/ICreatePostUseCase";
import { IGetLinkPreviewUseCase } from "../interfaces/useCases/IGetLinkPreviewUseCase";

@injectable()
export class CreatePostUseCase implements ICreatePostUseCase {
    constructor(
        @inject("IPostRepository") private postRepo: IPostRepository,
        @inject("IGetLinkPreviewUseCase") private linkPreview: IGetLinkPreviewUseCase,
        @inject("IAwsHelper") private awsHelper: IAwsHelper,
        @inject("IHttpClient") private httpClient: IHttpClient,
        @inject("IConfigManager") private configManager: IConfigManager
    ) { }

    execute = async (postDto: CreatePostDto): Promise<void> => {
        await this.postRepo.createPost(postDto);
    }
}