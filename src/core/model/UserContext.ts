import { IUserContext } from "../interfaces/common/IUserContext";

export class UserContext implements IUserContext{
    userId: number;
    email: string;
}