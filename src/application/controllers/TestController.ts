import { inject, injectable } from "tsyringe";
import express from "express";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { IGetTopContentUseCase } from "../../core/interfaces/useCases/IGetTopContentUseCase";

@injectable()
export class TestController {
	constructor(
		@inject("ILogger") private logger: ILogger,
		@inject("IGetTopContentUseCase") private topContentUseCase: IGetTopContentUseCase
	) {}

	test = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			const limit: number = request.query?.limit as unknown as number;
			const offset: number = request.query?.offset as unknown as number;
			const result = await this.topContentUseCase.execute(limit, offset);
			response.send(result);

		} catch (err: any) {
			this.logger.logError(err);
			response.send(500);
		}
	};
}
