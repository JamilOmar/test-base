import { sinon } from '@loopback/testlab';
import { LabShareLogger } from '../../labshare.logger';
import * as fs from 'fs';
import path = require('path');
export class SpyHelper {
    // tslint:disable-next-line:no-any
    public static createLabShareLoggerSpy(name: any) {
        return sinon.stub(LabShareLogger.prototype, name);
    }

    public static deleteSpy(spy: sinon.SinonSpy): void {
        spy.restore();
    }

    public static deleteAll(): void {
        sinon.restore();
    }
    // tslint:disable-next-line:no-any
    public static createFsSpy(name: any) {
        return sinon.stub(fs, name);
    }

    public static createPathSpy() {
        return sinon.stub(path);
    }
}
