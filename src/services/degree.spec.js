/* eslint-disable jest/valid-expect */
/* eslint-disable no-lone-blocks */
import { expect } from "../testconfig";

import degreer from "./degree";


describe("getNoteDegree", function () {

    it("returns I degrees", function () {
        {
            const degree = degreer.getNoteDegree("C", 0, 0);
            expect(degree).to.equal("I");
        }
        {
            const degree = degreer.getNoteDegree("D", 2, 1);
            expect(degree).to.equal("I");
        }
        {
            const degree = degreer.getNoteDegree("E", 4, 2);
            expect(degree).to.equal("I");
        }
        {
            const degree = degreer.getNoteDegree("F", 5, 3);
            expect(degree).to.equal("I");
        }
        {
            const degree = degreer.getNoteDegree("G", 7, 4);
            expect(degree).to.equal("I");
        }
        {
            const degree = degreer.getNoteDegree("A", 9, 5);
            expect(degree).to.equal("I");
        }
        {
            const degree = degreer.getNoteDegree("B", 11, 6);
            expect(degree).to.equal("I");
        }
    });

    it("returns II degrees", function () {
        {
            const degree = degreer.getNoteDegree("C", -2, -1);
            expect(degree).to.equal("II");
        }
        {
            const degree = degreer.getNoteDegree("D", 0, 0);
            expect(degree).to.equal("II");
        }
        {
            const degree = degreer.getNoteDegree("E", 2, 1);
            expect(degree).to.equal("II");
        }
        {
            const degree = degreer.getNoteDegree("F", 3, 2);
            expect(degree).to.equal("II");
        }
        {
            const degree = degreer.getNoteDegree("G", 5, 3);
            expect(degree).to.equal("II");
        }
        {
            const degree = degreer.getNoteDegree("A", 7, 4);
            expect(degree).to.equal("II");
        }
        {
            const degree = degreer.getNoteDegree("B", 9, 5);
            expect(degree).to.equal("II");
        }
        {
            const degree = degreer.getNoteDegree("C", 10, 6);
            expect(degree).to.equal("II");
        }
    });




});


describe("getNoteMapping", function () {

    it("returns degrees in C", function () {
        {
            const mapping = degreer.getNoteMapping(["C", "D", "E", "F", "G", "A", "B"], "C");
            expect(mapping).to.deep.equal({ C: 'I', D: 'II', E: 'III', F: 'IV', G: 'V', A: 'VI', B: 'VII' });
        }
    });

    it("returns degrees in D", function () {
        {
            const mapping = degreer.getNoteMapping(["D", "E", "F♯", "G", "A", "B", "C♯"], "D");
            expect(mapping).to.deep.equal({ D: 'I', E: 'II', 'F♯': 'III', G: 'IV', A: 'V', B: 'VI', 'C♯': 'VII' });
        }
    });


});

describe("getNoteMappings", function () {

    it("returns correct mapping among others", function () {
        {
            const mappings = degreer.getNoteMappings(["C♯", "D", "E", "F♯", "G♯", "A", "B"]);
            expect(mappings['A']).to.deep.equal({
                'C♯': 'III',
                D: 'IV',
                E: 'V',
                'F♯': 'VI',
                'G♯': 'VII',
                A: 'I',
                B: 'II'
            });
        }
    });
});

describe("getBestMapping", function () {

    it("returns best mapping", function () {
        {
            const mapping = degreer.getBestMapping(["C♯", "D", "E", "F♯", "G♯", "A", "B"]);
            expect(mapping).to.deep.equal({
                'C♯': 'III',
                D: 'IV',
                E: 'V',
                'F♯': 'VI',
                'G♯': 'VII',
                A: 'I',
                B: 'II'
            });
        }
    });

    it("returns best mapping 2", function () {
        {
            const mapping = degreer.getBestMapping(["C♯", "D♯", "E", "F♯", "G♯", "A", "B"]);
            expect(mapping).to.deep.equal({"E": "I", "F♯": "II", "G♯": "III", "A": "IV", "B": "V", "C♯": "VI", "D♯": "VII"});
        }
    });


});


describe("getChordMapping", function () {
    describe("Key C", function () {
        it("returns degrees in C–F–G (fixed)", function () {
            {
                const mapping = degreer.getChordMapping(["C", "F", "G"], "C");
                expect(mapping).to.deep.equal({ C: 'I', F: 'IV', G: 'V' });
            }
        });

        it("returns degrees in C (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["C"]);
                expect(mapping).to.deep.equal({ C: 'I' });
            }
        });

        it("returns degrees in C–G (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["C", "G"]);
                expect(mapping).to.deep.equal({ C: 'I', G: 'V' });
            }
        });

        it("returns degrees in C–F–G (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["C", "F", "G"]);
                expect(mapping).to.deep.equal({ C: 'I', F: 'IV', G: 'V' });
            }
        });

        it("returns degrees in C–F–G–Am (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["C", "F", "G", "Am"]);
                expect(mapping).to.deep.equal({ C: 'I', F: 'IV', G: 'V', Am: 'VIm' });
            }
        });

        it("returns degrees in Am–Em (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["Am", "Em"]);
                expect(mapping).to.deep.equal({ Am: 'Im', Em: 'Vm' });
            }
        });
    });


    describe("Key D", function () {
        it("returns degrees in D–G–A (fixed)", function () {
            {
                const mapping = degreer.getChordMapping(["D", "G", "A"], "D");
                expect(mapping).to.deep.equal({ D: 'I', G: 'IV', A: 'V' });
            }
        });

        it("returns degrees in D–A (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["D", "A"]);
                expect(mapping).to.deep.equal({ D: 'I', A: 'V' });
            }
        });

        it("returns degrees in D–G–A (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["D", "G", "A"]);
                expect(mapping).to.deep.equal({ D: 'I', G: 'IV', A: 'V' });
            }
        });

        it("returns degrees in D–G–A–Bm (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["D", "G", "A", "Bm"]);
                expect(mapping).to.deep.equal({ D: 'I', G: 'IV', A: 'V', Bm: 'VIm' });
            }
        });
    });


    describe("Key G", function () {
        it("returns degrees in G–C–D (fixed)", function () {
            {
                const mapping = degreer.getChordMapping(["G", "C", "D"], "G");
                expect(mapping).to.deep.equal({ G: 'I', C: 'IV', D: 'V' });
            }
        });

        it("returns degrees in G–D (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["G", "D"]);
                expect(mapping).to.deep.equal({ G: 'I', D: 'V' });
            }
        });

        it("returns degrees in G–C–D (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["G", "C", "D"]);
                expect(mapping).to.deep.equal({ G: 'I', C: 'IV', D: 'V' });
            }
        });

        it("returns degrees in G–C–D–Am (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["G", "C", "D", "Em"]);
                expect(mapping).to.deep.equal({ G: 'I', C: 'IV', D: 'V', Em: 'VIm' });
            }
        });

        it("returns degrees in Am–Em (guess)", function () {
            {
                const mapping = degreer.getChordMapping(["Am", "Em"]);
                expect(mapping).to.deep.equal({ Am: 'Im', Em: 'Vm' });
            }
        });
    });



});
