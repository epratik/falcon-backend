
declare namespace Express {
    export interface Request {
        context: UserContext
    }
}

type UserContext = {
    userId: number,
    email: string
}
