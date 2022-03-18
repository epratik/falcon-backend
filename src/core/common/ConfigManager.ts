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
    
}