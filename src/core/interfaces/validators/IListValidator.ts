export interface IListValidator {
    checkIfListNameExists(name: string, userId: number): Promise<void>;
    checkIfListExists(listId: number, userId: number): Promise<void>;
}