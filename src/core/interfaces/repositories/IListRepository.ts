import { CreateListDto } from "../../dto/CreateListDto";
import { List } from "../../model/List";

export interface IListRepository {
    getLists(userId: number): Promise<List[]>;
    updateViews(listId: number): Promise<void>;
    checkIfListExists(listId: number, userId: number): Promise<boolean>;
    checkIfListNameExists(listName: string, userId: number): Promise<number | undefined>;
    createList(listDto: CreateListDto, userId: number): Promise<number>
}