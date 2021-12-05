export type PostPatchDto = {
    patchType: PostPatchType,
    requestBody: LikeUnlike
};

export enum PostPatchType {
    Like = 1,
    Unlike = 2
};

export type LikeUnlike = {
    postId: number;
}