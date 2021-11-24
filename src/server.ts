import express from "express";

import { Request, Response } from "express";
import http from "http";
import "reflect-metadata";
import dotenv from "dotenv";
import { container } from "tsyringe";
import { ConfigManager } from "./core/common/ConfigManager";
import { AwsHelper } from "./framework/util/AwsHelper";
import { AxiosHttpClient } from "./framework/util/AxiosHttpClient";
import { CacheManager } from "./framework/util/CacheManager";
import { SQLHelper } from "./framework/util/SQLHelper";
import { WinstonLogger } from "./framework/util/WinstonLogger";
import { TokenVerifier } from "./framework/util/TokenVerifier";
import { AuthorizationMiddleware } from "./application/middleware/AuthorizationMiddleware";
import { Constants } from "./core/common/Constants";
import { IRouter } from "./application/routes/IRouter";
import { TestRouter } from "./application/routes/TestRouter";
import { GetLinkPreviewUseCase } from "./core/useCases/GetLinkPreviewUseCase";
import { PostRepository } from "./framework/repositories/PostRepository";
import { GetTopContentUseCase } from "./core/useCases/GetTopContentUseCase";

if (process.env.NODE_ENV === "local") {
	//if run on local system use settings from .env file.
	dotenv.config(); //This will use the local .env file.
	process.env.NODE_ENV = "dev";
}

//Common registries
container.registerSingleton("IAwsHelper", AwsHelper);
container.registerSingleton("IHttpClient", AxiosHttpClient);
container.registerSingleton("ICacheManager", CacheManager);
container.registerSingleton("IConfigManager", ConfigManager);
//use SQLHelperLocal for local development using a ssh tunnel. Cannot connect to AWS RDS directly from local.
//you need to update the SQLHelperLocal file with connection details before use.
//you can also use SQLHelperMock if you do not want to connect to the database.
container.registerSingleton("ISQLHelper", SQLHelper);
container.registerSingleton("ILogger", WinstonLogger);

container.registerInstance("IGetLinkPreviewUseCase", GetLinkPreviewUseCase);
container.registerInstance("IPostRepository", PostRepository);
container.registerInstance("IGetTopContentUseCase", GetTopContentUseCase);

//Factory and use case registories
const tokenVerifier: TokenVerifier = container.resolve(TokenVerifier);
const logger: WinstonLogger = container.resolve(WinstonLogger);

const host = "0.0.0.0";
const port = Number(process.env.HTTP_PORT);

const authMiddleware = new AuthorizationMiddleware(tokenVerifier, logger);

const router = express.Router();
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<IRouter> = [];
//modify response

//Setup and initialize all routes
routes.push(new TestRouter(router));

app.use(express.json());
app.use(authMiddleware.authorize);
app.use("/" + Constants.apiPrefix, router);
routes.forEach((router: IRouter) => {
	router.initializeRoutes();
});

router.get("/", function (req, res) {
	res.sendStatus(200);
});

server.listen(port, host);
console.log("Service started on port " + port);
