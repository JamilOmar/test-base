import { Component, ProviderMap } from '@loopback/core';
import { LogBindings } from './keys';
import { LogActionProvider } from './providers';
/**
 * Implements a log component.
 * @access public
 */
export class ServicesLoggerComponent implements Component {
    constructor() {}

    providers?: ProviderMap = {
        [LogBindings.LOGGER.key]: LogActionProvider,
    };
}
