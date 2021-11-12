(function () {
    
    const majors = [
        {"name":"C major (B)", "culture":"B", "I":"C", "II":"Dm", "III":"Em", "IV":"F", "V":"G", "VI":"Am", "VII":"B°", "num":"0"},
        {"name":"C♯ major (B)", "culture":"B", "I":"C♯", "II":"D♯m", "III":"E♯m", "IV":"F♯", "V":"G♯", "VI":"A♯m", "VII":"B♯°", "num":"1"},
        {"name":"D♭ major (B)", "culture":"B", "I":"D♭", "II":"E♭m", "III":"Fm", "IV":"G♭", "V":"A♭", "VI":"B♭m", "VII":"C°", "num":"1"},
        {"name":"D major (B)", "culture":"B", "I":"D", "II":"Em", "III":"F♯m", "IV":"G", "V":"A", "VI":"Bm", "VII":"C♯°", "num":"2"},
        {"name":"D♯ major (B)", "culture":"B", "I":"D♯", "II":"E♯m", "III":"F𝄪m", "IV":"G♯", "V":"A♯", "VI":"B♯m", "VII":"C𝄪°", "num":"3"},
        {"name":"E♭ major (B)", "culture":"B", "I":"E♭", "II":"Fm", "III":"Gm", "IV":"A♭", "V":"B♭", "VI":"Cm", "VII":"D°", "num":"3"},
        {"name":"E major (B)", "culture":"B", "I":"E", "II":"F♯m", "III":"G♯m", "IV":"A", "V":"B", "VI":"C♯m", "VII":"D♯°", "num":"4"},
        {"name":"F♭ major (B)", "culture":"B", "I":"F♭", "II":"G♭m", "III":"A♭m", "IV":"B𝄫", "V":"C♭", "VI":"D♭m", "VII":"E♭°", "num":"4"},
        {"name":"F major (B)", "culture":"B", "I":"F", "II":"Gm", "III":"Am", "IV":"B♭", "V":"C", "VI":"Dm", "VII":"E°", "num":"5"},
        {"name":"F♯ major (B)", "culture":"B", "I":"F♯", "II":"G♯m", "III":"A♯m", "IV":"B", "V":"C♯", "VI":"D♯m", "VII":"E♯°", "num":"6"},
        {"name":"G♭ major (B)", "culture":"B", "I":"G♭", "II":"A♭m", "III":"B♭m", "IV":"C♭", "V":"D♭", "VI":"E♭m", "VII":"F°", "num":"6"},
        {"name":"G major (B)", "culture":"B", "I":"G", "II":"Am", "III":"Bm", "IV":"C", "V":"D", "VI":"Em", "VII":"F♯°", "num":"7"},
        {"name":"G♯ major (B)", "culture":"B", "I":"G♯", "II":"A♯m", "III":"B♯m", "IV":"C♯", "V":"D♯", "VI":"E♯m", "VII":"F𝄪°", "num":"8"},
        {"name":"A♭ major (B)", "culture":"B", "I":"A♭", "II":"B♭m", "III":"Cm", "IV":"D♭", "V":"E♭", "VI":"Fm", "VII":"G°", "num":"8"},
        {"name":"A major (B)", "culture":"B", "I":"A", "II":"Bm", "III":"C♯m", "IV":"D", "V":"E", "VI":"F♯m", "VII":"G♯°", "num":"9"},
        {"name":"B♭ major (B)", "culture":"B", "I":"B♭", "II":"Cm", "III":"Dm", "IV":"E♭", "V":"F", "VI":"Gm", "VII":"A°", "num":"10"},
        {"name":"B major (B)", "culture":"B", "I":"B", "II":"C♯m", "III":"D♯m", "IV":"E", "V":"F♯", "VI":"G♯m", "VII":"A♯°", "num":"11"},
        {"name":"C♭ major (B)", "culture":"B", "I":"C♭", "II":"D♭m", "III":"E♭m", "IV":"F♭", "V":"G♭", "VI":"A♭m", "VII":"B♭°", "num":"11"},
        {"name":"C major (H)", "culture":"H", "I":"C", "II":"Dm", "III":"Em", "IV":"F", "V":"G", "VI":"Am", "VII":"H°", "num":"0"},
        {"name":"C♯ major (H)", "culture":"H", "I":"C♯", "II":"D♯m", "III":"E♯m", "IV":"F♯", "V":"G♯", "VI":"A♯m", "VII":"H♯°", "num":"1"},
        {"name":"D♭ major (H)", "culture":"H", "I":"D♭", "II":"E♭m", "III":"Fm", "IV":"G♭", "V":"A♭", "VI":"Bm", "VII":"C°", "num":"1"},
        {"name":"D major (H)", "culture":"H", "I":"D", "II":"Em", "III":"F♯m", "IV":"G", "V":"A", "VI":"Hm", "VII":"C♯°", "num":"2"},
        {"name":"D♯ major (H)", "culture":"H", "I":"D♯", "II":"E♯m", "III":"F𝄪m", "IV":"G♯", "V":"A♯", "VI":"H♯m", "VII":"C𝄪°", "num":"3"},
        {"name":"E♭ major (H)", "culture":"H", "I":"E♭", "II":"Fm", "III":"Gm", "IV":"A♭", "V":"B", "VI":"Cm", "VII":"D°", "num":"3"},
        {"name":"E major (H)", "culture":"H", "I":"E", "II":"F♯m", "III":"G♯m", "IV":"A", "V":"H", "VI":"C♯m", "VII":"D♯°", "num":"4"},
        {"name":"F♭ major (H)", "culture":"H", "I":"F♭", "II":"G♭m", "III":"A♭m", "IV":"B♭", "V":"C♭", "VI":"D♭m", "VII":"E♭°", "num":"4"},
        {"name":"F major (H)", "culture":"H", "I":"F", "II":"Gm", "III":"Am", "IV":"B", "V":"C", "VI":"Dm", "VII":"E°", "num":"5"},
        {"name":"F♯ major (H)", "culture":"H", "I":"F♯", "II":"G♯m", "III":"A♯m", "IV":"H", "V":"C♯", "VI":"D♯m", "VII":"E♯°", "num":"6"},
        {"name":"G♭ major (H)", "culture":"H", "I":"G♭", "II":"A♭m", "III":"Bm", "IV":"C♭", "V":"D♭", "VI":"E♭m", "VII":"F°", "num":"6"},
        {"name":"G major (H)", "culture":"H", "I":"G", "II":"Am", "III":"Hm", "IV":"C", "V":"D", "VI":"Em", "VII":"F♯°", "num":"7"},
        {"name":"G♯ major (H)", "culture":"H", "I":"G♯", "II":"A♯m", "III":"H♯m", "IV":"C♯", "V":"D♯", "VI":"E♯m", "VII":"F𝄪°", "num":"8"},
        {"name":"A♭ major (H)", "culture":"H", "I":"A♭", "II":"Bm", "III":"Cm", "IV":"D♭", "V":"E♭", "VI":"Fm", "VII":"G°", "num":"8"},
        {"name":"A major (H)", "culture":"H", "I":"A", "II":"Hm", "III":"C♯m", "IV":"D", "V":"E", "VI":"F♯m", "VII":"G♯°", "num":"9"},
        {"name":"B major (H)", "culture":"H", "I":"B", "II":"Cm", "III":"Dm", "IV":"E♭", "V":"F", "VI":"Gm", "VII":"A°", "num":"10"},
        {"name":"H major (H)", "culture":"H", "I":"H", "II":"C♯m", "III":"D♯m", "IV":"E", "V":"F♯", "VI":"G♯m", "VII":"A♯°", "num":"11"},
        {"name":"C♭ major (H)", "culture":"H", "I":"C♭", "II":"D♭m", "III":"E♭m", "IV":"F♭", "V":"G♭", "VI":"A♭m", "VII":"B", "num":"11"},

    ];


    const calculateMatchPoints = (set, chords) => {
        let points = 0;
        
        for ( let chord of chords ) {
            for ( let degree in set ) {
                if ( set[degree] === chord ) {
                    points = points + 1;
                }
            }
        }

        return points;
    };


    const rateChords = (chords) => {

        const points = [];
        
        for ( let set of majors ) {
            points.push({ "name": set.name, "points": calculateMatchPoints(set, chords) });
        }

        points.sort((a, b) => a.points - b.points);

        return points;
    };

    const chords = ["A", "D", "F♯m", "E", "C♯m", "B♭°"];
    const chords2 = ["A", "D", "F♯", "E", "C♯"];

    //console.log(rateChords(chords));


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


    const transponate = (notes, amount) => {
        const possibleIntervals = Object.keys(intervals)
                                        .map(key => intervals[key])
                                        .filter((interval) => interval.index === amount);

        console.log("possible:", possibleIntervals);

        const possibleResult = [];

        console.log("notes:", notes);
        for ( let possibleInterval of possibleIntervals ) {
            const transponatedNotes = notes.map(
                (note) => {
                    const value = values[note];
                    const newIndex = (value.index + possibleInterval.index) % 12;
                    const newPos = (value.pos + possibleInterval.pos) % 7;

                    const possibleNotes = Object.keys(values).filter(
                        (key) => values[key].index === newIndex && values[key].pos === newPos
                    );

                    console.assert(possibleNotes.length <= 1);

                    return possibleNotes[0];
                });

            console.log(notes, "->", transponatedNotes);

            // If all notes could be transponated.
            if ( transponatedNotes.filter(transponatedNote => !transponatedNote).length === 0 ) {
                possibleResult.push(
                    Object.fromEntries(
                        zip(notes, transponatedNotes)
                    )
                );

                console.log("GOT NOTE MAPPING:", Object.fromEntries(
                    zip(notes, transponatedNotes)
                ));
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

    const getMappings = (chords, amount) => {
        while ( amount < 0 ) {
            amount = amount + 12;
        }
        const nameQualityPairs = chords.map(
            chord => {
                const m = chord.match("^([A-H][♭♯#b]?)(.*?)(/([A-H][♭♯#b]?))?$");
                if ( !m ) {
                    throw new Error("Not a chord: " + chord);
                }
                
                return {
                    fullName: chord,
                    baseNote: m[1],
                    quality: m[2],
                    bassNote: m[4]
                };
            });

        const baseNotes = unique(nameQualityPairs.map(nameQualityPair => nameQualityPair.baseNote));
        var bassNotes = unique(nameQualityPairs.map(nameQualityPair => nameQualityPair.bassNote));

        console.log("baseNotes:", baseNotes);
        console.log("bassNotes:", bassNotes);
        
        const transponatedBaseNoteMaps = transponate(baseNotes, amount);
        const transponatedBassNoteMaps = transponate(bassNotes, amount);

        const chordMappingSets = [];
        
        for ( var setIndex in transponatedBaseNoteMaps  ) {
            
            let baseNoteMap = transponatedBaseNoteMaps[setIndex];
            let bassNoteMap = transponatedBassNoteMaps[setIndex];        
            let chordMapping = {};
            
            for ( let chordInfo of nameQualityPairs  ) {
                if ( chordInfo.bassNote ) {
                    chordMapping[chordInfo.fullName] = baseNoteMap[chordInfo.baseNote]
                                                     + chordInfo.quality
                                                     + "/" + bassNoteMap[chordInfo.bassNote];
                } else {
                    chordMapping[chordInfo.fullName] = baseNoteMap[chordInfo.baseNote]
                                                     + chordInfo.quality
                }
            }

            chordMappingSets.push(chordMapping);

            console.log("GOT CHORD MAPPING:", chordMapping);
        }

        return chordMappingSets;
    };



    window.transponation = {
        getMappings: getMappings
    };

}());
