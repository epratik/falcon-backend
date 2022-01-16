import { ServiceConfig } from "../../common/ServiceConfig";

export interface IConfigManager {
	getPostgreConnString: Promise<string | undefined>;
	getPostgreLocalConnString: Promise<string | undefined>;
	getPostgreJumpServerSettings: Promise<string | undefined>;
	getPostgreJumpServerKey: Promise<string | undefined>;
	getDuration: Promise<number>;
	getLogLevel: Promise<string>;
	getContentLimit: Promise<number>;
	enableAWSRekognition: Promise<boolean>;
}
