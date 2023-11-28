import { expect } from "../../testconfig";

import Parser  from './Parser';


describe("Parser", function () {

    describe("parses standard pragmas", function () {

        it("title", function () {
            const parser = new Parser('');
            const text = "#title Hello\n";

            expect(parser.parse(text).metadata.title).to.equal('Hello');
        });

        it("right", function () {
            const parser = new Parser('');
            const text = "#right Hello\n";

            expect(parser.parse(text).metadata.rightTitle).to.equal('Hello');
        });

        it("struct", function () {
            const parser = new Parser('');
            const text = "#structure A|B|A|B|C|B|B\n";

            expect(parser.parse(text).metadata.structure).to.deep.equal(['A', 'B', 'A', 'B', 'C', 'B', 'B']);
        });

    });
});
