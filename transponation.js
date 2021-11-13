(function () {
    
    const values = {
        "C": { index: 0, pos: 0 },
        "C♯": { index: 1, pos: 0 },
        "C𝄪": { index: 2, pos: 0 },
        "D𝄫": { index: 0, pos: 1 },
        "D♭": { index: 1, pos: 1 },
        "D": { index: 2, pos: 1 },
        "D♯": { index: 3, pos: 1 },
        "D𝄪": { index: 4, pos: 1 },
        "E𝄫": { index: 2, pos: 2 },
        "E♭": { index: 3, pos: 2 },
        "E": { index: 4, pos: 2 },
        "E♯": { index: 5, pos: 2 },
        "E𝄪": { index: 6, pos: 2 },
        "F𝄫": { index: 3, pos: 3 },
        "F♭": { index: 4, pos: 3 },
        "F": { index: 5, pos: 3 },
        "F♯": { index: 6, pos: 3 },
        "F𝄪": { index: 7, pos: 3 },
        "G𝄫": { index: 5, pos: 4 },
        "G♭": { index: 6, pos: 4 },
        "G": { index: 7, pos: 4 },
        "G♯": { index: 8, pos: 4 },
        "G𝄪": { index: 9, pos: 4 },
        "A𝄫": { index: 7, pos: 5 },
        "A♭": { index: 8, pos: 5 },
        "A": { index: 9, pos: 5 },
        "A♯": { index: 10, pos: 5 },
        "A𝄪": { index: 11, pos: 5 },
        "B𝄫": { index: 9, pos: 6 },
        "B♭": { index: 10, pos: 6 },
        "B": { index: 11, pos: 6 },
        "B♯": { index: 0, pos: 6 },
        "B𝄪": { index: 1, pos: 6 },
        "C𝄫": { index: 10, pos: 0 },
        "C♭": { index: 11, pos: 0 }
    };


    const intervals = {
        "vv1"   : { index: -2, pos: 0 },   
        "v1"    : { index: -1, pos: 0 },
        "1"     : { index:  0, pos: 0 },
        "y1"    : { index:  1, pos: 0 },
        "yy1"   : { index:  2, pos: 0 },   

        "vv2"   : { index: -1, pos: 1 },
        "v2"    : { index:  0, pos: 1 },   
        "p2"    : { index:  1, pos: 1 },
        "s2"    : { index:  2, pos: 1 },
        "y2"    : { index:  3, pos: 1 },
        "yy2"   : { index:  4, pos: 1 },   

        "vv3"   : { index:  1, pos: 2 },
        "v3"    : { index:  2, pos: 2 },   
        "p3"    : { index:  3, pos: 2 },
        "s3"    : { index:  4, pos: 2 },
        "y3"    : { index:  5, pos: 2 },
        "yy3"   : { index:  6, pos: 2 },   

        "vv4"   : { index:  3, pos: 3 },
        "v4"    : { index:  4, pos: 3 },   
        "4"     : { index:  5, pos: 3 },
        "y4"    : { index:  6, pos: 3 },
        "yy4"   : { index:  7, pos: 3 },   

        "vv5"   : { index:  5, pos: 4 },   
        "v5"    : { index:  6, pos: 4 },
        "5"     : { index:  7, pos: 4 },
        "y5"    : { index:  8, pos: 4 },
        "yy5"   : { index:  9, pos: 4 },   

        "vv6"   : { index:  6, pos: 5 },
        "v6"    : { index:  7, pos: 5 },   
        "p6"    : { index:  8, pos: 5 },
        "s6"    : { index:  9, pos: 5 },
        "y6"    : { index: 10, pos: 5 },
        "yy6"   : { index: 11, pos: 5 },         

        "vv7"   : { index:  8, pos: 6 },
        "v7"    : { index:  9, pos: 6 },         
        "p7"    : { index: 10, pos: 6 },      
        "s7"    : { index: 11, pos: 6 },
        "y7"    : { index:  0, pos: 6 },
        "yy7"   : { index:  1, pos: 6 },   


    }





    function zip(arr1, arr2) {
        return arr1.map(function(item, i) {
            return [item, arr2[i]];
        });
    }


    const getNoteMappings = (notes, amount) => {
        const possibleIntervals = Object.keys(intervals)
                                        .map(key => intervals[key])
                                        .filter((interval) => interval.index === amount);

        const possibleResult = [];

        for ( let possibleInterval of possibleIntervals ) {
            const transponatedNotes = notes.map(
                (note) => {
                    const value = values[note];
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

        rated.sort(function (a, b) { return b.rate - a.rate; });

        return rated[0].noteMap;
    }
    
    
    const getChordMapping = (chords, amount, preferDir) => {
        while ( amount < 0 ) {
            amount = amount + 12;
        }
        const nameQualityPairs = chords.map(
            chord => {
                const m = chord.match("^([A-H][♭♯𝄫𝄪]?)(.*?)(/([A-H][♭♯𝄫𝄪]?))?$");
                if ( !m ) {
                    throw new Error("Not a chord: " + chord);
                }
                
                return {
                    fullName: chord,
                    baseNote: m[1],
                    quality:  m[2],
                    bassNote: m[4]
                };
            });

        const baseNotes = unique(nameQualityPairs.map(nameQualityPair => nameQualityPair.baseNote));
        var bassNotes = unique(nameQualityPairs.map(nameQualityPair => nameQualityPair.bassNote));

        var noteNames = unique([].concat(baseNotes, bassNotes));

        const transponatedNoteMaps = getNoteMappings(noteNames, amount);

        var noteMap = selectNoteMap(transponatedNoteMaps, preferDir);
        
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



    window.transponation = {
        getChordMapping: getChordMapping
    };

}());
