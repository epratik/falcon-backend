import { inject, injectable } from "tsyringe";
import express from "express";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { IConfigManager } from "../../core/interfaces/common/IConfigManager";
import { IFollowUnfollowUseCase } from "../../core/interfaces/useCases/IFollowUnfollowUseCase";
import { UserPatchDto, UserPatchDtoSchema, UserPatchType, UserPatchTypeSchema } from "../../core/dto/UserPatchDto";

@injectable()
export class UserController{
    constructor(
    @inject("ILogger") private logger: ILogger,
    @inject("IFollowUnfollowUseCase") private followUnfollowUseCase: IFollowUnfollowUseCase,
    @inject("IConfigManager") private configManager: IConfigManager) {
    }

    patch = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            const userPatchDto: UserPatchDto = UserPatchDtoSchema.parse(request.body);

            switch (userPatchDto.patchType) {
                case UserPatchTypeSchema.enum.Follow : {
                    await this.followUnfollowUseCase.execute(request.context.userId, userPatchDto.requestBody.userToFollowUnfollow, userPatchDto.patchType)
                    break;
                }
                case UserPatchTypeSchema.enum.Unfollow: {
                    await this.followUnfollowUseCase.execute(request.context.userId, userPatchDto.requestBody.userToFollowUnfollow, userPatchDto.patchType)
                    break;
                }
                default: {
                    console.log('inside break');
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