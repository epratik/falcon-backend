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
            let listId: number | undefined = undefined;

            //return 409 conflict if it exists along with the Id.
            listId = await this.listValidator.checkIfListNameExists(createListDto.name, request.context.userId);
            if (listId)
                response.status(409).send(listId);
            
            listId = await this.createListUseCase.execute(createListDto, request.context.userId);
            response.status(201).send(listId);
        } catch (err: any) {
            this.logger.logError(err);
            response.send(500);
        }
    }
}