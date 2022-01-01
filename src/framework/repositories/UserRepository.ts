import { inject, injectable } from "tsyringe";
import { Constants } from "../../core/common/Constants";
import { ISQLHelper } from "../../core/interfaces/framework/ISQLHelper";
import { IUserRepository } from "../../core/interfaces/repositories/IUserRepository";


@injectable()
export class UserRepository implements IUserRepository{
    constructor(@inject('ISQLHelper') private dbHelper:ISQLHelper) {
    }

    follow = async (userId: number, userToFollow: number): Promise<void> => {
        const args: any[] = [userId, userToFollow];
        await this.dbHelper.callProcedure(Constants.procFollow, args);
    }

    unfollow = async (userId: number, userToUnfollow: number): Promise<void> => {
        const args: any[] = [userId, userToUnfollow];
        await this.dbHelper.callProcedure(Constants.procUnfollow, args);
    }
}