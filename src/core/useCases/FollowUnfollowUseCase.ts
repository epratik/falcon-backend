import { inject, injectable } from "tsyringe";
import { UserPatchType } from "../dto/UserPatchDto";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";

injectable()
export class FollowUnfollowUseCase {
    constructor(@inject('IUserRepository') private userRepo: IUserRepository) {
        
    }

    execute = async (loggedInUserEmail: string, userIdToFollowUnfollow: number, patchType: UserPatchType): Promise<void> => {
        if (patchType === UserPatchType.Follow)
            await this.userRepo.follow(loggedInUserEmail, userIdToFollowUnfollow);
        else
            await this.userRepo.unfollow(loggedInUserEmail, userIdToFollowUnfollow);
    }
}