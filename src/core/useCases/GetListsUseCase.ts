import { inject, injectable } from "tsyringe";
import { IConfigManager } from "../interfaces/common/IConfigManager";
import { ICacheManager } from "../interfaces/framework/ICacheManager";
import { IGetListsUseCase } from "../interfaces/useCases/IGetListsUseCase";
import { List } from "../model/List";

@injectable()
export class GetListsUseCase implements IGetListsUseCase {

    constructor(
        @inject('ICacheManager') private cacheManager: ICacheManager,
        @inject('IConfigManager') private configManager: IConfigManager,
    ) {
    }

    execute = async (): Promise<List[]> => {
        return await this.cacheManager.get("lists");
    }
    
}