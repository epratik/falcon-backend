import AWS from 'aws-sdk';
import { Constants } from '../../core/common/Constants';
import { IAwsHelper } from '../../core/interfaces/framework/IAwsHelper';

export class AwsHelper implements IAwsHelper {
    
    constructor() {

    }

    /**
     * Returns parameter that matches the parameter.
     * @param path full path of parameter
     * @returns 
     */
    async getSingleParameter(path: string): Promise<AWS.SSM.Parameter | undefined> {
       
        const ssm = new AWS.SSM({ apiVersion: Constants.paramStoreAPIVersion });

        const params: AWS.SSM.GetParameterRequest = {
            Name: path
        };

        const result = await ssm.getParameter(params).promise();
        return result.Parameter
    }

    /**
     * get all parameters using partial path.
     * @param path 
     * @returns 
     */
    async getEnvParameters(path: string): Promise<AWS.SSM.ParameterList> {
       
        const ssm = new AWS.SSM({ apiVersion: Constants.paramStoreAPIVersion });

        try {
            const params: AWS.SSM.GetParametersByPathRequest = {
                Path: path,
                Recursive: true,
                NextToken: undefined
            };

            return await this.getParametersByPath(undefined, ssm, params);
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * Recursively fetch pages of parameters. AWS gives 10 at once.
     * @param nextToken will be defined if there are more then 10 parameters.
     * @returns 
     */
    private async getParametersByPath(nextToken: string | undefined, ssm: AWS.SSM,
        params: AWS.SSM.GetParametersByPathRequest): Promise<AWS.SSM.ParameterList> {
        
        const fetchedParams: AWS.SSM.ParameterList = [];
        const promise = await ssm.getParametersByPath(params).promise();
        
        fetchedParams.push(...promise.Parameters!);

        if (promise.NextToken) {
            params.NextToken = promise.NextToken;
            fetchedParams.push(...await this.getParametersByPath(promise.NextToken, ssm, params));
        }
        else
            return promise.Parameters!;
        
        return fetchedParams;
    }

    /**
     * create new or update existing parameter value
     * @param path full path of parameter
     * @param value new value
     */
    async putParameter(path: string, value: string): Promise<void> {
       
        const ssm = new AWS.SSM({ apiVersion: Constants.paramStoreAPIVersion });
        
        try {
            const params: AWS.SSM.PutParameterRequest = {
                Name: path,
                Value: value,
                Overwrite: true
            };

            await ssm.putParameter(params).promise();
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * get secrets JSON. contains db credentials.
    * @param path 
    * @returns 
    */
    async getSingleSecret(path: string): Promise<AWS.SecretsManager.GetSecretValueResponse> {
        const sm = new AWS.SecretsManager({ apiVersion: Constants.secretStoreAPIVersion });
    
        try {
            const params: AWS.SecretsManager.GetSecretValueRequest = {
                SecretId: Constants.getServiceConfigPath()
            };
    
            return await sm.getSecretValue(params).promise();
        }
        catch (err) {
            throw err;
        }
    }

    async checkExplicitContent(image: Buffer): Promise<boolean> {
        const awsrek = new AWS.Rekognition({ apiVersion: Constants.rekognitionAPIVerion });
        try {
            const params: AWS.Rekognition.Types.DetectModerationLabelsRequest = {
                Image: {
                    Bytes: image
                }
            }
            const resp = await awsrek.detectModerationLabels(params).promise();
            
            if (resp.ModerationLabels && resp.ModerationLabels.length > 0)
                return true;
            else
                return false;
        }
        catch (err) {
            throw err;
        }
    }
}