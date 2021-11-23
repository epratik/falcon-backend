
import { inject, injectable } from "tsyringe";
import knex from 'knex';
import * as fs from "fs"
import { IConfigManager } from "../../core/interfaces/common/IConfigManager";
import { ISQLHelper } from "../../core/interfaces/framework/ISQLHelper";

@injectable()
export class SQLHelper implements ISQLHelper {

    private conn: knex<any, unknown[]>;

    constructor(@inject("IConfigManager") private configManager: IConfigManager) {

    }

    private init = async () => {
        if (!this.conn)
        {
            const value = await this.configManager.getPostgreConnString;
            this.conn = knex(JSON.parse(value!))
        }
        else
            this.conn;
    }

    callFunction = async (name: string, args: any[]): Promise<any[]> => {

        await this.init();
        let placeholders: string = "";

        for (let i = 0; i < args.length; i++) {
            placeholders = placeholders + '?,'
        }

        const result = await this.conn.raw('select * from ' + name + '( ' + placeholders.slice(0, -1) + ' )', args);
        return result.rows;
    }

    callProcedure = async (name: string, args: any[]): Promise<void> => {
        
        await this.init();
        let placeholders: string = "";

        for (let i = 0; i < args.length; i++) {
            placeholders = placeholders + '?,'
        }

        await this.conn.raw('call ' + name + '( ' + placeholders.slice(0, -1) + ' )', args);
    }

    callProcedureWithOutput = async (name: string, args: any[]): Promise<any> => {
        
        await this.init();
        let placeholders: string = "";

        for (let i = 0; i < args.length; i++) {
            placeholders = placeholders + '?,'
        }

        const result = await this.conn.raw('call ' + name + '( ' + placeholders.slice(0, -1) + ' )', args);
        return result.rows;
    }
}