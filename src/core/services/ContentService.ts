import { inject, injectable } from "tsyringe";
import { ContentDto } from "../dto/ContentDto";
import { IPostRepository } from "../interfaces/repositories/IPostRepository";
import { IContentService } from "../interfaces/services/IGetContentService";
import { IGetLinkPreviewUseCase } from "../interfaces/useCases/IGetLinkPreviewUseCase";

@injectable()
export class ContentService implements IContentService{
    constructor(
        @inject("IGetLinkPreviewUseCase") private getLinkPreviewUseCase: IGetLinkPreviewUseCase,
        @inject("IPostRepository") private postRepo: IPostRepository
    ) {
        
    }

    getTopContent = async (limit: number, offset: number, tag: string | undefined): Promise<ContentDto> => {
        let topContent: ContentDto | undefined = undefined;
        
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

    getFollowedContent = async (limit: number, offset: number, userId: number): Promise<ContentDto> => {
        let followedContent: ContentDto | undefined = undefined;
        
        const posts = await this.postRepo.getFollowedPosts(limit, offset, userId);
        await Promise.all(posts.map(async (item) => {
            const preview = await this.getLinkPreviewUseCase.execute(item.url);
            
            if (followedContent && followedContent.content) {
                followedContent.content.push({
                    post: item,
                    preview: preview
                })
            } else {
                followedContent = {
                    content: [
                        {
                            post: item,
                            preview: preview
                        }
                    ]
                }
            }
        }));

        if (!followedContent)
            followedContent = { content: [] };
        
        return followedContent;
    }
}