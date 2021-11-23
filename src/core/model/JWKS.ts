export type JWKS = {
    keys: JWK[];
  };
    
  export type JWK = {
    alg: string;
    kty: string;
    use: string;
    n: string;
    e: string;
    kid: string;
  };