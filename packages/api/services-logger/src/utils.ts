import * as _ from 'lodash';
import { LogRecord } from './types';

// tslint:disable-next-line:no-any
export function getLogInformationWithMetadata(
    // tslint:disable-next-line:no-any
    ...args: any[]
): LogRecord {
    const obj: LogRecord = {
        message: '',
        metadata: undefined,
    };
    if (args.length === 0) {
        return obj;
    }
    // check the last index to see if is an object or not
    let lastIndex = args.length - 1;
    if (_.isObject(args[lastIndex])) {
        obj.metadata = args[lastIndex];
        // if is remove the last element
        args.length--;
    }
    // only assign message if it's not already present in the metadata
    if (!_.has(obj.metadata, 'message')) {
        obj.message = _.toString(args);
    }
    return obj;
}
