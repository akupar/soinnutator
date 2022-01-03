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

/**
 * "Luonnolliset" jakokohdat.
 *
 * Sanojen alkukohdat.
 */
function get_breaks(str) {
    var point;
    var breaks = [];
    
    // Two spaces before non-space.
    var re = new RegExp(/  [^ ]/g);

    let match;
    while ( (match = re.exec(str)) !== null ) {
	point = match.index;
	breaks.push(point + 2);
    }

    return breaks;
}

/**
 * Putkimerkillä merkityt pakotetut kohdat.
 **/
function get_forced_breaks(str) {
    var point;
    var breaks = [];
    var re = new RegExp(/[|¦]/g);

    let match;
    while ( (match = re.exec(str)) !== null ) {
	point = match.index;
	breaks.push(point);
        breaks.push(point + 1);
    }

    return breaks;
}

/* finds the intersection of 
 * two arrays in a simple fashion.  
 *
 * PARAMS
 *  a - first array, must already be sorted
 *  b - second array, must already be sorted
 *
 * NOTES
 *
 *  Should have O(n) operations, where n is 
 *    n = MIN(a.length(), b.length())
 */
function intersect_safe(a, b)
{
    var ai=0, bi=0;
    var result = [];

    while( ai < a.length && bi < b.length )
    {
	if      (a[ai] < b[bi] ){ ai++; }
	else if (a[ai] > b[bi] ){ bi++; }
	else /* they're equal */
	{
	    result.push(a[ai]);
	    ai++;
	    bi++;
	}
    }

    return result;
}

function union_arrays(x, y) {
    var obj = {};
    for (var i = x.length-1; i >= 0; -- i)
	obj[x[i]] = x[i];
    for (var i = y.length-1; i >= 0; -- i)
	obj[y[i]] = y[i];
    var res = []
    for (var k in obj) {
	if (obj.hasOwnProperty(k))  // <-- optional
	    res.push(obj[k]);
    }
    return res;
}

function unionAll(arrays) {
    return arrays.reduce(union_arrays, []);
}

function intersectAll(arrays) {
    return arrays.reduce(intersect_safe, arrays[0] || []);
}




function handleLineGroup(lines, firstIndex) {

    var lineGroup = {
        lines: lines,
        breaks: null,
        firstIndex: firstIndex
    };
    
    var linesWithBreakInfo = lines.map(function (line, index) {
	return {
            text : line,
            naturalBreaks: get_breaks(line),
            forcedBreaks: get_forced_breaks(line),
        };
    });

    var naturalBreaksPerRow = linesWithBreakInfo.map(item => item.naturalBreaks);
    var forcedBreaksPerRow = linesWithBreakInfo.map(item => item.forcedBreaks);        

    var combinedForcedBreaks = unionAll(forcedBreaksPerRow);
    //var combinedNaturalBreaks = intersectAll(naturalBreaksPerRow);
    var combinedNaturalBreaks = unionAll(naturalBreaksPerRow);
    //combinedNaturalBreaks = get_breaks(lineGroup.lines[0]);
    
    lineGroup.breaks = union_arrays(combinedNaturalBreaks, combinedForcedBreaks);

    return lineGroup;
}


function split_string(str, breaks, ank) {
    var out = [];
    var start = 0;

    breaks.forEach(function (brk) {
	out.push(str.substring(start, brk));
	start = brk;

    });
    
    out.push(str.substring(start));
    
    return out;
}

function getBlock(rowsOfPart, barSymbol, firstLineNumber) {
    var block = {};
    
    block.rows = rowsOfPart.map(function (rowOfPart, index) {
        return {
            index: index - firstLineNumber,
            text: rowOfPart,
            bar: barSymbol
        };
    });
    
    return block;
}


function hasBar(barType, linesForParts) {
    var hasBar = false;

    // Check that at least one line has the bar character (|, ¦) and the rest are empty ("" or " "). IF
    // one line ends before other, it has "".
    for ( let lineForPart of linesForParts ) {
        if ( lineForPart === barType ) {
            hasBar = true;
        } else if ( lineForPart !== "" && lineForPart !== " " ) {
            return false;
        }
    }
    
    return hasBar;
}


function buildMeasures(lineBlock) {
    var out = [];
    var breaks = lineBlock.breaks;
    var parts = lineBlock.lines.map((line) => split_string(line, breaks));
    var i;
    var bar = null;
    var partGroups = transpose(parts);

    partGroups.forEach(function (linesForParts, index) {

        var starts = linesForParts.map(function (part) { return part.match(/^  +/); });
        var ends   = linesForParts.map(function (part) { return part.match(/  +$/); });
        
        var lenStarts = starts.reduce(function (acc, val) { return Math.min(acc, val); });
        var lenEnds   = ends.reduce(function (acc, val) { return Math.min(acc, val); });

	linesForParts = linesForParts.map(
            function (lineForPart) {
                // Merkki @ toimii näkymättömänä ankkurina.
                lineForPart = lineForPart.replace(/^  +/, '@'.repeat(lenStarts));
                lineForPart = lineForPart.replace(/  +$/, '@'.repeat(lenEnds));
                return lineForPart.replace(/@/g, "&nbsp;");
            }
        );

        // Ohitetaan tyhjät.
        if ( linesForParts.every(function(lineForPart) { return lineForPart === " "; }) ) {
            return out;
        } else if ( hasBar("|", linesForParts) ) {
            bar = "|";
        } else if ( hasBar("¦", linesForParts) ) {
            bar = "¦";
        } else {
            if ( linesForParts.every(function(lineForPart) { return lineForPart.match(/^  +$/); }) ) {
                linesForParts = linesForParts.map(function (lineForPart) { return lineForPart.replaceAll(" ", "$"); });
            }
            
            var measureBlock = getBlock(linesForParts, bar, lineBlock.firstIndex);
	    out.push(measureBlock);

            
            // If all lines end in space, mark as bar so we can get a space after the measure.
            if ( linesForParts.every(function(lineForPart) { return lineForPart.endsWith(" "); }) ) {
                bar = " ";
            } else {
                bar = null;
            }
        }
    });

    return out;
}



function handlePhrase(text) {
    var phrase = {
        measures: [
            {
                rows : [],
                breaks : [],
                firstIndex: 0
            }                
        ],
    }
    
    if ( text === "" ) {
        return acc;
    }

    console.assert( text.indexOf("\n\n") === -1, "tyhjiä rivejä" );
    
    var lines = text.split("\n").filter(function (line) { return line.trim() !== ""; });

    var positiveStartIndex = lines.findIndex(function (line) {
        return (line.trimEnd() === "#0")
    });

    if ( positiveStartIndex === -1 ) {
        positiveStartIndex = 0;
    }

    var regularLines = lines.filter(function (line) {
        return line.trimEnd() !== "#0";
    });

    var lineBlock = handleLineGroup(regularLines, positiveStartIndex);

    phrase.measures = buildMeasures(lineBlock);

    return phrase;
}

function handleSection(text) {
    var section = {
        title: null,
        phrases: []
    };
    
    var phrases = text.split(/\n\n\n*/).filter(function (text) { return text !== "" });

    if ( phrases.length === 0 ) {
        return section;
    }

    var m = phrases[0].match(/^\n*#section ?(.*)/);
    if ( m ) {
	section.title = m[1];
	phrases.shift();
    }

    section.phrases = phrases.map(handlePhrase);

    return section;
}


function readPragma(pragmaName, text) {
    var m = text.match(new RegExp('^\n*#' + pragmaName + '(.*)\n'));
    if ( m ) {
	return m[1];
    }

    return null;
}

function removePragma(pragmaName, text) {
    return text.replace(new RegExp('^\n*#' + pragmaName + '(.*?)\n+'), "");
}

function parse(text) {
    var doc = {
        title: null,
        rightTitle: null,
        sections: [],
    };

    doc.title = readPragma("title", text)
    text = removePragma("title", text)

    doc.rightTitle = readPragma("right", text)
    text = removePragma("right", text)

    text = text.replace(/^\n+/, "");

    var sections = text.split(/\n(?=#section)/);

    sections.forEach(function(sectionText) {
	doc.sections.push(handleSection(sectionText));
    });

    return doc;
}

export default {
    parse
};
