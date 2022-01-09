import { injectable, inject } from "tsyringe";
import { Constants } from "../common/Constants";
import { IUserContext } from "../interfaces/common/IUserContext";
import { IListRepository } from "../interfaces/repositories/IListRepository";
import { IListValidator } from "../interfaces/validators/IListValidator";

@injectable()
export class ListValidator implements IListValidator{
    constructor(
        @inject('IListRepository') private listRepo: IListRepository) {
        
    }

    /**
     * if the list name is already present for the logged in user, then he cannot create a list with the same name.
     * @param name 
     */
    checkIfListNameExists = async (name: string, userId: number): Promise<number | undefined> => {
        return await this.listRepo.checkIfListNameExists(name, userId);
    }

    checkIfListExists = async (listId: number, userId: number): Promise<void> => {
        if (!this.listRepo.checkIfListExists(listId, userId))
            throw new Error(Constants.errorListIdDoesNotBelongToUser);
    }
}