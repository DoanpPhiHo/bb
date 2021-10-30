import * as logger from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'

export class LoggerService implements logger.LoggerService {
    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]) {
        console.log(message);
        this.saveLog('log', message, optionalParams[0]);
    }

    /**
     * Write an 'error' level log.
     */
    error(message: any, ...optionalParams: any[]) {
        console.error(message);
        this.saveLog('error', message, optionalParams[0]);
    }

    /**
     * Write a 'warn' level log.
     */
    warn(message: any, ...optionalParams: any[]) {
        console.warn(message);
        this.saveLog('warn', message, optionalParams[0]);
    }

    /**
     * Write a 'debug' level log.
     */
    debug?(message: any, ...optionalParams: any[]) {
        console.debug(message);
        this.saveLog('debug', message, optionalParams[0]);
    }

    /**
     * Write a 'verbose' level log.
     */
    verbose?(message: any, ...optionalParams: any[]) {
        this.saveLog('verbose', message, optionalParams[0]);
    }

    async saveLog(lever, str, optionalParams) {
        let obj = ''
        try {
            let dir = 'logs';

            if (!existsSync(dir)) {
                mkdirSync(dir);
            }
            let date = new Date()
            dir = `logs/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.${lever}-logs`
            try {
                if (existsSync(dir)) {
                    let stringRead = await readFileSync(dir, 'utf8')
                    if (stringRead)
                        obj = stringRead
                }
                let json = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()} : ${optionalParams} => ${lever} : ${str} \n` + obj
                writeFileSync(dir, json);
            }
            catch (err) {
                console.log('err 54:', err)
            }
            return 'suc'
        } catch (err) {
            console.log('err 38:', err)
            return `fail:${err}`
        }
    }
}