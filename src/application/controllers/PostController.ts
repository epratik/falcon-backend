import { inject, injectable } from "tsyringe";
import express from "express";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { IGetTopContentUseCase } from "../../core/interfaces/useCases/IGetTopContentUseCase";
import { IConfigManager } from "../../core/interfaces/common/IConfigManager";
import { PostPatchType, PostPatchDto } from "../../core/dto/PostPatchDto";
import { ILikeUnlikeUseCase } from "../../core/interfaces/useCases/ILikeUnlikeUseCase";

@injectable()
export class PostController {
	constructor(
		@inject("ILogger") private logger: ILogger,
		@inject("IGetTopContentUseCase") private topContentUseCase: IGetTopContentUseCase,
		@inject("ILikeUnlikeUseCase") private likeUnlikeUseCase: ILikeUnlikeUseCase,
		@inject("IConfigManager") private configManager: IConfigManager
	) { }

	get = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			// const limit: number = request.query?.limit as unknown as number;
			console.log('*******************')
			console.log(request.context.userId)
			console.log(request.context.email)
			
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

	patch = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			const body = request.body as PostPatchDto;
			switch (body.patchType) {
				case PostPatchType.Like || PostPatchType.Unlike: {
					this.likeUnlikeUseCase.execute(body.requestBody.postId, body.patchType)
					break;
				}
				default: {
					break;
				}
			}

			response.send(200);

		} catch (err: any) {
			this.logger.logError(err);
			response.send(500);
		}
	}
}
