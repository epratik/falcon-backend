import winston from 'winston';
import { Constants } from '../../core/common/Constants';
import { IConfigManager } from '../../core/interfaces/common/IConfigManager';
import { inject, injectable } from "tsyringe";
import { ILogger } from '../../core/interfaces/framework/ILogger';
import { format } from 'winston';

@injectable()
export class WinstonLogger implements ILogger {

  constructor(@inject("IConfigManager") private configManager: IConfigManager) {
    
  }

  private init = async (): Promise<winston.Logger> => {
    if (!winston.loggers.has(Constants.loggerName)) {
      winston.loggers.add(Constants.loggerName, {
        transports: [
          new winston.transports.Console({
            level: await this.configManager.getLogLevel,
            format: format.combine(
              format.errors({ stack: true }),
              format.metadata(),
              format.json()
            ),
          })
        ]
      });
    }
    return winston.loggers.get(Constants.loggerName);
  }

  logError = async (data: any) => {
    const logger = await this.init();
    if (data instanceof Error) {
      logger.log({ level: 'error', message: `${data.stack || data}` })
    } else {
      logger.log({ level: 'error', message: data });
    }
  }
    
  logInfo = async (data: any) => {
    const logger = await this.init();
    logger.log({ level: 'info', message: data });
  }
}