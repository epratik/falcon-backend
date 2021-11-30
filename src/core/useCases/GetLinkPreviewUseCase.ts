import { injectable } from "tsyringe";
import { Post } from "../model/Post";
import { getLinkPreview } from "link-preview-js";
import { Preview } from "../model/Preview";
import { IGetLinkPreviewUseCase } from "../interfaces/useCases/IGetLinkPreviewUseCase";


@injectable()
export class GetLinkPreviewUseCase implements IGetLinkPreviewUseCase {
    constructor(
    ) { }

    execute = async (post: Post): Promise<Preview> => {
        let title = "";
        let siteName: string | undefined = "";
        let images: string[] = [];
        let favicons: string[] = [];
 
        const linkPreview = await getLinkPreview(post.url);

        if ("title" in linkPreview)
            title = linkPreview.title;
        if ("siteName" in linkPreview)
            siteName = linkPreview.siteName;
        if ("images" in linkPreview)
            images = linkPreview.images;
        if ("favicons" in linkPreview)
            favicons = linkPreview.favicons;
            
        const preview: Preview = {
            title: title,
            siteName: siteName,
            images: images
        }

        return preview;
    }
}