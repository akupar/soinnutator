import { parseLineGroup } from './lineGroup';
import { makeId, resetIds } from './id';
import { readPragma, removePragma } from './util';



export default class Parser {
    inputConvention;

    constructor(inputConvention) {
        this.inputConvention = inputConvention;
    }

    parsePhrase(text) {
        const phrase = {
            id: makeId('phr'),
            measures: [
                {
                    id: makeId('m'),
                    rows : [],
                    breaks : [],
                    firstIndex: 0
                }
            ],
        }

        if ( text === "" ) {
            return "";
        }

        console.assert( text.indexOf("\n\n") === -1, "text should be a single phrase" );

        const lines = text.split("\n").filter(line => (line.trim() !== ""));

        let positiveStartIndex = lines.findIndex(line => {
            return (line.trimEnd() === "#0")
        });

        if ( positiveStartIndex === -1 ) {
            positiveStartIndex = 0;
        }

        const regularLines = lines.filter(line => (line.trimEnd() !== "#0"));

        phrase.measures = parseLineGroup(regularLines, positiveStartIndex, this.inputConvention);

        return phrase;
    }

    parseSection(text) {
        const section = {
            title: null,
            id: makeId('s'),
            phrases: []
        };

        const phrases = text.split(/\n\n\n*/).filter(text => (text !== ""));

        if ( phrases.length === 0 ) {
            return section;
        }

        const m = phrases[0].match(/^\n*#section ?(.*)/);
        if ( m ) {
	    section.title = m[1];
	    phrases.shift();
        }

        section.phrases = phrases.map(this.parsePhrase.bind(this));

        return section;
    }



    parse(text) {
        resetIds();
        const doc = {
            title: null,
            rightTitle: null,
            sections: [],
        };

        let pragma;
        while ( (pragma = readPragma(text)) !== null ) {
            const { name, content } = pragma;
            if ( name === "title" ) {
                doc.title = content;
                text = removePragma("title", text);
            } else if ( name === "right" ) {
                doc.rightTitle = content;
                text = removePragma("right", text);
            } else if ( name === "section" ) {
                break;
            } else {
                throw new Error(`Unexpected or unknown pragma: ${name}`);
            }

            text = text.replace(/^\n+/, "");
        }

        const sections = text.split(/\n(?=#section)/);

        sections.forEach(sectionText => {
	    doc.sections.push(this.parseSection(sectionText));
        });

        return doc;
    }

};
