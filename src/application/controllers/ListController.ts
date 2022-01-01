import express from "express";
import { inject, injectable } from "tsyringe";
import { CreateListDto, CreateListDtoSchema } from "../../core/dto/CreateListDto";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { ICreateListUseCase } from "../../core/interfaces/useCases/ICreateListUseCase";
import { IGetListsUseCase } from "../../core/interfaces/useCases/IGetListsUseCase";
import { IListValidator } from "../../core/interfaces/validators/IListValidator";

@injectable()
export class ListController {
    constructor(
        @inject("ILogger") private logger: ILogger,
        @inject("IListValidator") private listValidator: IListValidator,
        @inject("IGetListsUseCase") private getListsUseCase: IGetListsUseCase,
        @inject("ICreateListUseCase") private createListUseCase: ICreateListUseCase
    ) {
    }

    get = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            response.send(await this.getListsUseCase.execute(request.context.userId));
        } catch (err: any) {
            this.logger.logError(err);
            response.send(500);
        }
    }

    post = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            const createListDto: CreateListDto = CreateListDtoSchema.parse(request.body);
            await this.listValidator.checkIfListNameExists(createListDto.name, request.context.userId);
            await this.createListUseCase.execute(createListDto, request.context.userId);
            response.send(201);
        } catch (err: any) {
            this.logger.logError(err);
            response.send(500);
        }
    }
}