const values = {
    "C": { index: 0, pos: 0, d: 0 },
    "C♯": { index: 1, pos: 0, d: +1 },
    "C𝄪": { index: 2, pos: 0, d: +2 },
    "D𝄫": { index: 0, pos: 1, d: -2 },
    "D♭": { index: 1, pos: 1, d: -1 },
    "D": { index: 2, pos: 1, d: 0 },
    "D♯": { index: 3, pos: 1, d: +1 },
    "D𝄪": { index: 4, pos: 1, d: +2 },
    "E𝄫": { index: 2, pos: 2, d: -2 },
    "E♭": { index: 3, pos: 2, d: -1 },
    "E": { index: 4, pos: 2, d: 0 },
    "E♯": { index: 5, pos: 2, d: +1 },
    "E𝄪": { index: 6, pos: 2, d: +2 },
    "F𝄫": { index: 3, pos: 3, d: -2 },
    "F♭": { index: 4, pos: 3, d: -1 },
    "F": { index: 5, pos: 3, d: 0 },
    "F♯": { index: 6, pos: 3, d: +1 },
    "F𝄪": { index: 7, pos: 3, d: +2 },
    "G𝄫": { index: 5, pos: 4, d: -2 },
    "G♭": { index: 6, pos: 4, d: -1 },
    "G": { index: 7, pos: 4, d: 0 },
    "G♯": { index: 8, pos: 4, d: +1 },
    "G𝄪": { index: 9, pos: 4, d: +2 },
    "A𝄫": { index: 7, pos: 5, d: -2 },
    "A♭": { index: 8, pos: 5, d: -1 },
    "A": { index: 9, pos: 5, d: 0 },
    "A♯": { index: 10, pos: 5, d: +1 },
    "A𝄪": { index: 11, pos: 5, d: +2 },
    "B𝄫": { index: 9, pos: 6, d: -2 },
    "B♭": { index: 10, pos: 6, d: -1 },
    "B": { index: 11, pos: 6, d: 0 },
    "B♯": { index: 0, pos: 6, d: +1 },
    "B𝄪": { index: 1, pos: 6, d: +2 },
    "C𝄫": { index: 10, pos: 0, d: -2 },
    "C♭": { index: 11, pos: 0, d: -1 }
};

const degrees = {
    "I": { index: 0, pos: 0, d: 0 },
    "I♯": { index: 1, pos: 0, d: +1 },
    "I𝄪": { index: 2, pos: 0, d: +2 },
    "II𝄫": { index: 0, pos: 1, d: -2 },
    "II♭": { index: 1, pos: 1, d: -1 },
    "II": { index: 2, pos: 1, d: 0 },
    "II♯": { index: 3, pos: 1, d: +1 },
    "II𝄪": { index: 4, pos: 1, d: +2 },
    "III𝄫": { index: 2, pos: 2, d: -2 },
    "III♭": { index: 3, pos: 2, d: -1 },
    "III": { index: 4, pos: 2, d: 0 },
    "III♯": { index: 5, pos: 2, d: +1 },
    "III𝄪": { index: 6, pos: 2, d: +2 },
    "IV𝄫": { index: 3, pos: 3, d: -2 },
    "IV♭": { index: 4, pos: 3, d: -1 },
    "IV": { index: 5, pos: 3, d: 0 },
    "IV♯": { index: 6, pos: 3, d: +1 },
    "IV𝄪": { index: 7, pos: 3, d: +2 },
    "V𝄫": { index: 5, pos: 4, d: -2 },
    "V♭": { index: 6, pos: 4, d: -1 },
    "V": { index: 7, pos: 4, d: 0 },
    "V♯": { index: 8, pos: 4, d: +1 },
    "V𝄪": { index: 9, pos: 4, d: +2 },
    "VI𝄫": { index: 7, pos: 5, d: -2 },
    "VI♭": { index: 8, pos: 5, d: -1 },
    "VI": { index: 9, pos: 5, d: 0 },
    "VI♯": { index: 10, pos: 5, d: +1 },
    "VI𝄪": { index: 11, pos: 5, d: +2 },
    "VII𝄫": { index: 9, pos: 6, d: -2 },
    "VII♭": { index: 10, pos: 6, d: -1 },
    "VII": { index: 11, pos: 6, d: 0 },
    "VII♯": { index: 0, pos: 6, d: +1 },
    "VII𝄪": { index: 1, pos: 6, d: +2 },
    "I𝄫": { index: 10, pos: 0, d: -2 },
    "I♭": { index: 11, pos: 0, d: -1 }
};



function union(...sets) {
    const output = new Set();

    for ( const st of sets ) {
        for (const elem of st) {
            output.add(elem);
        }
    }

    return output;
}

export function getNoteDegree(note, adjustIndex, adjustPos) {
    const noteValue = values[note];
    const index = ((noteValue.index - adjustIndex) % 12 + 12) % 12;
    const pos = ((noteValue.pos - adjustPos) % 7 + 7) % 7;

    const keys = Object.keys(degrees);
    const i = keys.map(key => degrees[key])
                  .findIndex(data => data.index === index && data.pos === pos);
    return keys[i];
}

export function getNoteMapping(notes, I) {
    const map = {};

    const baseIndex = values[I].index;
    const basePos = values[I].pos;

    for ( const note of notes ) {
        map[note] = getNoteDegree(note, baseIndex, basePos);
    }

    return map;
}

function getNoteMappings(notes) {
    const maps = {};

    for ( const note of notes ) {
        maps[note] = getNoteMapping(notes, note);
    }

    return maps;
}

function scoreMapping(mapping) {
    let score = 0;

    for ( const note of Object.keys(mapping) ) {
        const mappedNote = mapping[note];
        if ( mappedNote === "I" ) {
            score += 100;
        } else if ( mappedNote === "V" ) {
            score += 50;
        } else if ( mappedNote === "IV" ) {
            score += 25;
        } else if ( mappedNote.indexOf('♯') !== -1 || mappedNote.indexOf('♭') !== -1 ) {
            score -= 5;
        } else if ( mappedNote.indexOf('𝄪') !== -1 || mappedNote.indexOf('𝄫') !== -1 ) {
            score -= 10;
        }
    }

    return score;
}

function scoreMappings(mappings) {
    const scores = [];

    for ( const baseNote of Object.keys(mappings) ) {
        const mapping = mappings[baseNote];

        scores.push({ baseNote, score: scoreMapping(mapping) });
    }

    return scores;
}

function getBestMapping(notes) {
    const mappings = getNoteMappings(notes);
    const scores = scoreMappings(mappings);
    scores.sort((a, b) => b.score - a.score);

    return mappings[scores[0].baseNote];
}

export function getChordMapping(chords, I=null) {
    const parsedNotes = chords.map(
        chord => {
            chord = chord.trim();
            let m = chord.match("^([A-G](𝄫|𝄪|♭|♯)?)(.*?)/([A-G](𝄫|𝄪|♭|♯)?)$");

            if ( !m ) {
                m = chord.match("^([A-G](𝄫|𝄪|♭|♯)?)(.*?)$");
            }
            if ( !m ) {
                //throw new Error("Not a chord: " + chord);
                return chord;
            }

            return {
                fullName: chord,
                baseNote: m[1],
                quality:  m[3],
                bassNote: m[4]
            };
        });

    const baseNotes = new Set();
    const bassNotes = new Set();
    for ( const parsedNote of parsedNotes ) {
        baseNotes.add(parsedNote.baseNote);
        if ( parsedNote.bassNote ) {
            bassNotes.add(parsedNote.bassNote);
        }
    }

    const noteNames = Array.from(union(baseNotes, bassNotes));
    const noteMap = I ? getNoteMapping(noteNames, I) : getBestMapping(noteNames);

    const chordMapping = {};
    for ( let chordInfo of parsedNotes  ) {
        if ( chordInfo.bassNote ) {
            chordMapping[chordInfo.fullName] = noteMap[chordInfo.baseNote]
                                             + chordInfo.quality
                                             + "/" + noteMap[chordInfo.bassNote];
        } else {
            chordMapping[chordInfo.fullName] = noteMap[chordInfo.baseNote]
                                             + chordInfo.quality
        }
    }

    return chordMapping;

}

const degreeFunctions ={
    getNoteDegree,
    getNoteMapping,
    getNoteMappings,
    getBestMapping,
    getChordMapping,
};

export default degreeFunctions;
