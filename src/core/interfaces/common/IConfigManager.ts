import { ServiceConfig } from "../../common/ServiceConfig";

export interface IConfigManager {
	getDuration: Promise<number>;
	getLogLevel: Promise<string>;
}
