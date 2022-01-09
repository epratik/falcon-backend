import { ContentDto } from "../../dto/ContentDto";

export interface IContentService{
    getTopContent(limit: number, offset: number, tag: string | undefined, subTag: string | undefined): Promise<ContentDto>;
    getFollowedContent(limit: number, offset: number, userId: number): Promise<ContentDto>
}