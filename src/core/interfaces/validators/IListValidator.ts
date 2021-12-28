export interface IListValidator {
    checkIfListNameExists(name: string, userId: number): Promise<boolean>;
    checkIfListExists(listId: number, userId: number): Promise<boolean>;
}