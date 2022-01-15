import { inject, injectable } from "tsyringe";
import { IListRepository } from "../interfaces/repositories/IListRepository";
import { IUpdateViewsUseCase } from "../interfaces/useCases/IUpdateViewsUseCase";

@injectable()
export class UpdateViewsUseCase implements IUpdateViewsUseCase {
    constructor(
        @inject("IListRepository") private listRepo: IListRepository
    ) { }

    execute = async (listId: number): Promise<void> => {
        await this.listRepo.updateViews(listId);
    }
}