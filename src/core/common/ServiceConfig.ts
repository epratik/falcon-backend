export type ServiceConfig = {
    cacheDurationInSeconds: number,
    logLevel: string,
    connectionString: string,
    localConnectionString: string,
    jumpServerSettings: string,
    jumpServerKey: string,
    contentLimit: number,
    enableAWSRekognition: boolean
}