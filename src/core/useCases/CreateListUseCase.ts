import { inject, injectable } from "tsyringe";
import { IConfigManager } from "../interfaces/common/IConfigManager";
import { ICacheManager } from "../interfaces/framework/ICacheManager";
import { ICreateListUseCase } from "../interfaces/useCases/ICreateListUseCase";
import { List } from "../model/List";

@injectable()
export class CreateListUseCase implements ICreateListUseCase {
    constructor(
        @inject('ICacheManager') private cacheManager: ICacheManager,
        @inject('IConfigManager') private configManager: IConfigManager,
    ) { }

    execute = async (list: List): Promise<void> => {
        let savedLists: List[] = await this.cacheManager.get("lists"); 
        if (!savedLists) {
            savedLists = [];
            savedLists.push(list);
        } else {
            savedLists.push(list);
        }
        await this.cacheManager.put<List[]>("lists", savedLists, 60);
    }
}