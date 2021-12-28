import { List } from "../../model/List";

export interface IGetListsUseCase {
    execute(userId: number): Promise<List[]>;
}