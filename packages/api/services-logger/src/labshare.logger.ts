import { createLogger, format, transports, addColors, Logger } from 'winston';
import * as fs from 'fs';
import path = require('path');
import * as _ from 'lodash';
import { LOG_LEVELS_FORMAT } from './constants';
import { LabShareLogConfig, LogRecord } from './types';
import { getLogInformationWithMetadata } from './utils';

const SplunkStreamEvent = require('winston-splunk-httplogger');
const FluentTransport = require('fluent-logger').support.winstonTransport();

/**
 * Implements a log strategy using Winston.
 * @access public
 */
export class LabShareLogger {
    /**
     * @property logger - Log strategy instance.
     */
    public logger: Logger;

    /**
     * @property options - Log options.
     */
    private options: LabShareLogConfig;

    /**
     * LabShareLogger class constructor.
     * @param {LabShareLogConfig} config Configuration Object.
     */
    constructor(public config: LabShareLogConfig = {}) {
        this.logger = this.createLogger();
    }

    /**
     * Info level logger method
     * @param {any[]} options - Array of objects.
     * @public
     */
    // tslint:disable-next-line:no-any
    public info(...data: any[]): void {
        this.logMessage('info', ...data);
    }

    /**
     * Error level logger method
     * @param {any[]} options -Array of objects.
     * @public
     */
    // tslint:disable-next-line:no-any
    public error(...data: any[]): void {
        this.logMessage('error', ...data);
    }

    /**
     * Warn level logger method
     * @param {any[]} options -Array of objects.
     * @public
     */
    // tslint:disable-next-line:no-any
    public warn(...data: any[]): void {
        this.logMessage('warn', ...data);
    }

    /**
     * Debug level logger method
     * @param {any[]} options -Array of objects.
     * @public
     */
    // tslint:disable-next-line:no-any
    public debug(...data: any[]): void {
        this.logMessage('debug', ...data);
    }

    /**
     * Log level logger method
     * @param {any[]} options -Array of objects.
     * @public
     */
    // tslint:disable-next-line:no-any
    public log(...data: any[]): void {
        this.logMessage('info', ...data);
    }

    /**
     * Verbose level logger method
     * @param {any[]} options -Array of objects.
     * @public
     */
    // tslint:disable-next-line:no-any
    public verbose(...data: any[]): void {
        this.logMessage('verbose', ...data);
    }

    /**
     * Usage level logger method
     * @param {any[]} options -Array of objects.
     * @public
     */
    // tslint:disable-next-line:no-any
    public usage(...data: any[]): void {
        this.logMessage('usage', ...data);
    }

    /**
     * It create a logger instance based on Winston.
     * @returns {LabShareLogger} - Logger.
     * @public
     */
    public createLogger(): Logger {
        // We create a new object before assigning the defaults because
        // read-only config objects, such as the one from the node-config library
        // cannot be reassigned using defaultsDeep.
        this.options = _.defaultsDeep(
            { ...this.config },
            {
                // default format
                format: {
                    timestamp: true,
                    json: false,
                    colorize: false,
                },
                // default console level
                console: true,
                // default info level
                level: 'info',

                // Equivalent to setting "silent" to false in the Winston library
                disable: false,
            },
        );

        const styleFormats = this.generateStyleFormats(this.options);

        this.logger = createLogger({
            level: this.options.level,
            levels: LOG_LEVELS_FORMAT.levels,
            format: format.combine(...styleFormats),
            silent: this.options.disable,
        });

        // Adding a new Console transport
        if (this.options.console === true) {
            this.logger.add(new transports.Console());
        }

        if (this.options.disable !== true) {
            // Add logging to a local file
            if (this.options.file && this.options.file.disable !== true) {
                this.logger.add(this.createFileTransport(this.options.file));
            }

            // Add FluentD
            if (this.options.fluentD && this.options.fluentD.disable !== true) {
                this.logger.add(this.createFluentDTransport(this.options.fluentD));
            }

            // Add Splunk
            if (this.options.splunk && this.options.splunk.disable !== true) {
                this.logger.add(this.createSplunkTransport(this.options.splunk));
            }
        }

        return this.logger;
    }

    /**
     * @description Creates a fluentD logging transport.
     * @param options - FluentD's transport's options.
     */
    private createFluentDTransport(options: LabShareLogConfig['fluentD'] = {}): Logger {
        options = _.defaults(options, {
            // default host name
            host: 'localhost',
            // default port
            port: 24224,
            // default timeout
            timeout: 3.0,
            // default tag
            tag: 'labshare',
        });

        return new FluentTransport(options.tag, options);
    }

    /**
     * @description Creates a Splunk transport
     * @param options - Splunk HTTP transport options
     */
    private createSplunkTransport(splunkSettings: LabShareLogConfig['splunk']): Logger {
        return new SplunkStreamEvent({
            splunk: {
                // Create a copy to prevent the winston splunk library from mutating
                // the original configuration through property deletions:
                // See: https://github.com/adrianhall/winston-splunk-httplogger/blob/3191f7fd73ad762e745b73d298387224c08ff72b/index.js#L83
                ...splunkSettings,
            },
        });
    }

    /**
     * @description Creates a file transport.
     * @param {any} options - File transport's options.
     * @returns {any} - Transport.
     */
    private createFileTransport(options: LabShareLogConfig['file']) {
        const directory = options?.directory;

        if (!directory) {
            throw new Error(`File directory is not found.`);
        }

        options = _.defaultsDeep(options, {
            // default file name
            filename: path.resolve(directory, 'app.log'),
            // default number of max files
            maxFiles: 5,
            // default file size
            maxsize: 10485760,
        });

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }

        return new transports.File(options);
    }

    /**
     * Helper method for creating styles for formating
     * @param {any} options - Formating options.
     * @returns {any[]} - Styles.
     */
    // tslint:disable-next-line:no-any
    private generateStyleFormats(options: any): any[] {
        // default format for Console, error at winston: if not json is specified is not logging in console
        // tslint:disable-next-line:no-any
        const loggerFormat = format.printf(
            (
                // tslint:disable-next-line:no-any
                arg: any,
            ) => {
                const timestamp = arg.timestamp;
                const level = arg.level;
                const message = arg.message;
                const meta = _.omit(arg, ['timestamp', 'message', 'level']);
                // tslint:disable-next-line:no-any
                let metaString = '';
                if (!_.isEmpty(meta)) {
                    _.forEach(meta, (value, key) => {
                        metaString += `,${key}=${value}`;
                    });
                }
                return `${_.isNil(timestamp) ? '' : timestamp + ' '}${level}: ${message}${metaString}`;
            },
        );
        // Defining custom formats
        const styleFormats = [];
        if (_.get(options, `format.colorize`, false) === true) {
            addColors(LOG_LEVELS_FORMAT.colors);
            styleFormats.push(format[`colorize`]());
        }
        if (_.get(options, `format.timestamp`, false) === true) {
            styleFormats.push(format[`timestamp`]());
        }
        // special case: if json is not defined , use by default the custom format
        if (_.get(options, `format.json`, false) === true) {
            // going to global
            styleFormats.push(format.json());
        } else {
            styleFormats.push(loggerFormat);
        }
        return styleFormats;
    }

    /**
     * Helper method for logging the message
     * @param {string} level - Log level.
     * @param {any[]} args - Args to log.
     */
    // tslint:disable-next-line:no-any
    private logMessage(level: string, ...args: any[]) {
        let obj: LogRecord = this.options.enableMetadata ? getLogInformationWithMetadata(...args) : { message: _.toString(args) };
        this.logger.log(level, obj.message || '', obj.metadata);
    }
}
