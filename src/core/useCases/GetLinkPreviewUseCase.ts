import { injectable } from "tsyringe";
import { Post } from "../model/Post";
const linkPreviewGenerator = require("link-preview-generator");
import { Preview } from "../model/Preview";
import { IGetLinkPreviewUseCase } from "../interfaces/useCases/IGetLinkPreviewUseCase";

const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const util = require("util");
const request = util.promisify(require("request"));
const getUrls = require("get-urls");
const isBase64 = require("is-base64");


@injectable()
export class GetLinkPreviewUseCase implements IGetLinkPreviewUseCase {
    constructor(
    ) { }

    execute = async (url: string): Promise<Preview> => {
        let title = "";
        let siteName: string | undefined = "";
        let images: string[] = [];
        let favicons: string[] = [];
 
        console.log('called link preview..')

        console.log("setup puppeteer")
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
        const page = await browser.newPage();
        page.setUserAgent("facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)");
      
        await page.goto(url);
        await page.exposeFunction("request", request);
        await page.exposeFunction("urlImageIsAccessible", true);

        console.log("setup puppeteer completed")

        console.log(await this.getImg(page, url));
        await browser.close();
        console.log('image retrieved.')
        
        const linkPreview = await linkPreviewGenerator(url, ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']);
        console.log(linkPreview);

        if ("title" in linkPreview)
            title = linkPreview.title;
        if ("siteName" in linkPreview)
            siteName = linkPreview.siteName;
        if ("img" in linkPreview)
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

    getImg = async (page: any, uri: any) => {
        const img = await page.evaluate(async () => {
            //const ogImg = document.querySelector('meta[property="og:image"]');
            const img = this.getMeta('og:image')
            console.log(img)
        });
        return img;
    };

    getMeta = async (metaName: any)=> {
        const metas = document.getElementsByTagName('meta');
      
        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute('property') === metaName) {
                return metas[i].getAttribute('content');
            }
        }
      
        return '';
    }
}