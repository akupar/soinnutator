
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


const intervals = {
    "dd1"   : { index: -2, pos: 0 },
    "d1"    : { index: -1, pos: 0 },
    "P1"     : { index:  0, pos: 0 },
    "A1"    : { index:  1, pos: 0 },
    "AA1"   : { index:  2, pos: 0 },

    "dd2"   : { index: -1, pos: 1 },
    "d2"    : { index:  0, pos: 1 },
    "m2"    : { index:  1, pos: 1 },
    "M2"    : { index:  2, pos: 1 },
    "A2"    : { index:  3, pos: 1 },
    "AA2"   : { index:  4, pos: 1 },

    "dd3"   : { index:  1, pos: 2 },
    "d3"    : { index:  2, pos: 2 },
    "m3"    : { index:  3, pos: 2 },
    "M3"    : { index:  4, pos: 2 },
    "A3"    : { index:  5, pos: 2 },
    "AA3"   : { index:  6, pos: 2 },

    "dd4"   : { index:  3, pos: 3 },
    "d4"    : { index:  4, pos: 3 },
    "P4"     : { index:  5, pos: 3 },
    "A4"    : { index:  6, pos: 3 },
    "AA4"   : { index:  7, pos: 3 },

    "dd5"   : { index:  5, pos: 4 },
    "d5"    : { index:  6, pos: 4 },
    "P5"     : { index:  7, pos: 4 },
    "A5"    : { index:  8, pos: 4 },
    "AA5"   : { index:  9, pos: 4 },

    "dd6"   : { index:  6, pos: 5 },
    "d6"    : { index:  7, pos: 5 },
    "m6"    : { index:  8, pos: 5 },
    "M6"    : { index:  9, pos: 5 },
    "A6"    : { index: 10, pos: 5 },
    "AA6"   : { index: 11, pos: 5 },

    "dd7"   : { index:  8, pos: 6 },
    "d7"    : { index:  9, pos: 6 },
    "m7"    : { index: 10, pos: 6 },
    "M7"    : { index: 11, pos: 6 },
    "A7"    : { index:  0, pos: 6 },
    "AA7"   : { index:  1, pos: 6 },


}





function zip(arr1, arr2) {
    return arr1.map(function(item, i) {
        return [item, arr2[i]];
    });
}


const getNoteMappings = (notes, amount) => {
    const possibleIntervals = Object.keys(intervals)
                                    .map(key => intervals[key])
                                    .filter(interval => interval.index === amount);

    const possibleResult = [];

    for ( let possibleInterval of possibleIntervals ) {
        const transponatedNotes = notes.map(
            (note) => {
                const value = values[note];
                if ( !value ) {
                    throw new Error("Unknown note: " + note);
                }
                const newIndex = (value.index + possibleInterval.index) % 12;
                const newPos = (value.pos + possibleInterval.pos) % 7;

                const possibleNotes = Object.keys(values).filter(
                    (key) => values[key].index === newIndex && values[key].pos === newPos
                );

                return possibleNotes[0];
            });

        // If all notes could be transponated.
        if ( transponatedNotes.filter(transponatedNote => !transponatedNote).length === 0 ) {
            possibleResult.push(
                Object.fromEntries(
                    zip(notes, transponatedNotes)
                )
            );
        }
    }

    return possibleResult;
};


function unique(list) {
    var seen = {};

    for ( var item of list ) {
        if ( item !== undefined ) {
            seen[item] = true;
        }
    }

    return Object.keys(seen);
}

function rateNotes(notes, dir) {
    var rate = 0;

    for ( var note of notes ) {
        if ( note.indexOf("𝄪") > -1 || note.indexOf("𝄫") > -1 ) {
            rate--;
        }
        if ( dir > 0 && note.indexOf("♭") > -1 ) {
            rate--;
        } else if ( dir > 0 && note.indexOf("♯") > -1 ) {
            rate++;
        } else if ( dir < 0 && note.indexOf("♯") > -1 ) {
            rate--;
        } else if ( dir > 0 && note.indexOf("♭") > -1 ) {
            rate++;
        }
    }

    return rate;
}


function selectNoteMap(noteMaps, preferDir) {
    var rated = [];

    for ( var setIndex in noteMaps  ) {
        var noteMap = noteMaps[setIndex];
        var rate = rateNotes(Object.values(noteMap), preferDir);

        rated.push({ noteMap: noteMap, rate: rate });
    }

    if ( rated.length === 0 ) {
        throw new Error(`Could not find transponation`);
    }

    rated.sort(function (a, b) { return b.rate - a.rate; });

    return rated[0].noteMap;
}


const getChordMapping = (chords, amount, preferDir) => {
    amount = (amount % 12 + 12) % 12;

    const nameQualityPairs = chords.map(
        chord => {
            var m = chord.trim().match("^([A-H](𝄫|𝄪|♭|♯)?)(.*?)/([A-H](𝄫|𝄪|♭|♯)?)$");

            if ( !m ) {
                m = chord.trim().match("^([A-H](𝄫|𝄪|♭|♯)?)(.*?)$");
            }
            if ( !m ) {
                //throw new Error("Not a chord: " + chord);
                return null;
            }

            return {
                fullName: chord,
                baseNote: m[1],
                quality:  m[3],
                bassNote: m[4]
            };
        }).filter(val => val !== null);

    const baseNotes = unique(nameQualityPairs.map(nameQualityPair => nameQualityPair.baseNote));
    var bassNotes = unique(nameQualityPairs.map(nameQualityPair => nameQualityPair.bassNote));

    var noteNames = unique([].concat(baseNotes, bassNotes));

    const transponatedNoteMaps = getNoteMappings(noteNames, amount);

    try {
        var noteMap = selectNoteMap(transponatedNoteMaps, preferDir);
    } catch ( err ) {
        throw new Error(`Could not find transponation: ${chords}`);
    }

    let chordMapping = {};

    for ( let chordInfo of nameQualityPairs  ) {
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
};


const transponationFunctions = {
    getChordMapping: getChordMapping
};

export default transponationFunctions;
