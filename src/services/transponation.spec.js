/* eslint-disable jest/valid-expect */
import { expect } from "../testconfig";

import transponator from './transponation';


describe("transponator", function () {

    it("half step up, sharp", function () {
        const mapping = transponator.getChordMapping(['C'], 1, +1);
        expect(mapping['C']).to.equal("C♯");
    });

    it("half step up, flat", function () {
        const mapping = transponator.getChordMapping(['C'], 1, -1);
        expect(mapping['C']).to.equal("D♭");
    });

    it("whole step up, sharp", function () {
        const mapping = transponator.getChordMapping(['C'], 2, +1);
        expect(mapping['C']).to.equal("D");
    });

    it("whole step up, flat", function () {
        const mapping = transponator.getChordMapping(['C'], 2, -1);
        expect(mapping['C']).to.equal("D");
    });

});
