import { inject, injectable } from "tsyringe";
import express from "express";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { IConfigManager } from "../../core/interfaces/common/IConfigManager";
import { IFollowUnfollowUseCase } from "../../core/interfaces/useCases/IFollowUnfollowUseCase";
import { UserPatchDto, UserPatchType } from "../../core/dto/UserPatchDto";

injectable()
export class UserController{
    constructor(
    @inject("ILogger") private logger: ILogger,
    @inject("IFollowUnfollowUseCase") private followUnfollowUseCase: IFollowUnfollowUseCase,
    @inject("IConfigManager") private configManager: IConfigManager) {
    }

    patch = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            const body = request.body as UserPatchDto;
            switch (body.patchType) {
                case UserPatchType.Follow || UserPatchType.Unfollow: {
                    this.followUnfollowUseCase.execute(body.requestBody.loggedInEmail, body.requestBody.userToFollowUnfollow, body.patchType)
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