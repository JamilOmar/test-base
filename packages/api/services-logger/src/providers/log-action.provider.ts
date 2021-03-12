import { Provider, inject } from '@loopback/context';
import { LabShareLogConfig } from '../types';
import { LabShareLogger } from '../labshare.logger';
import { LogBindings } from '../keys';
import * as _ from 'lodash';
/**
 * Implements a log action provider.
 * @access public
 */
// tslint:disable-next-line:no-any
export class LogActionProvider implements Provider<LabShareLogger | any> {
    constructor() {}
    /**
     * @property {LabShareLogConfig} logConfig - Log configuration.
     */
    @inject(LogBindings.LOG_CONFIG, { optional: true })
    logConfig: LabShareLogConfig = {};
    /**
     * @property {LabShareLogger} logFunction - Log function.
     */
    @inject(LogBindings.LOG_STRATEGY, { optional: true })
    // tslint:disable-next-line:no-any
    logFunction: LabShareLogger;
    // tslint:disable-next-line:no-any
    public value(): LabShareLogger | any {
        if (_.isNil(this.logFunction)) {
            return this.logger(this.logConfig);
        }
        return this.logFunction;
    }

    /**
     * Helper method for creating a logger
     * @param {LabShareLogConfig} config - Log config.
     * @returns {LabShareLogger} - Logger.
     * @private
     */
    private logger(config: LabShareLogConfig): LabShareLogger {
        const winstonLogger = new LabShareLogger(config);
        return winstonLogger;
    }
}
