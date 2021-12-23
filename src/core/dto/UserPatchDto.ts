
export enum UserPatchType {
    Follow = "Follow",
    Unfollow = "Unfollow"
};

export type UserPatchDto = {
    patchType: UserPatchType,
    requestBody: FollowUnfollow
};

export type FollowUnfollow = {
    userToFollowUnfollow: number;
    loggedInEmail: string
}
