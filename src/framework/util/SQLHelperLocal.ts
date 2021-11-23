
import { inject, injectable } from "tsyringe";
import knex from 'knex';
import * as fs from "fs"
import { IConfigManager } from "../../core/interfaces/common/IConfigManager";
import { ISQLHelper } from "../../core/interfaces/framework/ISQLHelper";

@injectable()
export class SQLHelperLocal implements ISQLHelper {

    private conn: knex<any, unknown[]>;
    private config: any;

    constructor(@inject("IConfigManager") private configManager: IConfigManager) {

    }

    private init = async () => {
        if (!this.conn) {
            const connString = await this.configManager.getPostgreLocalConnString;
            this.conn = knex(JSON.parse(connString!))
        }

        const jumpServerSettings = await this.configManager.getPostgreJumpServerSettings;
        this.config = JSON.parse(jumpServerSettings!);
        const base64Key = await this.configManager.getPostgreJumpServerKey;
        this.config.privateKey = Buffer.from(base64Key!, 'base64');
    }

    callFunction = async (name: string, args: any[]): Promise<any[]> => {
        try {
            await this.init();
            const res: any = await this.callFuncInTunnel(args, name);
            return res.rows;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    callFuncInTunnel = (args: string[], name: string) => new Promise((resolve, reject) => {
        const tunnel = require('tunnel-ssh');
        let placeholders: string = "";
        for (let i = 0; i < args.length; i++) {
            placeholders = placeholders + '?,'
        }

        const tnl = tunnel(this.config, async (err: any, server: any) => {
          const data = await this.conn.raw("select * from " + name + "( " + placeholders.slice(0, -1) + " )", args);
          tnl.close();
          return resolve(data);
        });
    });
    
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
        const res: any = await this.callProcWithOutInTunnel(args, name);
        return res.rows;
    }

    
    callProcWithOutInTunnel = (args: string[], name: string) => new Promise((resolve, reject) => {
        const tunnel = require('tunnel-ssh');
        let placeholders: string = "";
        for (let i = 0; i < args.length; i++) {
            placeholders = placeholders + '?,'
        }

        let data = undefined;
        const tnl = tunnel(this.config, async (err: any, server: any) => {
            data = await this.conn.raw('call ' + name + '( ' + placeholders.slice(0, -1) + ' )', args)
            tnl.close();
            return resolve(data);
        });
    });
}