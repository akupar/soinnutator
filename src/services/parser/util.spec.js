/* eslint-disable jest/valid-expect */
import { expect } from "../../testconfig";

import { readPragma, removePragma }  from './util';


describe("readPragma", function () {

    it("reads pragmas with line of argument", function () {
        const text = "#test sometext\n";
        expect(readPragma(text)).to.deep.equal({ name: "test", content: "sometext" });
    });

    it("reads pragmas with line of multiword argument", function () {
        const text = "#test this is the argument\n";
        expect(readPragma(text)).to.deep.equal({ name: "test", content: "this is the argument" });
    });

    it("reads pragmas with line of arguments and no more", function () {
        const text = "#test this is the argument\n#test2 not this\n";
        expect(readPragma(text)).to.deep.equal({ name: "test", content: "this is the argument" });
    });

    it("can read pragmas in ascii camelcase", function () {
        const text = "#camelCasePragma this is the argument\n";
        expect(readPragma(text)).to.deep.equal({ name: "camelCasePragma", content: "this is the argument" });
    });

    it("can read pragmas with underscores", function () {
        const text = "#pragma_with_underscores this is the argument\n";
        expect(readPragma(text)).to.deep.equal({ name: "pragma_with_underscores", content: "this is the argument" });
    });

});

describe("removePragma", function () {

    it("removes pragmas, arguments and new line", function () {
        const text = "#test this is the argument\n";
        expect(removePragma("test", text)).to.deep.equal("");
    });

    it("removes pragmas, arguments and new line, but nothing else", function () {
        const text = "#test this is the argument\n#test2 not this\n";
        expect(removePragma("test", text)).to.deep.equal("#test2 not this\n");
    });

    it("can remove pragmas with underscores", function () {
        const text = "#pragma_with_underscores this is the argument\n";
        expect(removePragma("pragma_with_underscores", text)).to.deep.equal("");
    });

});
