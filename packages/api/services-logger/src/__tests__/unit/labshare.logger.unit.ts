import { expect, sinon } from '@loopback/testlab';
import * as _ from 'lodash';
import { SpyHelper } from '../helpers';
import { LabShareLogger } from '../../labshare.logger';
import { LabShareLogConfig } from '../../types';

describe('LabShareLogger', () => {
    // tslint:disable-next-line:no-any
    let fsExistsSpy: any;
    // tslint:disable-next-line:no-any
    let fsMkDirSpy: any;

    beforeEach(() => {
        fsExistsSpy = SpyHelper.createFsSpy('existsSync');
        fsMkDirSpy = SpyHelper.createFsSpy('mkdirSync');
    });

    afterEach(() => {
        SpyHelper.deleteAll();
    });

    it('creates a winston logger', () => {
        const labShareLogger = new LabShareLogger();
        const logger = labShareLogger.createLogger();

        expect(logger).to.not.undefined();
    });

    it('enables logging to fluentD when configured', () => {
        const labShareLogger = new LabShareLogger({
            fluentD: {
                host: 'localhost',
            },
        } as LabShareLogConfig);
        const logger = labShareLogger.createLogger();
        const transport = _.find(logger.transports, { name: 'fluent' });

        expect(transport).not.to.be.undefined();
        expect(logger).not.to.be.undefined();
    });

    it('enables logging to Splunk when configured', () => {
        const winstonStrategy = new LabShareLogger({
            splunk: {
                host: 'splunk.host',
                token: 'abcdef',
            },
        } as LabShareLogConfig);

        const logger = winstonStrategy.createLogger();
        const transport = _.find(logger.transports, { name: 'SplunkStreamEvent' });

        expect(transport).not.to.be.undefined();
        expect(logger).to.not.be.undefined();
    });

    it('enables logging to a file with an existing directory', () => {
        fsExistsSpy.returns(true);

        const labShareLogger = new LabShareLogger({
            file: {
                directory: '/test/',
            },
        } as LabShareLogConfig);
        const logger = labShareLogger.createLogger();
        const transport = _.find(logger.transports, { name: 'file' });

        expect(transport).to.not.undefined();
        expect(_.get(transport, 'dirname')).to.be.equal('/test');
        expect(logger).to.not.undefined();

        sinon.assert.called(fsExistsSpy);
        sinon.assert.notCalled(fsMkDirSpy);
    });

    it('enables logging to a file and creates the log file directory if it does not exist', () => {
        fsExistsSpy.returns(false);

        const labShareLogger = new LabShareLogger({
            file: {
                directory: '/test/',
            },
        } as LabShareLogConfig);
        const logger = labShareLogger.createLogger();
        const transport = _.find(logger.transports, { name: 'file' });

        expect(transport).to.not.undefined();
        expect(logger).to.not.undefined();

        sinon.assert.called(fsExistsSpy);
        sinon.assert.called(fsMkDirSpy);
    });

    it('fails to initialize file logging if the directory option is not set', () => {
        expect(
            () =>
                new LabShareLogger({
                    file: {
                        // "directory" option omitted
                    },
                } as LabShareLogConfig),
        ).to.throwError('File directory is not found.');
    });

    it('turns off console logging when configured', () => {
        const labShareLogger = new LabShareLogger({
            console: false,
        } as LabShareLogConfig);
        const logger = labShareLogger.createLogger();

        expect(logger.transports.length).to.be.exactly(0);
    });

    it('blocks additional logging strategies when disabled via configuration', () => {
        const labShareLogger = new LabShareLogger({
            disable: true,
            fluentD: {
                host: 'localhost',
            },
            splunk: {
                host: 'splunk.host',
                token: 'abcdef',
            },
        } as LabShareLogConfig);

        const logger = labShareLogger.createLogger();

        expect(logger.transports.length).to.be.exactly(1);
    });

    it('enables additional configured logging strategies by default', () => {
        const labShareLogger = new LabShareLogger({
            fluentD: {
                host: 'localhost',
            },
            splunk: {
                host: 'splunk.host',
                token: 'abcdef',
            },
        } as LabShareLogConfig);

        const logger = labShareLogger.createLogger();

        expect(logger.transports.length).to.be.exactly(3, '3 transports expected: console, fluentD, and splunk');
    });

    /**
     * This is testing an edge case because the current version of the winston-splunk-httplogger dependency
     * mutates the options passed in: https://github.com/adrianhall/winston-splunk-httplogger/blob/3191f7fd73ad762e745b73d298387224c08ff72b/index.js#L83
     */
    it('does not mutate the logger configuration when instantiating the splunk transport', () => {
        const config: LabShareLogConfig = {
            splunk: {
                host: 'splunk.host',
                token: 'abcdef',
                source: 'labshare',
                sourceType: 'app',
                index: 'app_logs',
            },
        } as LabShareLogConfig;

        const labshareLogger = new LabShareLogger(config);

        const logger = labshareLogger.createLogger();

        expect(logger.transports.length).to.be.exactly(2, '2 transports expected: console and splunk');
        expect(config.splunk).to.deepEqual(
            {
                host: 'splunk.host',
                token: 'abcdef',
                source: 'labshare',
                sourceType: 'app',
                index: 'app_logs',
            },
            'Splunk configuration options should not have been mutated',
        );
    });
});
