import { CreateListDto } from "../../dto/CreateListDto";
import { List } from "../../model/List";

export interface IListRepository {
    getLists(userId: number): Promise<List[]>;
    checkIfListExists(listId: number, userId: number): Promise<boolean>;
    checkIfListNameExists(listName: string, userId: number): Promise<boolean>;
    createList(listDto: CreateListDto, userId: number): Promise<void>
}