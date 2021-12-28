export interface IPostDeactivateUseCase{
    execute(postId: number): Promise<void>;
}