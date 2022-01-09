export interface IListValidator {
    checkIfListNameExists(name: string, userId: number): Promise<number | undefined>;
    checkIfListExists(listId: number, userId: number): Promise<void>;
}