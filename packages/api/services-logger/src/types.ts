/**
 * An interface describes the common logging configuration.
 *
 * A logging configuration describes all the settings that
 * you can use
 *
 */
export interface LogConfig {
    enableMetadata?: boolean;
}
/**
 * A helper interface for storing the message and metadata from the
 * logger
 */
export interface LogRecord {
    message?: string;
    // tslint:disable-next-line:no-any
    metadata?: any;
}
/**
 * A helper interface for defining the configuration parameters
 */
export interface LabShareLogConfig extends LogConfig {
    fluentD?: {
        host?: string;
        port?: number;
        timeout?: number;
        tag?: string;
        disable?: boolean;
    };
    splunk?: {
        host: string;
        token: string;
        disable?: boolean;
    };
    format?: {
        timestamp?: boolean;
        json?: boolean;
        colorize?: boolean;
    };
    file?: {
        directory: string;
        filename?: string;
        maxFiles?: number;
        maxsize?: number;
        disable?: boolean;
    };
    console?: boolean;
    level?: string;
    disable?: boolean;
}
