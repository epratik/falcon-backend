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

    execute = async (limit: number, offset: number): Promise<TopContentDto> => {
        let topContent: TopContentDto | undefined = undefined;

        const posts = await this.postRepo.getTopPosts(limit, offset);
        for (let i = 0; i < posts.length; i++) {

            const preview = await this.getLinkPreviewUseCase.execute(posts[i]);

            if (topContent && topContent.content) {
                topContent.content.push({
                    post: posts[i],
                    preview: preview
                })
            } else {
                topContent = {
                    content: [
                        {
                            post: posts[i],
                            preview: preview
                        }
                    ]
                }
            }
        }

        if (!topContent)
            topContent = { content: [] };
        
        return topContent;
    }
}