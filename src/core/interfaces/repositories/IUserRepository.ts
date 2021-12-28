
export interface IUserRepository {
    follow(userId: number, userToFollow: number): Promise<void>;
    unfollow(userId: number, userToFollow: number): Promise<void>
}