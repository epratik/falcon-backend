import { inject, injectable } from "tsyringe";
import { IPostRepository } from "../interfaces/repositories/IPostRepository";
import { IGetTopContentUseCase } from "../interfaces/useCases/IGetTopContentUseCase";
import { TopContentDto } from "../dto/TopContentDto";
import { IGetLinkPreviewUseCase } from "../interfaces/useCases/IGetLinkPreviewUseCase";


@injectable()
export class GetTopContentUseCase implements IGetTopContentUseCase {
    constructor(
        @inject("IGetLinkPreviewUseCase") private getLinkPreviewUseCase: IGetLinkPreviewUseCase,
        @inject("IPostRepository") private postRepo: IPostRepository
    ) { }

    execute = async (limit: number, offset: number, tag: string | undefined): Promise<TopContentDto> => {
        let topContent: TopContentDto | undefined = undefined;
        
        const posts = await this.postRepo.getTopPosts(limit, offset, tag);
        await Promise.all(posts.map(async (item) => {
            const preview = await this.getLinkPreviewUseCase.execute(item.url);
            
            if (topContent && topContent.content) {
                topContent.content.push({
                    post: item,
                    preview: preview
                })
            } else {
                topContent = {
                    content: [
                        {
                            post: item,
                            preview: preview
                        }
                    ]
                }
            }
        }));

        if (!topContent)
            topContent = { content: [] };
        
        return topContent;
    }
}