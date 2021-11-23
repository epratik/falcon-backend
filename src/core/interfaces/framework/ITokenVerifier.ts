import { JwtPayload } from "../../model/JWT";

export interface ITokenVerifier {
    verify(token: string): Promise<JwtPayload>
}