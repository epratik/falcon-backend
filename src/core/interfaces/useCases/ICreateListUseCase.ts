import { List } from "../../model/List";

export interface ICreateListUseCase{
    execute (list: List): Promise<void>
}