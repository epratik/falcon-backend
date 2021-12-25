export type JwtHeader = {
    kid: string,
    alg: string
}

export type JwtPayload = {
    sub: string,
    aud: string,
    "cognito:groups": string[],
    email_verified: boolean,
    event_id: string,
    token_use: string,
    auth_time: number,
    iss: string,
    "cognito:username": string,
    userId:number,
    exp: number,
    iat: number,
    email:string
}