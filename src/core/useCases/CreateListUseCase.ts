import { inject, injectable } from "tsyringe";
import { CreateListDto } from "../dto/CreateListDto";
import { IListRepository } from "../interfaces/repositories/IListRepository";
import { ICreateListUseCase } from "../interfaces/useCases/ICreateListUseCase";

@injectable()
export class CreateListUseCase implements ICreateListUseCase {
    constructor(
        @inject("IListRepository") private listRepo: IListRepository
    ) { }

    execute = async (listDto: CreateListDto, userId: number): Promise<void> => {
        await this.listRepo.createList(listDto, userId);
    }
}