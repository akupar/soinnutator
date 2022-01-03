
var englishNotes = [ 'B𝄪', 'B♯', 'B', 'B♭', 'B𝄫' ];
var germanNotes  = [ 'H𝄪', 'H♯', 'H', 'B',  'B♭' ];


function germanToEnglish(germanNotename) {
    if ( germanNotename === 'B𝄫' ) {
        throw new Error("No such note: B𝄫 (convention: German)");
    }

    var index = germanNotes.indexOf(germanNotename);
    
    return englishNotes[index] || germanNotename;
}

function englishToGerman(englishNotename) {
    var index = englishNotes.indexOf(englishNotename);
    
    return germanNotes[index] || englishNotename;
}


function normalizeChord(originalChord, inputConvention) {
    if ( inputConvention === "B" ) {
        return originalChord;
    }
    
    var m = originalChord.trim().match("^([A-H](𝄫|𝄪|♭|♯)?)(.*?)/([A-H](𝄫|𝄪|♭|♯))$");
    
    if ( !m ) {
        m = originalChord.trim().match("^([A-H](𝄫|𝄪|♭|♯)?)(.*?)$");
    }
    
    if ( !m ) {
        throw new Error("Not a chord: " + originalChord);
    }
    
    var baseNote = germanToEnglish(m[1]);
    var quality  = m[3];
    var bassNote = germanToEnglish(m[4]);


    if ( bassNote ) {
        return baseNote + quality + "/" + bassNote;
    } else {
        return baseNote + quality;
    }
    
}

function getChordNameInConvention(normalizedChord, outputConvention) {
    if ( outputConvention === "B" ) {
        return normalizedChord;
    }
    
    var m = normalizedChord.trim().match("^([A-H](𝄫|𝄪|♭|♯)?)(.*?)/([A-H](𝄫|𝄪|♭|♯))$");
    
    if ( !m ) {
        m = normalizedChord.trim().match("^([A-H](𝄫|𝄪|♭|♯)?)(.*?)$");
    }
    
    if ( !m ) {
        throw new Error("Unrecognizable chord: " + normalizedChord);
    }

    var baseNote = m[1];
    var quality  = m[3];
    var bassNote = m[4];

    if ( baseNote.startsWith("H") || (bassNote && bassNote.startsWith("H")) ) {
        throw new Error("H note where English notes expected");
    }            

    baseNote = englishToGerman(baseNote);
    bassNote = englishToGerman(bassNote);

    if ( bassNote ) {
        return baseNote + quality + "/" + bassNote;
    } else {
        return baseNote + quality;
    }
    
}

export default {
    getChordNameInConvention: getChordNameInConvention,
    normalizeChord: normalizeChord        
};

