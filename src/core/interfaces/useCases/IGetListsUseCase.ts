import { List } from "../../model/List";

export interface IGetListsUseCase {
    execute(): Promise<List[]>;
}