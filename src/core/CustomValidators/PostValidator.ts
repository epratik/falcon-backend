import { injectable, inject } from "tsyringe";
import { Constants } from "../common/Constants";
import { IUserContext } from "../interfaces/common/IUserContext";
import { IPostRepository } from "../interfaces/repositories/IPostRepository";

@injectable()
export class PostValidator {
    constructor(
        @inject('IPostRepository') private postRepo: IPostRepository,
        @inject("IUserContext") private context: IUserContext) {
        
    }

    checkIfPostBelongsToUser = async (postId: number, userId: number): Promise<void> => {
        if (!await this.postRepo.checkIfPostBelongsToUser(postId, userId))
            throw Error(Constants.errorPostDoesNotBelongToUser);
    }
}