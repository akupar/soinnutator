/* eslint-disable jest/valid-expect */
import { expect } from "../../testconfig.js";

import { parseLineGroup } from './lineGroup';


describe("parseLineGroup", function () {

    it("returns empty list with empty input", function () {
        const lines = [
        ];

        const blocks = parseLineGroup(lines, -1);

        expect(blocks).to.deep.equal([]);
    });

    it("returns empty list with empty line", function () {
        const lines = [
            ""
        ];

        {
            const blocks = parseLineGroup(lines, -1);

            expect(blocks).to.deep.equal([]);
        }

        {
            const blocks = parseLineGroup(lines, 0);

            expect(blocks).to.deep.equal([]);
        }
    });

    it("parses single chord line", function () {
        const lines = [
            "| C F | G"
        ];

        const blocks = parseLineGroup(lines, 0);

        expect(blocks[0].rows[0].text).to.equal("C");
        expect(blocks[1].rows[0].text).to.equal("F");
        expect(blocks[2].rows[0].text).to.equal("G");
    });

    it("parses single lyric line", function () {
        const lines = [
            "Para bailar la | bamba"
        ];

        const blocks = parseLineGroup(lines, -1);

        expect(blocks[0].rows[0].text).to.equal("Para bailar la");
        expect(blocks[1].rows[0].text).to.equal("bamba");
    });


    it("parses separates measures by chord on chord line", function () {
        const lines = [
            "| C     | G Am C",
            "| hello | bana-na"
        ];

        const blocks = parseLineGroup(lines, 0);

        expect(blocks[0].rows[0].text).to.equal("C");
        expect(blocks[0].rows[1].text).to.equal("hello");

        expect(blocks[1].rows[0].text).to.equal("G");
        expect(blocks[1].rows[1].text).to.equal("ba");

        expect(blocks[2].rows[0].text).to.equal("Am");
        expect(blocks[2].rows[1].text).to.equal("na-");

        expect(blocks[3].rows[0].text).to.equal("C");
        expect(blocks[3].rows[1].text).to.equal("na");

    });

    it("parses separates measures on multiple lines by chord on chord line", function () {
        const lines = [
            "| C     | G   F",
            "| hello | banana",
            "| uh oh | mañana"
        ];

        const blocks = parseLineGroup(lines, 0);

        expect(blocks[0].rows[0].text).to.equal("C");
        expect(blocks[0].rows[1].text).to.equal("hello");
        expect(blocks[0].rows[2].text).to.equal("uh oh");

        expect(blocks[1].rows[0].text).to.equal("G");
        expect(blocks[1].rows[1].text).to.equal("bana");
        expect(blocks[1].rows[2].text).to.equal("maña");

        expect(blocks[2].rows[0].text).to.equal("F");
        expect(blocks[2].rows[1].text).to.equal("na");
        expect(blocks[2].rows[2].text).to.equal("na");

    });

    it("separates measures by two spaces on any line", function () {
        const lines = [
            "| Am              Dm            | Am             E7",
            "| Once there were green- fields | kissed by  the sun;",
            "| Vie  säv-  el   muis-  ton,   | niit-  ty- jen luo"
        ];

        const blocks = parseLineGroup(lines, 0);

        expect(blocks[0].rows[0].text).to.equal("Am");
        expect(blocks[0].rows[1].text).to.equal("Once");
        expect(blocks[0].rows[2].text).to.equal("Vie");

        expect(blocks[1].rows[0].text).to.equal("");
        expect(blocks[1].rows[1].text).to.startWith("there");
        expect(blocks[1].rows[2].text).to.startWith("säv");

        expect(blocks[2].rows[0].text).to.equal("");
        expect(blocks[2].rows[1].text).to.startWith("were");
        expect(blocks[2].rows[2].text).to.startWith("el");

        expect(blocks[3].rows[0].text).to.equal("Dm");
        expect(blocks[3].rows[1].text).to.startWith("green");
        expect(blocks[3].rows[2].text).to.startWith("muis");

        expect(blocks[4].rows[0].text).to.equal("");
        expect(blocks[4].rows[1].text).to.startWith("fields");
        expect(blocks[4].rows[2].text).to.startWith("ton");

        expect(blocks[5].rows[0].text).to.equal("Am");
        expect(blocks[5].rows[1].text).to.startWith("kissed");
        expect(blocks[5].rows[2].text).to.startWith("niit");

        expect(blocks[6].rows[0].text).to.equal("");
        expect(blocks[6].rows[1].text).to.startWith("by");
        expect(blocks[6].rows[2].text).to.startWith("ty");

        expect(blocks[7].rows[0].text).to.equal("");
        expect(blocks[7].rows[1].text).to.startWith("the");
        expect(blocks[7].rows[2].text).to.startWith("jen");

        expect(blocks[8].rows[0].text).to.equal("E7");
        expect(blocks[8].rows[1].text).to.startWith("sun;");
        expect(blocks[8].rows[2].text).to.startWith("luo");


    });

    it("separates measures by underscore inside a word on any line", function () {
        const lines = [
            "| Am              Dm          | Am            E7",
            "| Once there were greenfields | kissed by the sun;",
            "| Vie  säv___el   muis_ton,   | niit___ty_jen luo"
        ];

        const blocks = parseLineGroup(lines, 0);

        expect(blocks[0].rows[0].text).to.equal("Am");
        expect(blocks[0].rows[1].text).to.equal("Once");
        expect(blocks[0].rows[2].text).to.equal("Vie");

        expect(blocks[1].rows[0].text).to.equal("");
        expect(blocks[1].rows[1].text).to.equal("there");
        expect(blocks[1].rows[2].text).to.equal("säv-");

        expect(blocks[2].rows[0].text).to.equal("");
        expect(blocks[2].rows[1].text).to.equal("were");
        expect(blocks[2].rows[2].text).to.equal("el");

        expect(blocks[3].rows[0].text).to.equal("Dm");
        expect(blocks[3].rows[1].text).to.equal("green");
        expect(blocks[3].rows[2].text).to.equal("muis-");

        expect(blocks[4].rows[0].text).to.equal("");
        expect(blocks[4].rows[1].text).to.equal("fields");
        expect(blocks[4].rows[2].text).to.equal("ton,");

        expect(blocks[5].rows[0].text).to.equal("Am");
        expect(blocks[5].rows[1].text).to.equal("kissed");
        expect(blocks[5].rows[2].text).to.equal("niit-");

        expect(blocks[6].rows[0].text).to.equal("");
        expect(blocks[6].rows[1].text).to.equal("by");
        expect(blocks[6].rows[2].text).to.equal("ty-");

        expect(blocks[7].rows[0].text).to.equal("");
        expect(blocks[7].rows[1].text).to.equal("the");
        expect(blocks[7].rows[2].text).to.equal("jen");

        expect(blocks[8].rows[0].text).to.equal("E7");
        expect(blocks[8].rows[1].text).to.equal("sun;");
        expect(blocks[8].rows[2].text).to.equal("luo");

    });

    it("separates measures when chord line is not present", function () {
        const lines = [
            "| Once there were  greenfields | kissed by the  sun;",
            "| Vie  säv___elxxx muis_ton,   | niit___ty_jen  luo"
        ];

        const blocks = parseLineGroup(lines, -1);

        expect(blocks[0].rows[0].text).to.equal("Once");
        expect(blocks[0].rows[1].text).to.equal("Vie");

        expect(blocks[1].rows[0].text).to.equal("there");
        expect(blocks[1].rows[1].text).to.equal("säv-");

        expect(blocks[2].rows[0].text).to.equal("were");
        expect(blocks[2].rows[1].text).to.equal("elxxx");

        expect(blocks[3].rows[0].text).to.equal("green");
        expect(blocks[3].rows[1].text).to.equal("muis-");

        expect(blocks[4].rows[0].text).to.equal("fields");
        expect(blocks[4].rows[1].text).to.equal("ton,");

        expect(blocks[5].rows[0].text).to.equal("kissed");
        expect(blocks[5].rows[1].text).to.equal("niit-");

        expect(blocks[6].rows[0].text).to.equal("by");
        expect(blocks[6].rows[1].text).to.equal("ty-");

        expect(blocks[7].rows[0].text).to.equal("the");
        expect(blocks[7].rows[1].text).to.equal("jen");

        expect(blocks[8].rows[0].text).to.equal("sun;");
        expect(blocks[8].rows[1].text).to.equal("luo");

    });

    it("separates first measure even if it doen't have a chord", function () {
        const lines = [
            "        | Am                       | Em",
            "Dans le | port d'Amsterdam y a des | marins qui chantent",
            "Kirottu | Amsterdam, siunattu      | Amsterdam,"
        ];

        const blocks = parseLineGroup(lines, 0);

        expect(blocks[0].rows[0].text).to.equal("");
        expect(blocks[0].rows[1].text).to.equal("Dans le");
        expect(blocks[0].rows[2].text).to.equal("Kirottu");

        expect(blocks[1].rows[0].text).to.equal("Am");
        expect(blocks[1].rows[1].text).to.startsWith("port");
        expect(blocks[1].rows[2].text).to.startsWith("Amsterdam");


    });

    it("separates by bar on chord line", function () {
        const lines = [
            "              | Am           | F",
            "Where are you | now my companjera?",
        ];

        const blocks = parseLineGroup(lines, 0);

        expect(blocks[0].rows[0].text).to.equal("");
        expect(blocks[0].rows[1].text).to.equal("Where are you");

        expect(blocks[1].rows[0].text).to.equal("Am");
        expect(blocks[1].rows[1].text).to.startsWith("now my compan");

        expect(blocks[2].rows[0].text).to.equal("F");
        expect(blocks[2].rows[1].text).to.startsWith("jera?");
    });

    it("separates by bar on vocal line", function () {
        const lines = [
            "              | Am           | F",
            "Where are you | now my companjera?",
        ];

        const blocks = parseLineGroup(lines, 0);

        expect(blocks[0].rows[0].text).to.equal("");
        expect(blocks[0].rows[1].text).to.equal("Where are you");

        expect(blocks[1].rows[0].text).to.equal("Am");
        expect(blocks[1].rows[1].text).to.startsWith("now my compan");

        expect(blocks[2].rows[0].text).to.equal("F");
        expect(blocks[2].rows[1].text).to.startsWith("jera?");
    });

    it("aligns lyrics", function () {
        const lines = [
            "    | G             | E7",
            "Out | of the window | is my mission",
            "                               Where are you"
        ];

        const blocks = parseLineGroup(lines, 0);

        expect(blocks[0].rows[0].text).to.equal("");
        expect(blocks[0].rows[1].text).to.equal("Out");
        expect(blocks[0].rows[2].text).to.equal("");

        expect(blocks[1].rows[0].text).to.equal("G");
        expect(blocks[1].rows[1].text).to.startsWith("of the window");
        expect(blocks[1].rows[2].text).to.equal("");

        expect(blocks[2].rows[0].text).to.equal("E7");
        expect(blocks[2].rows[1].text).to.equal("is my mis");
        expect(blocks[2].rows[2].text).to.equal("");

        expect(blocks[3].rows[0].text).to.equal("");
        expect(blocks[3].rows[1].text).to.equal("sion");
        expect(blocks[3].rows[2].text).to.equal("Where are you");
    });

    it("breaks on bars on any line", function () {
        const lines = [
            "   | C      F     G             | C",
            "aa | bbb cc ddd eee | ff ggg hh | ii",
        ];

        const blocks = parseLineGroup(lines, 0);

        expect(blocks[0].rows[0].text).to.equal("");
        expect(blocks[0].rows[1].text).to.equal("aa");

        expect(blocks[1].rows[0].text).to.equal("C");
        expect(blocks[1].rows[1].text).to.equal("bbb cc");

        expect(blocks[2].rows[0].text).to.equal("F");
        expect(blocks[2].rows[1].text).to.equal("ddd ee");

        expect(blocks[3].rows[0].text).to.equal("G");
        expect(blocks[3].rows[1].text).to.equal("e");

        expect(blocks[4].rows[0].text).to.equal("");
        expect(blocks[4].rows[1].text).to.equal("ff ggg hh");

        expect(blocks[5].rows[0].text).to.equal("C");
        expect(blocks[5].rows[1].text).to.equal("ii");

    });

});
