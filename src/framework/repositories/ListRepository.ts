import { inject, injectable } from "tsyringe";
import { Constants } from "../../core/common/Constants";
import { ISQLHelper } from "../../core/interfaces/framework/ISQLHelper";
import { List } from "../../core/model/List";

injectable()
export class ListRepository {
    constructor(@inject('ISQLHelper') private dbHelper: ISQLHelper) {
        
    }

    getLists = async (emailAddress:string): Promise<List[]> => {

        let lists: List[] = [];

        const args: any[] = [emailAddress];
       
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

    checkIfListExists = async (listId: number, emailAddress: string): Promise<boolean> => {
        const args: any[] = [listId, emailAddress];
        const result = await this.dbHelper.callFunction(Constants.fnCheckIfListExists, args);
        return result[0] as boolean;
    }

    checkIfListNameExists = async (listName: string, emailAddress: string): Promise<boolean> => {
        const args: any[] = [listName, emailAddress];
        const result = await this.dbHelper.callFunction(Constants.fnCheckIfListNameExists, args);
        return result[0] as boolean;
    }
}