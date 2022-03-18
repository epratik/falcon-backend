import express from "express";
import { inject, injectable } from "tsyringe";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { ICreateListUseCase } from "../../core/interfaces/useCases/ICreateListUseCase";
import { IGetListsUseCase } from "../../core/interfaces/useCases/IGetListsUseCase";
import { List } from "../../core/model/List";

@injectable()
export class ListController {
    constructor(
        @inject("ILogger") private logger: ILogger,
        @inject("IGetListsUseCase") private getListsUseCase: IGetListsUseCase,
        @inject("ICreateListUseCase") private createListUseCase: ICreateListUseCase,
    ) {
    }

    get = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            response.send(await this.getListsUseCase.execute());
        } catch (err: any) {
            this.logger.logError(err);
            response.send(500);
        }
    }

    post = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            await this.createListUseCase.execute(request.body as List);
            response.status(201);
        } catch (err: any) {
            this.logger.logError(err);
            response.send(500);
        }
    }

}