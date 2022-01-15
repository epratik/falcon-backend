import { Constants } from "../../core/common/Constants";
import { inject, injectable } from "tsyringe";
import { ISQLHelper } from "../../core/interfaces/framework/ISQLHelper";
import { IPostRepository } from "../../core/interfaces/repositories/IPostRepository";
import { ViewPostsDto } from "../../core/dto/ViewPostsDto";
import { Post } from "../../core/model/Post";
import { CreatePostDto } from "../../core/dto/CreatePostDto";

@injectable()
export class PostRepository implements IPostRepository {

    constructor(@inject("ISQLHelper") private dbHelper: ISQLHelper) {
        
    }

    getTopPosts = async (limit: number, offset: number, tag: string | undefined, subTag: string | undefined): Promise<ViewPostsDto[]> => {

        let posts: ViewPostsDto[] = [];
        const finalTag = (!tag || tag == '') ? null : tag;
        const finalSubTag = (!subTag || subTag == '') ? null : subTag;

        const args: any[] = [limit, offset, finalTag, finalSubTag];
       
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

    getFollowedPosts = async (limit: number, offset: number, userId:number): Promise<ViewPostsDto[]> => {

        let posts: ViewPostsDto[] = [];

        const args: any[] = [limit, offset, userId];
       
        const result = await this.dbHelper.callFunction(Constants.fnGetFollowedContent, args);
          
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
                subTag: item["sub_tag"],
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

    checkIfPostBelongsToUser = async (postId: number, userId: number): Promise<boolean> => {
        const args: any[] = [postId, userId];
        const result = await this.dbHelper.callFunction(Constants.fnCheckIfPostBelongsToUser, args);
        const item = result[0];
        return item[Object.keys(item)[0]] as boolean;
    }

    createPost = async (postDto: CreatePostDto) => {
        const args: any[] = [postDto.tag, postDto.url, postDto.urlDescription, postDto.listId];
        await this.dbHelper.callProcedure(Constants.procCreatePost, args);
    }

    deactivatePost = async (postId: number) => {
        const args: any[] = [postId];
        await this.dbHelper.callProcedure(Constants.procDeletePost, args);
    }
}