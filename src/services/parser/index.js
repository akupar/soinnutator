import { parseLineGroup } from './lineGroup';
import { makeId, resetIds } from './id';



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


    readPragma(pragmaName, text) {
        const m = text.match(new RegExp('^\n*#' + pragmaName + '(.*)\n'));
        if ( m ) {
	    return m[1].trim();
        }

        return null;
    }

    removePragma(pragmaName, text) {
        return text.replace(new RegExp('^\n*#' + pragmaName + '(.*?)\n+'), "");
    }

    parse(text, inputConvention) {
        resetIds();
        const doc = {
            title: null,
            rightTitle: null,
            sections: [],
        };

        doc.title = this.readPragma("title", text)
        text = this.removePragma("title", text)

        doc.rightTitle = this.readPragma("right", text)
        text = this.removePragma("right", text)

        text = text.replace(/^\n+/, "");

        const sections = text.split(/\n(?=#section)/);

        sections.forEach(sectionText => {
	    doc.sections.push(this.parseSection(sectionText));
        });

        return doc;
    }

};
