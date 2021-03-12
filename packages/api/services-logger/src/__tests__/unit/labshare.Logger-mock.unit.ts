import { sinon } from '@loopback/testlab';
import { SpyHelper } from '../helpers';

const proxyquire = require('proxyquire');

describe('LabShareLogger with Mocked create Logger', () => {
    // tslint:disable-next-line:no-any
    let labShareLogger: any;
    // tslint:disable-next-line:no-any
    let logMethodSpy: any;
    // tslint:disable-next-line:no-any
    let addMethodSpy: any;
    let createLoggerMock;
    // tslint:disable-next-line:no-any
    let LabShareLoggerMock: any;

    beforeEach(() => {
        logMethodSpy = sinon.spy();
        addMethodSpy = sinon.spy();
        createLoggerMock = {
            // tslint:disable-next-line:no-any
            log: (level: string, message: string, metadata: any) => {
                logMethodSpy(level, message, metadata);
            },
            // tslint:disable-next-line:no-any
            add: (config: any) => {
                addMethodSpy(config);
            },
        };
        LabShareLoggerMock = proxyquire('../../labshare.logger.js', {
            winston: {
                createLogger: sinon.stub().returns(createLoggerMock),
            },
        });
    });

    afterEach(SpyHelper.deleteAll);

    it('writes an log message with no metadata', () => {
        labShareLogger = new LabShareLoggerMock.LabShareLogger();
        labShareLogger.log('log', { app: '1', method: 'create' });
        sinon.assert.calledOnce(logMethodSpy);
        sinon.assert.calledWith(logMethodSpy, 'info', 'log,[object Object]', undefined);
    });

    it('writes an log message with no metadata and multiple arguments', () => {
        labShareLogger = new LabShareLoggerMock.LabShareLogger();
        labShareLogger.log('log', 'test', { app: '1', method: 'create' });
        sinon.assert.calledOnce(logMethodSpy);
        sinon.assert.calledWith(logMethodSpy, 'info', 'log,test,[object Object]', undefined);
    });

    it('writes an log message with metadata', () => {
        labShareLogger = new LabShareLoggerMock.LabShareLogger({
            enableMetadata: true,
        });
        labShareLogger.log('log', { app: '1', method: 'create' });
        sinon.assert.calledOnce(logMethodSpy);
        sinon.assert.calledWith(logMethodSpy, 'info', 'log', {
            app: '1',
            method: 'create',
        });
    });

    it('writes an log message with metadata and multiple arguments', () => {
        labShareLogger = new LabShareLoggerMock.LabShareLogger({
            enableMetadata: true,
        });
        labShareLogger.log('log', 'test', { app: '1', method: 'create' });
        sinon.assert.calledOnce(logMethodSpy);
        sinon.assert.calledWith(logMethodSpy, 'info', 'log,test', {
            app: '1',
            method: 'create',
        });
    });

    it('writes an log message with metadata, multiple arguments, and no object at the end', () => {
        labShareLogger = new LabShareLoggerMock.LabShareLogger({
            enableMetadata: true,
        });
        labShareLogger.log('log', 'test', 1);
        sinon.assert.calledOnce(logMethodSpy);
        sinon.assert.calledWith(logMethodSpy, 'info', 'log,test,1', undefined);
    });
});
