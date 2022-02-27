import { inject, injectable } from "tsyringe";
import express from "express";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { IConfigManager } from "../../core/interfaces/common/IConfigManager";
import { PostPatchDto, PostPatchTypeSchema, PostPatchDtoSchema } from "../../core/dto/PostPatchDto";
import { ILikeUnlikeUseCase } from "../../core/interfaces/useCases/ILikeUnlikeUseCase";
import { IPostDeactivateUseCase } from "../../core/interfaces/useCases/IPostDeactivateUseCase";
import { IPostValidator } from "../../core/interfaces/validators/IPostValidator";
import { IGetPostsUseCase } from "../../core/interfaces/useCases/IGetPostsUseCase";
import { ICreatePostUseCase } from "../../core/interfaces/useCases/ICreatePostUseCase";
import { CreatePostDto, CreatePostDtoSchema } from "../../core/dto/CreatePostDto";
import { IListValidator } from "../../core/interfaces/validators/IListValidator";
import { IContentService } from "../../core/interfaces/services/IGetContentService";
import { IListRepository } from "../../core/interfaces/repositories/IListRepository";

@injectable()
export class PostController {
	constructor(
		@inject("ILogger") private logger: ILogger,
		@inject("IContentService") private contentService: IContentService,
		@inject("ILikeUnlikeUseCase") private likeUnlikeUseCase: ILikeUnlikeUseCase,
		@inject("IPostDeactivateUseCase") private postDeactivateUseCase: IPostDeactivateUseCase,
		@inject("IConfigManager") private configManager: IConfigManager,
		@inject("IPostValidator") private postValidator: IPostValidator,
		@inject("IListValidator") private listValidator: IListValidator,
		@inject("IGetPostsUseCase") private getPostUseCase: IGetPostsUseCase,
		@inject("ICreatePostUseCase") private createPostUseCase: ICreatePostUseCase
	) { }

	getTopPosts = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			// const limit: number = request.query?.limit as unknown as number;	
			const limit = await this.configManager.getContentLimit;
			let tag: string | undefined = undefined;
			let subTag: string | undefined = undefined;
			let userId: number | null = null;

			const offset: number = request.query?.offset as unknown as number;
			if (request.query && request.query.tag)
				tag = request.query?.tag as unknown as string;

			if (request.query && request.query.subTag)
				subTag = request.query?.subTag as unknown as string;
			
			if (request.context && request.context.userId)
				userId = request.context.userId;
			
			const result = await this.contentService.getTopContent(limit, offset, tag, subTag, userId);
			response.send(result);

		} catch (err: any) {
			this.logger.logError(err);
			response.send(500);
		}
	};

	getFollowedPosts = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			// const limit: number = request.query?.limit as unknown as number;	
			const limit = await this.configManager.getContentLimit;
			let tag: string | undefined = undefined;

			const offset: number = request.query?.offset as unknown as number;
			if (request.query && request.query.tag)
				tag = request.query?.tag as unknown as string;

			const result = await this.contentService.getFollowedContent(limit, offset, request.context.userId);
			response.send(result);

		} catch (err: any) {
			this.logger.logError(err);
			response.send(500);
		}
	};

	getPostsForAList = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			
			const listId: number = request.params?.id as unknown as number;
			const result = await this.getPostUseCase.execute(listId);
			response.send(result);

		} catch (err: any) {
			this.logger.logError(err);
			response.send(500);
		}
	};

	getPostsForASharedList = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			// const limit: number = request.query?.limit as unknown as number;	
			const limit = await this.configManager.getContentLimit;
			
			const offset: number = request.query?.offset as unknown as number;
			const listId: number = request.params?.id as unknown as number;

			const result = await this.contentService.getSharedListContent(limit, offset, listId);
			response.send(result);

		} catch (err: any) {
			this.logger.logError(err);
			response.send(500);
		}
	};

	patch = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			const postPatchDto: PostPatchDto = PostPatchDtoSchema.parse(request.body);

			switch (postPatchDto.patchType) {
				case PostPatchTypeSchema.enum.Like : {
					await this.likeUnlikeUseCase.execute(postPatchDto.requestBody.postId, postPatchDto.patchType, request.context.userId);
					break;
				}
				case PostPatchTypeSchema.enum.Unlike: {
					await this.likeUnlikeUseCase.execute(postPatchDto.requestBody.postId, postPatchDto.patchType, request.context.userId);
					break;
				}
				case PostPatchTypeSchema.enum.Deactivate: {
					await this.postValidator.checkIfPostBelongsToUser(postPatchDto.requestBody.postId, request.context.userId);
					await this.postDeactivateUseCase.execute(postPatchDto.requestBody.postId)
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

	post = async (request: express.Request, response: express.Response): Promise<any> => {
		try {
			const createPostDto: CreatePostDto = CreatePostDtoSchema.parse(request.body);
			await this.listValidator.checkIfListExists(createPostDto.listId, request.context.userId);
			await this.createPostUseCase.execute(createPostDto);

			return response.send(201);
		}
		catch (err) {
			this.logger.logError(err);
			response.send(500);
		}
	}
}
