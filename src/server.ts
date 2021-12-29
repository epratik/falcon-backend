import express from "express";
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
import { PostRouter } from "./application/routes/PostRouter";
import { GetLinkPreviewUseCase } from "./core/useCases/GetLinkPreviewUseCase";
import { PostRepository } from "./framework/repositories/PostRepository";
import { GetTopContentUseCase } from "./core/useCases/GetTopContentUseCase";
import { PostController } from "./application/controllers/PostController";
import { LikeUnlikeUseCase } from "./core/useCases/LikeUnlikeUseCase";
import { CorsMiddleware } from "./application/middleware/CorsMiddleware";
import { UserContext } from "./core/model/UserContext";
import { UserRepository } from "./framework/repositories/UserRepository";
import { ListRepository } from "./framework/repositories/ListRepository";
import { CreateListUseCase } from "./core/useCases/CreateListUseCase";
import { CreatePostUseCase } from "./core/useCases/CreatePostUseCase";
import { FollowUnfollowUseCase } from "./core/useCases/FollowUnfollowUseCase";
import { GetListsUseCase } from "./core/useCases/GetListsUseCase";
import { GetPostsUseCase } from "./core/useCases/GetPostsUseCase";
import { PostDeactivateUseCase } from "./core/useCases/PostDeactivateUseCase";
import { ListValidator } from "./core/CustomValidators/ListValidator";
import { PostValidator } from "./core/CustomValidators/PostValidator";
import { ListController } from "./application/controllers/ListController";
import { UserController } from "./application/controllers/UserController";
import { ListRouter } from "./application/routes/ListRouter";
import { UserRouter } from "./application/routes/UserRouter";

console.log('printing node_env')
console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === "local") {
	console.log('setting node env to dev')
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
container.registerSingleton("IPostRepository", PostRepository);
container.registerSingleton("IUserRepository", UserRepository);
container.registerSingleton("IListRepository", ListRepository);

container.register("PostController", PostController);
container.register("ListController", ListController);
container.register("UserController", UserController);

container.register("IGetLinkPreviewUseCase", GetLinkPreviewUseCase);
container.register("IGetTopContentUseCase", GetTopContentUseCase);
container.register("ILikeUnlikeUseCase", LikeUnlikeUseCase);
container.register("ICreateListUseCase", CreateListUseCase);
container.register("ICreatePostUseCase", CreatePostUseCase);
container.register("IFollowUnfollowUseCase",FollowUnfollowUseCase);
container.register("IGetListsUseCase",GetListsUseCase);
container.register("IGetPostsUseCase", GetPostsUseCase);
container.register("IPostDeactivateUseCase", PostDeactivateUseCase);

container.register("IUserContext", UserContext);
container.register("IListValidator", ListValidator);
container.register("IPostValidator", PostValidator);

//Factory and use case registories
const tokenVerifier: TokenVerifier = container.resolve(TokenVerifier);
const logger: WinstonLogger = container.resolve(WinstonLogger);

const host = "0.0.0.0";
const port = Number(process.env.HTTP_PORT);

const authMiddleware = new AuthorizationMiddleware(tokenVerifier, logger);
const corsMiddleware = new CorsMiddleware();

const router = express.Router();
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<IRouter> = [];
//modify response

//Setup and initialize all routes
routes.push(new PostRouter(router));
routes.push(new ListRouter(router));
routes.push(new UserRouter(router));

app.use(express.json());
app.use(corsMiddleware.setCors);
app.use(authMiddleware.authorize);
app.use("/" + Constants.apiPrefix, router);
routes.forEach((router: IRouter) => {
	router.initializeRoutes();
});

router.get("/", function (req, res) {
	res.sendStatus(200);
});
//Test ecs deployment
router.get("/ecs", function (req, res) {
	res.sendStatus(200);
});

server.listen(port, host);
console.log("Service started on port " + port);
