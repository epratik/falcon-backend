
export interface IUserRepository {
    follow(email: string, userToFollow: number): Promise<void>;
    unfollow(email: string, userToFollow: number): Promise<void>
}