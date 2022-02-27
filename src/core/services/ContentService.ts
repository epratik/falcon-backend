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

    getTopContent = async (limit: number, offset: number, tag: string | undefined, subTag:string|undefined, userId: number|null): Promise<ContentDto> => {
        let topContent: ContentDto | undefined = undefined;
        //top content is not an actual tag name, if its top content we get all top posts.
        if (tag === 'top-content')
            tag = undefined;
        
        const posts = await this.postRepo.getTopPosts(limit, offset, tag, subTag, userId);
        await Promise.all(posts.map(async (item) => {
            // const preview = await this.getLinkPreviewUseCase.execute(item.url);
            
            if (topContent && topContent.content) {
                topContent.content.push({
                    post: item,
                    preview: {
                        title: undefined,
                        siteName: undefined,
                        images: item.imageUrl ? [item.imageUrl] : undefined
                    }
                })
            } else {
                topContent = {
                    content: [
                        {
                            post: item,
                            preview: {
                                title: undefined,
                                siteName: undefined,
                                images: item.imageUrl ? [item.imageUrl] : undefined
                            }
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
                    preview: {
                        title: undefined,
                        siteName: undefined,
                        images: item.imageUrl ? [item.imageUrl] : undefined
                    }
                })
            } else {
                followedContent = {
                    content: [
                        {
                            post: item,
                            preview: {
                                title: undefined,
                                siteName: undefined,
                                images: item.imageUrl ? [item.imageUrl] : undefined
                            }
                        }
                    ]
                }
            }
        }));

        if (!followedContent)
            followedContent = { content: [] };
        
        return followedContent;
    }

    getSharedListContent = async (limit: number, offset: number, listId: number): Promise<ContentDto> => {
        let sharedListContent: ContentDto | undefined = undefined;
        
        const posts = await this.postRepo.getSharedListPosts(limit, offset, listId);
        await Promise.all(posts.map(async (item) => {
            const preview = await this.getLinkPreviewUseCase.execute(item.url);
            
            if (sharedListContent && sharedListContent.content) {
                sharedListContent.content.push({
                    post: item,
                    preview: {
                        title: undefined,
                        siteName: undefined,
                        images: item.imageUrl ? [item.imageUrl] : undefined
                    }
                })
            } else {
                sharedListContent = {
                    content: [
                        {
                            post: item,
                            preview: {
                                title: undefined,
                                siteName: undefined,
                                images: item.imageUrl ? [item.imageUrl] : undefined
                            }
                        }
                    ]
                }
            }
        }));

        if (!sharedListContent)
            sharedListContent = { content: [] };
        
        return sharedListContent;
    }

}
