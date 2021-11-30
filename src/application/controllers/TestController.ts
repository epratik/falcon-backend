import { inject, injectable } from "tsyringe";
import express from "express";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { IGetTopContentUseCase } from "../../core/interfaces/useCases/IGetTopContentUseCase";
import { IConfigManager } from "../../core/interfaces/common/IConfigManager";

@injectable()
export class TestController {
	constructor(
		@inject("ILogger") private logger: ILogger,
		@inject("IGetTopContentUseCase") private topContentUseCase: IGetTopContentUseCase,
		@inject("IConfigManager") private configManager: IConfigManager
	) {}

	test = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			// const limit: number = request.query?.limit as unknown as number;
			const limit = await this.configManager.getContentLimit;
			let tag: string | undefined = undefined;

			const offset: number = request.query?.offset as unknown as number;
			if (request.query && request.query.tag)
				tag = request.query?.tag as unknown as string;
		
			const result = await this.topContentUseCase.execute(limit, offset, tag);
			response.send(result);

		} catch (err: any) {
			this.logger.logError(err);
			response.send(500);
		}
	};
}
