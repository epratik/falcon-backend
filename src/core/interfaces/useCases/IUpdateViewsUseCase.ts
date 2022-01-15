export interface IUpdateViewsUseCase{
    execute(listId: number): Promise<void>;
}