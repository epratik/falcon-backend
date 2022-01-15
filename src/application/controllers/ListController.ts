import express from "express";
import { inject, injectable } from "tsyringe";
import { CreateListDto, CreateListDtoSchema } from "../../core/dto/CreateListDto";
import { ListPatchDto, ListPatchDtoSchema, ListPatchTypeSchema } from "../../core/dto/ListPatchDto";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { ICreateListUseCase } from "../../core/interfaces/useCases/ICreateListUseCase";
import { IGetListsUseCase } from "../../core/interfaces/useCases/IGetListsUseCase";
import { IUpdateViewsUseCase } from "../../core/interfaces/useCases/IUpdateViewsUseCase";
import { IListValidator } from "../../core/interfaces/validators/IListValidator";

@injectable()
export class ListController {
    constructor(
        @inject("ILogger") private logger: ILogger,
        @inject("IListValidator") private listValidator: IListValidator,
        @inject("IGetListsUseCase") private getListsUseCase: IGetListsUseCase,
        @inject("ICreateListUseCase") private createListUseCase: ICreateListUseCase,
        @inject("IUpdateViewsUseCase") private updateViewsUseCase: IUpdateViewsUseCase
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
                return response.status(201).send({ value: listId });
            
            listId = await this.createListUseCase.execute(createListDto, request.context.userId);
            response.status(201).send({ value: listId });
        } catch (err: any) {
            this.logger.logError(err);
            response.send(500);
        }
    }

    patch = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			const listPatchDto: ListPatchDto = ListPatchDtoSchema.parse(request.body);

			switch (listPatchDto.patchType) {
				case ListPatchTypeSchema.enum.Views : {
                    await this.updateViewsUseCase.execute(listPatchDto.requestBody.listId);
					break;
				}
				default: {
					break;
				}
			}

			response.send(204);

		} catch (err: any) {
			this.logger.logError(err);
			response.send(500);
		}
	}
}