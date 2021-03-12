import { sinon } from '@loopback/testlab';
import { SpyHelper } from '../../helpers/';
import { LogActionProvider } from '../../../providers';

describe('LogActionProvider', () => {
    it('writes an info message', () => {
        let infoSpy = SpyHelper.createLabShareLoggerSpy('info');
        let errorSpy = SpyHelper.createLabShareLoggerSpy('error');
        const logger = new LogActionProvider().value();
        logger.info(' this is a test');
        sinon.assert.calledOnce(infoSpy);
        sinon.assert.notCalled(errorSpy);
        SpyHelper.deleteAll();
    });
    it('writes an error message', () => {
        let errorSpy = SpyHelper.createLabShareLoggerSpy('error');
        const logger = new LogActionProvider().value();
        logger.error('error');
        sinon.assert.calledOnce(errorSpy);
        SpyHelper.deleteSpy(errorSpy);
    });
    it('writes a warn message', () => {
        let warnSpy = SpyHelper.createLabShareLoggerSpy('warn');
        const logger = new LogActionProvider().value();
        logger.warn('warn');
        sinon.assert.calledOnce(warnSpy);
        SpyHelper.deleteSpy(warnSpy);
    });

    it('writes a debug message', () => {
        let debugSpy = SpyHelper.createLabShareLoggerSpy('debug');
        const logger = new LogActionProvider().value();
        logger.debug('debug');
        sinon.assert.calledOnce(debugSpy);
        SpyHelper.deleteSpy(debugSpy);
    });
    it('writes an verbose message', () => {
        let traceSpy = SpyHelper.createLabShareLoggerSpy('verbose');
        const logger = new LogActionProvider().value();
        logger.verbose('verbose');
        sinon.assert.calledOnce(traceSpy);
        SpyHelper.deleteSpy(traceSpy);
    });
    it('writes a usage message', () => {
        let traceSpy = SpyHelper.createLabShareLoggerSpy('usage');
        const logger = new LogActionProvider().value();
        logger.usage('usage');
        sinon.assert.calledOnce(traceSpy);
        SpyHelper.deleteSpy(traceSpy);
    });
    it('writes an log message', () => {
        let logSpy = SpyHelper.createLabShareLoggerSpy('log');
        const logger = new LogActionProvider().value();
        logger.log('log');
        sinon.assert.calledOnce(logSpy);
        SpyHelper.deleteSpy(logSpy);
    });
});
