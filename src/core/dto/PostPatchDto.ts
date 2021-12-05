export type PostPatchDto = {
    patchType: PostPatchType,
    requestBody: LikeUnlike
};

export enum PostPatchType {
    Like = "Like",
    Unlike = "Unlike"
};

export type LikeUnlike = {
    postId: number;
}