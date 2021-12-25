import * as JWT from "jsonwebtoken"
import jwtDecode from "jwt-decode";
import jwkToPem, { RSA } from "jwk-to-pem"
import { JwtHeader, JwtPayload } from "../../core/model/JWT";
import { IHttpClientRequestParameters } from "../../core/interfaces/framework/IHttpClientParameters";
import { injectable, inject } from "tsyringe";
import { IHttpClient } from "../../core/interfaces/framework/IHttpClient";
import { JWK, JWKS } from "../../core/model/JWKS";
import { ITokenVerifier } from "../../core/interfaces/framework/ITokenVerifier";

@injectable()
export class TokenVerifier implements ITokenVerifier{

    constructor(@inject("IHttpClient") private httpClient: IHttpClient){
    
    }

    /**
     * pending - verification of user pool id
     * @param token 
     * @returns 
     */
    verify = async (token: string): Promise<JwtPayload> => {
        //using auth0 library to decode token header and payload, it supports a generic token type.
        //token header KID - use this to fetch the right key for token verification.
        //token header iss - path to fetch JWKS. Contains keys to verify the token.
        const tokenPayload = jwtDecode<JwtPayload>(token);
        const tokenHeader = jwtDecode<JwtHeader>(token, { header: true });
        const jwk = await this.getJWKByKid(tokenPayload.iss, tokenHeader.kid);

        //RSA key object created with required values.
        const rsa: RSA = {
            e: jwk.e,
            n: jwk.n,
            kty: "RSA"
        }
        //Verify using JsonWebToken library. 
        //It checks for signature, well formed token and its expiry.
        const pem = jwkToPem(rsa);
        JWT.verify(token, pem);
        return tokenPayload;
    }

     /**
     * Get JWK using cognitos keys url.
     * @param iss used to create cognito jwks url.
     * @param kid kid to fetch the right key.
     * @returns Key used to verify.
     */
      private async getJWKByKid(iss: string, kid: string): Promise<JWK> {
        let parameters: IHttpClientRequestParameters = {
            url: iss + "/.well-known/jwks.json"
          };
    
        //get json web key set JWKS
        let jwks = await this.httpClient.get<JWKS>(parameters);
        let jwk = jwks.keys.find((key) => key.kid === kid);

        if (jwk === undefined)
            throw new Error("keyid not found" + kid);
        else
            return jwk;
    }
}