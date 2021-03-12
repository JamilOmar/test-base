import { BindingKey } from '@loopback/context';
import { LabShareLogConfig } from './types';
import { LabShareLogger } from './labshare.logger';

// namespace for binding configurations
export namespace LogBindings {
    // binding label for logger
    export const LOG_STRATEGY = BindingKey.create<LabShareLogger>('log.strategy');
    // binding label for configuration
    export const LOG_CONFIG = BindingKey.create<LabShareLogConfig>('log.config');
    // binding label for logger
    export const LOGGER = BindingKey.create<LabShareLogger>('log.logger');
}

export namespace LogConstants {
    // binding label for logger
    export const SERVICES_LOGGER_CONFIG = 'services.log';
}
