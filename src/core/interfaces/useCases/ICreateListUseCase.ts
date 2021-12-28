import { CreateListDto } from "../../dto/CreateListDto";

export interface ICreateListUseCase{
    execute (listDto: CreateListDto, userId: number): Promise<void>
}