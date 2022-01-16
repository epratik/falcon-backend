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
        console.log('inside create post')
        if (await this.configManager.enableAWSRekognition) {
            const preview = await this.linkPreview.execute(postDto.url);
            console.log('preview')
            console.log(preview);
            if (preview.images && preview.images.length > 0) {
                
                console.log('calling axios')
                const buffer = await this.httpClient.getImageBuffer({ url: preview.images[0] });
                console.log('buffer')
                console.log(buffer)
                if (await this.awsHelper.checkExplicitContent(buffer))
                    throw new Error('Explicit content detected');
            }
        }
        
        await this.postRepo.createPost(postDto);
    }
}