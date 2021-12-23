import { Constants } from "../../core/common/Constants";
import { inject, injectable } from "tsyringe";
import { ISQLHelper } from "../../core/interfaces/framework/ISQLHelper";
import { IPostRepository } from "../../core/interfaces/repositories/IPostRepository";
import { TopPostsDto } from "../../core/dto/TopPostsDto";
import { Post } from "../../core/model/Post";

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

    getPosts = async (listId:number): Promise<Post[]> => {

        let posts: Post[] = [];

        const args: any[] = [listId];
       
        const result = await this.dbHelper.callFunction(Constants.fnGetPosts, args);
          
        result.forEach((item: { [x: string]: any; }) => {
            posts.push({
                listId: listId,
                postId: item["gp_post_id"],
                tag: item["tag"],
                url: item["url"],
                urlDescription: item["url_description"],
                likes: item["likes"]
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

    checkIfPostBelongsToUser = async (postId: number, emailAddress: string): Promise<boolean> => {
        const args: any[] = [postId, emailAddress];
        const result = await this.dbHelper.callFunction(Constants.fnGetTopContent, args);
        return result[0] as boolean;
    }
}