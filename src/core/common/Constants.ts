export abstract class Constants {
    static devEnviroment = "development";
    static prodEnviroment = "production";
    static projectName = "gp";
    static serviceConfigName = "serviceConfig";
    static separator = "/";
    static region = "app.region";
    static paramStoreAPIVersion = "2014-11-06";
    static secretStoreAPIVersion = "2017-10-17";
    static rekognitionAPIVerion = "2016-06-27";
    static loggerName = "nodejsLogger";
    static apiPrefix = "api";
    static fnGetTopContent = "fnGetTopContent"
    static fnGetFollowedContent = "fnGetFollowedContent"
    static fnCheckIfPostBelongsToUser = "fnCheckIfPostBelongsToUser";
    static fnCheckIfListExists = "fnCheckIfListExists";
    static fnCheckIfListNameExists = "fnCheckIfListNameExists";
    static fnGetLists = "fnGetLists";
    static fnGetPosts = "fnGetPosts";
    static procUpdateViews = "spUpdateViews";
    static procLike = "spLike"
    static procUnlike = "spUnlike"
    static procFollow = "spFollow"
    static procUnfollow = "spUnfollow"
    static procCreateList = "spCreateList"
    static procCreatePost = "spCreatePost"
    static procDeletePost ="spDeactivatePost"

    static errorPostDoesNotBelongToUser = "Post does not belong to the logged in user."
    static errorListNameAlreadyExists = "List name already exists. Please choose a different name."
    static errorListIdDoesNotBelongToUser = "List id does not belong to the logged in user."
    
    static getServiceConfigPath(): string {
        return this.separator + this.projectName + this.separator + process.env.NODE_ENV +
            this.separator + this.serviceConfigName
    }
}