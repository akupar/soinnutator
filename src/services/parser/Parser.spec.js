import { expect } from "../../testconfig";

import Parser  from './Parser';


describe("Parser", function () {

    describe("parses standard pragmas", function () {

        it("title", function () {
            const parser = new Parser('');
            const text = "#title Hello\n";

            expect(parser.parse(text).title).to.equal('Hello');
        });

        it("right", function () {
            const parser = new Parser('');
            const text = "#right Hello\n";

            expect(parser.parse(text).rightTitle).to.equal('Hello');
        });

    });
});
