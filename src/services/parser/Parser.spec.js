import { expect, MultiLineString as lines } from "../../testconfig";

import Parser  from './Parser';


describe("Parser", function () {

    describe(".parse", function () {
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

        describe("parses non-functional, missing or extra whitespace as no white space", function () {

            it("parses no new line at the end", function () {
                const parser = new Parser('');
                const text = "#title Hello";

                expect(parser.parse(text).metadata.title).to.equal('Hello');
            });

            it("parses extra new lines lines at the beginning", function () {
                const parser = new Parser('');
                const text = lines(
                    '',
                    '',
                    '',
                    '#title Hello',
                );

                const doc = parser.parse(text);
                expect(doc.metadata.title).to.equal('Hello');
                expect(doc.sections.length).to.equal(0);
            });

            it("parses extra new lines at the end", function () {
                const parser = new Parser('');
                const text = lines(
                    '#title Hello',
                    '',
                    '',
                    '',
                );

                const doc = parser.parse(text);

                expect(doc.metadata.title).to.equal('Hello');
                expect(doc.sections.length).to.equal(0);
            });

            it("parses extra new lines between pragmas and sections", function () {
                const parser = new Parser('');
                const text = lines(
                    '#section Verse 1',
                    '',
                    '#section Verse 2',
                    '',
                    '#section Verse 3',
                );


                const doc = parser.parse(text);

                expect(doc.sections.length).to.equal(3);
            });

            it("parses sections without new line between", function () {
                const parser = new Parser('');
                const text = lines(
                    '#section Verse 1',
                    '#section Verse 2',
                    '#section Verse 3',
                );


                const doc = parser.parse(text);

                expect(doc.sections.length).to.equal(3);
            });

            it("parses phrases within sections without content as zero length array", function () {
                const parser = new Parser('');
                const text = lines(
                    '#section Verse 1',
                    '#section Verse 2',
                    '#section Verse 3',
                );


                const doc = parser.parse(text);


                expect(doc.sections[0].phrases.length).to.equal(0);
                expect(doc.sections[1].phrases.length).to.equal(0);
                expect(doc.sections[2].phrases.length).to.equal(0);
            });

        });
    });

    describe("parses sections", function () {

        it("returns 0-length section ligst when no sections", function () {
            const parser = new Parser('');
            const text = "#title Hello\n";

            expect(parser.parse(text).sections.length).to.equal(0);
        });

        it("sections", function () {
            const parser = new Parser('');
            const text = lines(
                '#section Verse 1',
                '',
                '#section Verse 2',
            );

            expect(parser.parse(text).sections.length).to.equal(2);

        });

    });

    describe("parses phrases", function () {

        it("parses phrases with only chord lines", function () {
            const parser = new Parser('');
            const text = lines(
                '#section Verse 1',
                '',
                'Am | Em | Dm | Dm',
            );

            const doc = parser.parse(text);
            expect(doc.sections.length).to.equal(1);
            expect(doc.sections[0].phrases.length).to.equal(1);
            expect(doc.sections[0].phrases[0].measures.length).to.equal(4);
        });

        it("parses phrases that appear outside section as a section with no title (with song title)", function () {
            const parser = new Parser('');
            const text = lines(
                '#title My Song',
                '',
                'Am | Em | Dm | Dm',
            );

            const doc = parser.parse(text);
            expect(doc.sections.length).to.equal(1);
            expect(doc.sections[0].title).to.equal(null);
            expect(doc.sections[0].phrases.length).to.equal(1);
            expect(doc.sections[0].phrases[0].measures.length).to.equal(4);
        });

        it("parses phrases that appear outside section as a section with no title (no song title)", function () {
            const parser = new Parser('');
            const text = lines(
                'Am | Em | Dm | Dm',
            );

            const doc = parser.parse(text);
            expect(doc.sections.length).to.equal(1);
            expect(doc.sections[0].title).to.equal(null);
            expect(doc.sections[0].phrases.length).to.equal(1);
            expect(doc.sections[0].phrases[0].measures.length).to.equal(4);
        });


        it("parses phrases that appear outside section as a section with no title (multiple phrases)", function () {
            const parser = new Parser('');
            const text = lines(
                'Am | Em | Dm | Dm',
                '',
                'Am | Em | Dm | Dm',
                '',
                'Am | Em | Dm | Dm',
            );

            const doc = parser.parse(text);
            expect(doc.sections.length).to.equal(1);
            expect(doc.sections[0].title).to.equal(null);
            expect(doc.sections[0].phrases.length).to.equal(3);
            expect(doc.sections[0].phrases[0].measures.length).to.equal(4);
        });


        it("parses phrases that appear outside section as a section with no title (multiple phrases)", function () {
            const parser = new Parser('');
            const text = lines(
                '#section Test',
                '',
                'Am  | Em   | Dm  | Dm',
                'Be- | bob- | ba  | lula',
                '',
                'Am  | Em   | Dm  | Dm',
                'Be- | bob- | ba  | lula',
            );

            const doc = parser.parse(text);
            expect(doc.sections.length).to.equal(1);
            expect(doc.sections[0].title).to.equal('Test');
            expect(doc.sections[0].phrases.length).to.equal(2);
            expect(doc.sections[0].phrases[0].measures.length).to.equal(4);

            const firstMeasure = doc.sections[0].phrases[0].measures[0];
            const firstChord = firstMeasure.rows[0].data;
            const firstWord = firstMeasure.rows[1].text;
            expect(firstChord).to.deep.equal({
                letter: 'A',
                pre: '',
                post: 'm'
            });

            expect(firstWord).to.deep.equal('Be-');

        });


    });

});
