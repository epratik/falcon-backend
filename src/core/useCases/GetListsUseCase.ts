import { inject, injectable } from "tsyringe";
import { IListRepository } from "../interfaces/repositories/IListRepository";
import { IGetListsUseCase } from "../interfaces/useCases/IGetListsUseCase";
import { List } from "../model/List";

@injectable()
export class GetListsUseCase implements IGetListsUseCase {

    constructor(@inject('IListRepository') private listRepo: IListRepository) {
    }

    execute = async (userId: number): Promise<List[]> => {
        return await this.listRepo.getLists(userId);
    }
    
}