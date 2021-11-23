import axios from "axios";
import { IHttpClient } from "../../core/interfaces/framework/IHttpClient";
import { IHttpClientRequestParameters } from "../../core/interfaces/framework/IHttpClientParameters";

export class AxiosHttpClient implements IHttpClient {
  constructor() { }

  get<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    let headers = {
      "Content-Type": "application/json",
      ...parameters.securityHeaders,
    };
    return new Promise<T>((resolve, reject) => {
      axios
        .get(parameters.url, {
          headers: headers,
        })
        .then((response: any) => {
          resolve(response.data as T);
        })
        .catch((response: any) => {
          reject(this.handleRejection(response));
        });
    });
  }

  post<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    let headers = {
      "Content-Type": "application/json",
      ...parameters.securityHeaders,
    };
    return new Promise<T>((resolve, reject) => {
      axios
        .post(parameters.url, parameters.bodyJson, {
          headers: headers,
        })
        .then((response: any) => {
          resolve(response.data as T);
        })
        .catch((response: any) => {
          reject(this.handleRejection(response));
        });
    });
  }

  patch<T>(parameters: IHttpClientRequestParameters): Promise<T> {
    let headers = {
      "Content-Type": "application/json",
      ...parameters.securityHeaders,
    };
    return new Promise<T>((resolve, reject) => {
      axios
        .patch(parameters.url, parameters.bodyJson, {
          headers: headers,
        })
        .then((response: any) => {
          resolve(response.data as T);
        })
        .catch((response: any) => {
          reject(this.handleRejection(response));
        });
    });
  }

  private handleRejection(error: any): any {
    let errorResponse;
    if (error.response && error.response.data)//The request was made and the server responded with a status code
      errorResponse = error.response.data;
    else if (error.request.message || error.request.statusText)//The request was made but no response was received
      errorResponse = error.request.message || error.request.statusText;
    else if (error.message)
      errorResponse = error.message;
    else
      errorResponse = error;
    return errorResponse;
  }
}
