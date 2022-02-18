import { injectable } from "tsyringe";
import { Post } from "../model/Post";
const linkPreviewGenerator = require("link-preview-generator");
import { Preview } from "../model/Preview";
import { IGetLinkPreviewUseCase } from "../interfaces/useCases/IGetLinkPreviewUseCase";


@injectable()
export class GetLinkPreviewUseCase implements IGetLinkPreviewUseCase {
    constructor(
    ) { }

    execute = async (url: string): Promise<Preview> => {
        let title = "";
        let siteName: string | undefined = "";
        let images: string[] = [];
        let favicons: string[] = [];
 
        const linkPreview = await linkPreviewGenerator(url, ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']);

        console.log(linkPreview);

        if ("title" in linkPreview)
            title = linkPreview.title;
        if ("siteName" in linkPreview)
            siteName = linkPreview.siteName;
        if ("images" in linkPreview)
            images = [linkPreview.img];
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