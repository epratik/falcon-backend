import { inject, injectable } from "tsyringe";
import express from "express";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { IGetTopContentUseCase } from "../../core/interfaces/useCases/IGetTopContentUseCase";
import { IConfigManager } from "../../core/interfaces/common/IConfigManager";
import { PostPatchDto, PostPatchTypeSchema, PostPatchDtoSchema } from "../../core/dto/PostPatchDto";
import { ILikeUnlikeUseCase } from "../../core/interfaces/useCases/ILikeUnlikeUseCase";
import { IPostDeactivateUseCase } from "../../core/interfaces/useCases/IPostDeactivateUseCase";
import { IPostValidator } from "../../core/interfaces/validators/IPostValidator";

@injectable()
export class PostController {
	constructor(
		@inject("ILogger") private logger: ILogger,
		@inject("IGetTopContentUseCase") private topContentUseCase: IGetTopContentUseCase,
		@inject("ILikeUnlikeUseCase") private likeUnlikeUseCase: ILikeUnlikeUseCase,
		@inject("IPostDeactivateUseCase") private postDeactivateUseCase: IPostDeactivateUseCase,
		@inject("IConfigManager") private configManager: IConfigManager,
		@inject("IPostValidator") private postValidator: IPostValidator
	) { }

	get = async (request: express.Request, response: express.Response): Promise<any> => {
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

	patch = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			const body: PostPatchDto = PostPatchDtoSchema.parse(request.body);

			switch (body.patchType) {
				case PostPatchTypeSchema.enum.Like || PostPatchTypeSchema.enum.Unlike: {
					await this.likeUnlikeUseCase.execute(body.requestBody.postId, body.patchType)
					break;
				}
				case PostPatchTypeSchema.enum.Deactivate: {
					await this.postValidator.checkIfPostBelongsToUser(body.requestBody.postId, request.context.userId);
					await this.postDeactivateUseCase.execute(body.requestBody.postId)
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
