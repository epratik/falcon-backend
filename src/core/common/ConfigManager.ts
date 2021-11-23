import { inject, injectable } from "tsyringe";
import { IAwsHelper } from "../interfaces/framework/IAwsHelper";
import { ICacheManager } from "../interfaces//framework/ICacheManager";
import { IConfigManager } from "../interfaces/common/IConfigManager";
import { Constants } from  "./Constants";
import { ServiceConfig } from "./ServiceConfig";

@injectable()
export class ConfigManager implements IConfigManager {
    constructor(
        @inject("IAwsHelper") private awsHelper: IAwsHelper,
        @inject("ICacheManager") private cacheManager: ICacheManager
    ) { }

    private getConfigFileFromCache = async (): Promise<ServiceConfig | undefined> => {
        let config: ServiceConfig;
        config = this.cacheManager.get("config");

        if (!config) {
            config = await this.addConfigurationToCache();
        }
        return config;
    };

    private addConfigurationToCache = async (): Promise<ServiceConfig> => {
        const path = Constants.getServiceConfigPath();
        const param = await this.awsHelper.getSingleParameter(path);
        const config: ServiceConfig = JSON.parse(param?.Value!);

        this.cacheManager.put<ServiceConfig>("config", config, Number(config.cacheDurationInSeconds));
        return config;
    };

    get getDuration(): Promise<number> {
        return (async () => {
            const config = await this.getConfigFileFromCache();
            if (config && config.cacheDurationInSeconds) return Number(config.cacheDurationInSeconds);
            else return 10800;
        })();
    }

    get getLogLevel(): Promise<string> {
		return (async () => {
			try {
				const config = await this.getConfigFileFromCache();
				if (config && config.logLevel) return config.logLevel;
				else return "error";
			} catch {
				return "error"; //Winston logger must start in any case.
			}
		})();
    }
    
    get getPostgreConnString(): Promise<string | undefined> {
		return (async () => {
			const config = await this.getConfigFileFromCache();
			if (config && config.connectionString) return JSON.stringify(config.connectionString);
			else return undefined;
		})();
	}

	get getPostgreLocalConnString(): Promise<string | undefined> {
		return (async () => {
			const config = await this.getConfigFileFromCache();
			if (config && config.localConnectionString) return JSON.stringify(config.localConnectionString);
			else return undefined;
		})();
	}

	get getPostgreJumpServerSettings(): Promise<string | undefined> {
		return (async () => {
			const config = await this.getConfigFileFromCache();
			if (config && config.jumpServerSettings) return JSON.stringify(config.jumpServerSettings);
			else return undefined;
		})();
	}

	get getPostgreJumpServerKey(): Promise<string | undefined> {
		return (async () => {
			const config = await this.getConfigFileFromCache();
			if (config && config.jumpServerKey) return config.jumpServerKey;
			else return undefined;
		})();
	}

	get getContentLimit(): Promise<number | undefined> {
		return (async () => {
			const config = await this.getConfigFileFromCache();
			if (config && config.contentLimit) return config.contentLimit;
			else return 100;
		})();
	}
}