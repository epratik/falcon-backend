export interface IPostValidator {
    checkIfPostBelongsToUser(postId: number, userId: number): Promise<void>
}