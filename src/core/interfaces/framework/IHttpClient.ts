import { IHttpClientRequestParameters } from "./IHttpClientParameters";

export interface IHttpClient {
  get<T2>(parameters: IHttpClientRequestParameters): Promise<T2>;
  post<T2>(parameters: IHttpClientRequestParameters): Promise<T2>;
  patch<T2>(parameter: IHttpClientRequestParameters): Promise<T2>;
}
