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
        const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
        puppeteer.use(pluginStealth());
        const page = await browser.newPage();
        page.on('console', (msg:any) => {
            for (let i = 0; i < msg.args.length; ++i)
              console.log(`${i}: ${msg.args[i]}`);
        });
        page.setUserAgent("facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)");
      
        await page.goto(url);
        console.log('wait for meta......');
        await page.waitForSelector('meta');
        console.log('meta available');
        const imgurl = await this.getImg(page, url);
        console.log(imgurl);
        await page.close();
        await browser.close();
        console.log('image retrieved.')
        
        //const linkPreview = await linkPreviewGenerator(url, ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']);
        const linkPreview:any = {};
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
            const metas = document.getElementsByTagName('meta');
            console.log('meta tags print ***')
            console.log(metas);
            for (let i = 0; i < metas.length; i++) {
                if (metas[i].getAttribute('property') == 'og:image') {
                    return metas[i].getAttribute('content');
                }
            }
            return undefined;
        });
        return img;
    };
}