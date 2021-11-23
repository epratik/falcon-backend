
import { Constants } from "../../core/common/Constants";
import { inject, injectable } from "tsyringe";
import { ICacheManager } from "../../core/interfaces/framework/ICacheManager";
import { IConfigManager } from "../../core/interfaces/common/IConfigManager";
import { ISQLHelper } from "../../core/interfaces/framework/ISQLHelper";
import { IPostRepository } from "../../core/interfaces/repositories/IPostRepository";
import { Post } from "../../core/model/Post";

@injectable()
export class PostRepository implements IPostRepository{

    constructor(@inject("ISQLHelper") private dbHelper: ISQLHelper,
        @inject("ICacheManager") private cacheManager: ICacheManager,
        @inject("IConfigManager") private configManager:IConfigManager) {
        
    }

    getTopPosts = async (limit: number, offset: number): Promise<Post[]> => {

        let posts: Post[] = [];
        const args: any[] = [limit, offset];
       
        const result = await this.dbHelper.callFunction(Constants.fnGetTopContent, args);
          
        result.forEach((item: { [x: string]: any; }) => {
            posts.push({
                postId: item["gp_post_id"],
                listId: item["gp_list_id"],
                url: item["url"],
                urlDescription: item["url_description"],
                likes: item["action_name"]
            })
        });

        return posts;
    }
}