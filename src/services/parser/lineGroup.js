import { normalizeChord } from '../englishGerman';
import { makeId } from './id';


function getChordLineBreaks(chordLine) {
    const breaks = new Set();

    // e.g. "| C F  G" -> positions of "| C", "F", "G"
    const re = new RegExp(/([|¦] ?[^ ]| [^ |¦])/g);

    let match;
    while ( (match = re.exec(chordLine)) !== null ) {
	const point = match.index;
        if ( match[0][0] === '|' ) {
	    breaks.add(point);
        } else {
            breaks.add(point + 1);
        }
    }

    return breaks;
}

function getAlignmentBreaks(str) {
    const breaks = new Set();

    // At least two spaces before a non-space,
    // or _ in the middle of a word.
    const re = new RegExp(/( {2}[^ ]|[^_ ]_+[^_ ])/g);

    let match;
    while ( (match = re.exec(str)) !== null ) {
	const point = match.index;
        const len = match[0].length;
	breaks.add(point + len - 1);
    }

    return breaks;
}

function getForcedBreaks(str) {
    const breaks = new Set();
    const re = new RegExp(/[|¦]/g);

    let match;
    while ( (match = re.exec(str)) !== null ) {
	const point = match.index;
	breaks.add(point);
    }

    return breaks;
}


function unionBreaks(...breakSets) {
    const output = new Set();

    for ( const breakSet of breakSets ) {
        for (const elem of breakSet) {
            output.add(elem);
        }
    }

    return output;
}


function splitLine(line, breaks) {
    const parts = [];

    let start = 0;
    for ( const brk of breaks ) {
        if ( brk > 0 ) {
            parts.push(line.substring(start, brk));
            start = brk;
        }
    }

    if ( start !== line.length ) {
        parts.push(line.substring(start));
    }

    return parts;
}

function transpose(inputArray) {
    var outputArray = [];

    if ( inputArray.length === 0 ) {
        return [];
    }


    for ( let colIndex = 0; colIndex < inputArray[0].length; colIndex++ ) {
        outputArray[colIndex] = [];
        for ( let rowIndex = 0; rowIndex < inputArray.length; rowIndex++ ) {
            outputArray[colIndex][rowIndex] = inputArray[rowIndex][colIndex];
        }
    }

    return outputArray;
}

class Chord {
    pre;
    letter;
    post;

    constructor(text, inputConvention) {
        const match = text.match(/([(]?)([A-H])([#b♯♭]?)(.*)/);
        if ( !match ) {
            //throw new Error("Not a chord: >"+  text + "<");
        }

        const [_, pre, letter, accidentalIn, post] = match;
        const accidental = accidentalIn === "#" ? "♯" :
                           (accidentalIn === "b" ? "♭" : accidentalIn)
        const letterAcc = letter + accidental;
        this.pre = pre;
        this.letter = normalizeChord(letterAcc, inputConvention);
        this.post = post;
    }

    toString() {
        return this.pre + this.letter + this.post;
    }
}

class BlockLine {
    data;

    constructor(index, spaceAfter, data, bar, id) {
        this.index = index;
        this.spaceAfter = spaceAfter;
        this.data = data;
        this.bar = bar;
        this.id = id;
    }

    get text() {
        return this.data.toString();
    }
}

function getBlock(rowsOfPart, chordLineIndex, inputConvention) {
    const block = {};

    block.rows = rowsOfPart.map(function (rowOfPart, index) {
        let text = rowOfPart ?? "";
        let spaceAfter = text.endsWith(" ");
        let bar = null;
        if ( text.startsWith("|") || text.startsWith("¦") ) {
            bar = text[0];
            text = text.replace(/^[|¦] ?/, "");
        }

        text = text.replace(/_+$/, "-");
        text = text.trim();

        // Chord row
        if ( index - chordLineIndex === 0 ) {
            try {
                return new BlockLine(0, spaceAfter, text !== "" ? new Chord(text, inputConvention) : "", bar, makeId('m'));
            } catch ( _ ) {
                return new BlockLine(0, spaceAfter, text, bar, makeId('m'));
            }
        }

        return {
            index: index - chordLineIndex,
            id: makeId('m'),
            spaceAfter,
            text,
            bar,
        };

    });

    return block;
}



export function parseLineGroup(lines, chordLineIndex, inputConvention) {

    const chordBreaks = getChordLineBreaks(lines[chordLineIndex]);
    const alignmentBreaksByLines = lines.map(line => getAlignmentBreaks(line));
    const forcedBreaksByLines = lines.map(line => getForcedBreaks(line));

    const breaks = Array.from(
        unionBreaks(
            chordBreaks,
            ...alignmentBreaksByLines,
            ...forcedBreaksByLines
        )
    ).sort((a, b) => a - b);


    const partsOfLines = lines.map(line => splitLine(line, breaks));
    const partGroups = transpose(partsOfLines);


    const blocks = partGroups.map(partGroup => getBlock(partGroup, chordLineIndex, inputConvention));


    return blocks;
};
