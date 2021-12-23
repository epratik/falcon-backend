import { UserPatchType } from "../../dto/UserPatchDto";

export interface IFollowUnfollowUseCase{
    execute(loggedInUserEmail: string, userIdToFollowUnfollow: number, patchType: UserPatchType): Promise<void>;
}