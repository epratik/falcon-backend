import { inject, injectable } from "tsyringe";
import { UserPatchType } from "../dto/UserPatchDto";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";

injectable()
export class FollowUnfollowUseCase {
    constructor(@inject('IUserRepository') private userRepo: IUserRepository) {
        
    }

    execute = async (userId: number, userIdToFollowUnfollow: number, patchType: UserPatchType): Promise<void> => {
        if (patchType === UserPatchType.Follow)
            await this.userRepo.follow(userId, userIdToFollowUnfollow);
        else
            await this.userRepo.unfollow(userId, userIdToFollowUnfollow);
    }
}