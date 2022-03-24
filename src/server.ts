import express from "express";
import rateLimit from 'express-rate-limit';
import http from "http";
import "reflect-metadata";
import dotenv from "dotenv";
import { container } from "tsyringe";
import { ConfigManager } from "./core/common/ConfigManager";
import { AwsHelper } from "./framework/util/AwsHelper";
import { CacheManager } from "./framework/util/CacheManager";
import { WinstonLogger } from "./framework/util/WinstonLogger";
import { Constants } from "./core/common/Constants";
import { IRouter } from "./application/routes/IRouter";
import { CorsMiddleware } from "./application/middleware/CorsMiddleware";
import { CreateListUseCase } from "./core/useCases/CreateListUseCase";
import { GetListsUseCase } from "./core/useCases/GetListsUseCase";
import { ListController } from "./application/controllers/ListController";
import { ListRouter } from "./application/routes/ListRouter";

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
container.registerSingleton("ICacheManager", CacheManager);
container.registerSingleton("IConfigManager", ConfigManager);
//use SQLHelperLocal for local development using a ssh tunnel. Cannot connect to AWS RDS directly from local.
//you need to update the SQLHelperLocal file with connection details before use.
//you can also use SQLHelperMock if you do not want to connect to the database.
container.registerSingleton("ILogger", WinstonLogger);

container.register("ListController", ListController);

container.register("ICreateListUseCase", CreateListUseCase);
container.register("IGetListsUseCase",GetListsUseCase);

//Factory and use case registories
const logger: WinstonLogger = container.resolve(WinstonLogger);

const host = "0.0.0.0";
const port = Number(process.env.HTTP_PORT);
const corsMiddleware = new CorsMiddleware();

const router = express.Router();
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<IRouter> = [];
//modify response

//Setup and initialize all routes
routes.push(new ListRouter(router));

app.use(express.json());
app.use(corsMiddleware.setCors);
app.use("/" + Constants.apiPrefix, router);
routes.forEach((router: IRouter) => {
	router.initializeRoutes();
});

router.get("/", function (req, res) {
	res.sendStatus(200);
});

server.listen(port, host);
console.log("Service started on port " + port);
