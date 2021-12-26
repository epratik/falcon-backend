// import { Context, UnauthorizedError, ForbiddenError } from "@zode/zode";
import express from "express";
import { inject, injectable } from "tsyringe";
// import { ErrorHandler } from "../../core/common/ErrorHandler";
import { ILogger } from "../../core/interfaces/framework/ILogger";
import { ITokenVerifier } from "../../core/interfaces/framework/ITokenVerifier";

injectable();
export class AuthorizationMiddleware {
	constructor(
		@inject("ITokenVerifier") private tokenVerifier: ITokenVerifier,
		@inject("ILogger") private logger: ILogger
	) {}

	/**
	 * Verify token and authorize user.
	 * Skip health check /api and dynamic log level /api/Settings/LogLevel paths from authorization.
	 * @param req
	 * @param res
	 * @param next
	 */
	authorize = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
		let isAuthorized: boolean = false;

        if (request.path === "/api")
            isAuthorized = true;
		//for health check of the endpoint
		else if (request.headers.authorization) {
			try {
				
				const payload = await this.tokenVerifier.verify(request.headers.authorization);
				request.context = {
					email: payload.email,
					userId: payload.userId
				};
				isAuthorized = true;

			} catch (err) {
				this.logger.logError(err);
				response.status(403).send(); //Token malformed or expired.
			}
		} else response.status(401).send(); //No auth header, you are not authenticated.

		if (isAuthorized) 
            await next();
		else
			response.status(403).send();
	};
}
