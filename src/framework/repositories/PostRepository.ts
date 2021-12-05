
import { Constants } from "../../core/common/Constants";
import { inject, injectable } from "tsyringe";
import { ICacheManager } from "../../core/interfaces/framework/ICacheManager";
import { IConfigManager } from "../../core/interfaces/common/IConfigManager";
import { ISQLHelper } from "../../core/interfaces/framework/ISQLHelper";
import { IPostRepository } from "../../core/interfaces/repositories/IPostRepository";
import { Post } from "../../core/model/Post";
import { TopPostsDto } from "../../core/dto/TopPostsDto";

@injectable()
export class PostRepository implements IPostRepository {

    constructor(@inject("ISQLHelper") private dbHelper: ISQLHelper) {
        
    }

    getTopPosts = async (limit: number, offset: number, tag: string | undefined): Promise<TopPostsDto[]> => {

        let posts: TopPostsDto[] = [];
        const finalTag = (!tag || tag == '') ? null : tag;

        const args: any[] = [limit, offset, finalTag];
       
        const result = await this.dbHelper.callFunction(Constants.fnGetTopContent, args);
          
        result.forEach((item: { [x: string]: any; }) => {
            posts.push({
                postId: item["gp_post_id"],
                listId: item["gp_list_id"],
                url: item["url"],
                urlDescription: item["url_description"],
                likes: item["like"],
                userName: item["user_name"],
                date: item["utc_date"],
                listName: item["list_name"],
                userId: item["gp_user_id"]
            })
        });

        return posts;
    }

    like = async (postId: number): Promise<void> => {

        const args: any[] = [postId];
        await this.dbHelper.callProcedure(Constants.procLike, args);
    }

    unlike = async (postId: number): Promise<void> => {
        const args: any[] = [postId];
        await this.dbHelper.callProcedure(Constants.procUnlike, args);
    }

    follow = async (email: string, userToFollow: number): Promise<void> => {
        const args: any[] = [email, userToFollow];
        await this.dbHelper.callProcedure(Constants.procFollow, args);
    }

    unfollow = async (email: string, userToUnfollow: number): Promise<void> => {
        const args: any[] = [email, userToUnfollow];
        await this.dbHelper.callProcedure(Constants.procUnfollow, args);
    }
}