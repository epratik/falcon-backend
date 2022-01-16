import AWS from 'aws-sdk';

export interface IAwsHelper {
    getEnvParameters(path: string): Promise<AWS.SSM.ParameterList>
    getSingleParameter(path: string): Promise<AWS.SSM.Parameter | undefined>
    putParameter(path: string, value: string): Promise<void>;
    getSingleSecret(path: string): Promise<AWS.SecretsManager.GetSecretValueResponse>;
    checkExplicitContent(image: Buffer): Promise<boolean>;
}
