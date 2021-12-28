import { inject, injectable } from "tsyringe";
import { Constants } from "../../core/common/Constants";
import { CreateListDto } from "../../core/dto/CreateListDto";
import { ISQLHelper } from "../../core/interfaces/framework/ISQLHelper";
import { List } from "../../core/model/List";

injectable()
export class ListRepository {
    constructor(@inject('ISQLHelper') private dbHelper: ISQLHelper) {
        
    }

    getLists = async (userId: number): Promise<List[]> => {

        let lists: List[] = [];

        const args: any[] = [userId];
       
        const result = await this.dbHelper.callFunction(Constants.fnGetLists, args);
          
        result.forEach((item: { [x: string]: any; }) => {
            lists.push({
                listId: item["gp_list_id"],
                name: item["name"],
                description: item["description"],
                views: item["views"]
            })
        });

        return lists;
    }

    checkIfListExists = async (listId: number, userId: number): Promise<boolean> => {
        const args: any[] = [listId, userId];
        const result = await this.dbHelper.callFunction(Constants.fnCheckIfListExists, args);
        const item = result[0];
        return item[Object.keys(item)[0]] as boolean;
    }

    checkIfListNameExists = async (listName: string, userId: number): Promise<boolean> => {
        const args: any[] = [listName, userId];
        const result = await this.dbHelper.callFunction(Constants.fnCheckIfListNameExists, args);
        const item = result[0];
        return item[Object.keys(item)[0]] as boolean;
    }

    createList = async (listDto: CreateListDto, userId: number) => {
        const args: any[] = [listDto.name, listDto.description, userId];
        await this.dbHelper.callProcedure(Constants.procCreateList, args);
    }
}