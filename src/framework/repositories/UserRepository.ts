import { inject, injectable } from "tsyringe";
import { Constants } from "../../core/common/Constants";
import { ISQLHelper } from "../../core/interfaces/framework/ISQLHelper";
import { IUserRepository } from "../../core/interfaces/repositories/IUserRepository";


injectable()
export class UserRepository implements IUserRepository{
    constructor(@inject('ISQLHelper') private dbHelper:ISQLHelper) {
    }

    follow = async (email: string, userToFollow: number): Promise<void> => {
        const args: any[] = [email, userToFollow];
        await this.dbHelper.callProcedure(Constants.procFollow, args);
    }

    unfollow = async (email: string, userToUnfollow: number): Promise<void> => {
        const args: any[] = [email, userToUnfollow];
        await this.dbHelper.callProcedure(Constants.procUnfollow, args);
    }
}