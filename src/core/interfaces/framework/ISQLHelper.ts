export interface ISQLHelper {
    callFunction(name: string, args: any[]): Promise<any[]>
    callProcedure(name: string, args: any[]): Promise<void>
    callProcedureWithOutput(name: string, args: any[]): Promise<any>
}