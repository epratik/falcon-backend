import { injectable } from "tsyringe";
import { Preview } from "../model/Preview";
import { IGetLinkPreviewUseCase } from "../interfaces/useCases/IGetLinkPreviewUseCase";

const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");

@injectable()
export class GetLinkPreviewUseCase implements IGetLinkPreviewUseCase {
    browser: any = undefined;

    constructor(
    ) { 
        console.log('creating browser instance...')
        puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] }).then((obj: any) => {
            this.browser = obj;
        });
        puppeteer.use(pluginStealth());
        console.log('browser instance ready...')
    }

    execute = async (url: string): Promise<Preview> => {

        try {

            let title = "";
            let siteName: string | undefined = "";
            let images: string[] = [];
            let favicons: string[] = [];

            const page = await this.browser.newPage();
            page.setUserAgent("facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)");
            await page.goto(url);
            await page.waitForSelector('meta');
            let imgurl = await this.getImg(page, url);            
            await page.close();

            // const linkPreview: any = {};
            // if ("title" in linkPreview)
            //     title = linkPreview.title;
            // if ("siteName" in linkPreview)
            //     siteName = linkPreview.siteName;
            // if ("img" in linkPreview)
            //     images = [imgurl];
            // if ("favicons" in linkPreview)
            //     favicons = linkPreview.favicons;
            
            const preview: Preview = {
                title: title,
                siteName: siteName,
                images: [imgurl]
            }

            return preview;
        }
        catch (err) {
            if (this.browser)
                await this.browser.close();
            throw err;
        }
    }

    getImg = async (page: any, uri: any) => {

        const img = await page.evaluate(async () => {
            const metas = document.getElementsByTagName('meta');
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