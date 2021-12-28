import { UserPatchType } from "../../dto/UserPatchDto";

export interface IFollowUnfollowUseCase{
    execute(userId: number, userIdToFollowUnfollow: number, patchType: UserPatchType): Promise<void>;
}