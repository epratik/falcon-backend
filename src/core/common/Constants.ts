export abstract class Constants {
    static devEnviroment = "development";
    static prodEnviroment = "production";
    static projectName = "gp";
    static serviceConfigName = "serviceConfig";
    static separator = "/";
    static region = "app.region";
    static paramStoreAPIVersion = "2014-11-06";
    static secretStoreAPIVersion = "2017-10-17";
    static loggerName = "nodejsLogger";
    static apiPrefix = "api";
    static fnGetTopContent = "fnGetTopContent"

    static getServiceConfigPath(): string {
        return this.separator + this.projectName + this.separator + process.env.NODE_ENV +
            this.separator + this.serviceConfigName
    }
}