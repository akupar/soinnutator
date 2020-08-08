(function () {
    function escapeClassName(className) {

        //return className.replace(/[^a-zA-Z0-9_-]/g, "");
                                   
        // ei toimi firefoxin inspectorilla
        return className.replace(/./g, function (char) {
            if ( char.match(/[a-zA-Z0-9_-]/) ) {
                return char;
            }
            else if ( char in [ "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":",
                                ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "`", "{", "|", "}", "~" ] ) {

                return "\\" + char;
            } else {
                return "\\" + parseInt(char.charCodeAt(0), 16);
            }
        });
    }
    window.escapeClassName = escapeClassName;

    
    /**
     * "Luonnolliset" jakokohdat.
     *
     * Sanojen alkukohdat.
     */
    function get_breaks(str) {
	var point;
	var breaks = [];
	var re = new RegExp(/ [^ ]/g);
	
	while ( (match = re.exec(str)) !== null ) {
	    point = match.index;
	    //console.log("NAT BREAK: " + point);
	    breaks.push(point + 1);
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
	
	while ( (match = re.exec(str)) !== null ) {
	    point = match.index;
	    //console.log("FRC BREAK: " + point);	    
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
        console.log("intersect:", a, b);
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
        return arrays.reduce(intersect_safe, arrays[0]);
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

    function getBarClass(barSymbol) {
        switch ( barSymbol ) {
            case "|":
                return "bar";
            case "¦":
                return "bar-2";
        }

        throw new Exception("Tuntematon bar-symboli: " + barSymbol);
    }

    function getTd(text, barSymbol) {
        text = text.trim();
        if ( text === "" ) {
            text = "&nbsp;";
        }
        
        if ( barSymbol ) {
            return $('<td class="' + getBarClass(barSymbol) + '">' + text + '</td>');
        } else {
            return $('<td>' + text + '</td>');
        }
    }

    function getPhraseItem(rowsOfPart, barSymbol, firstLineNumber) {
	var $table = $('<table class="phrase-item"></table>');
        var $rows = rowsOfPart.map(function (rowOfPart, index) {
            console.log("row of part:", rowOfPart);
            return $('<tr class="line-' + (index - firstLineNumber) + '"></tr>').append(getTd(rowOfPart, barSymbol));
        });
        
	$table.append($rows);
        return $table;
    }

    function transpose(inputArray) {
        var outputArray = [];

        for ( colIndex = 0; colIndex < inputArray[0].length; colIndex++ ) {
            outputArray[colIndex] = [];
            for ( rowIndex = 0; rowIndex < inputArray.length; rowIndex++ ) {
                outputArray[colIndex][rowIndex] = inputArray[rowIndex][colIndex];
            }
        }

        return outputArray;
    }

    function buildLine(acc, elem) {
	var breaks = elem.breaks;
        var parts = elem.rows.map(function (row) { return split_string(row, breaks); });
	var i;
        var bar = null;
        var partGroups = transpose(parts);
        
	partGroups.forEach(function (linesForParts, index) {
	    linesForParts = linesForParts.map(
                function (lineForPart) {
                    // Merkki @ toimii näkymättömänä ankkurina.
                    return lineForPart.replace(/@/g, "&nbsp;");
                }
            );

            // Ohitetaan tyhjät.
            if ( linesForParts.every(function(lineForPart) { return lineForPart.trim() === ""; }) ) {
                return acc;
            } else if ( linesForParts.every(function(lineForPart) { return lineForPart === "|"; }) ) {
                bar = "|";
            } else if ( linesForParts.every(function(lineForPart) { return lineForPart === "¦"; }) ) {
                bar = "¦";
            } else {
                var $table = getPhraseItem(linesForParts, bar, elem.firstIndex);
	        acc.push($table);
                bar = null;
            }
	});

	acc.push($('<br/>'));	
	return acc;
    }


    function handleLineGroup(acc, lines, firstIndex) {
        console.log("lineGroup:", firstIndex, lines);
	var linesWithBreakInfo = [];
        
	lines.forEach(function (line, index) {
	    if ( line !== "" ) {
		if ( index === 0 ) {
		    linesWithBreakInfo.push({
                        rows : [ line ],
                        breaks : [],
                        firstIndex: firstIndex
                    });
		} else {
		    linesWithBreakInfo[linesWithBreakInfo.length - 1].rows[index] = line;
		}
	    }
	});

	linesWithBreakInfo.forEach(function (group) {
	    var naturalBreaksPerRow = group.rows.map(get_breaks);
	    var forcedBreaksPerRow = group.rows.map(get_forced_breaks);
            var combinedForcedBreaks = unionAll(forcedBreaksPerRow);
            var combinedNaturalBreaks = intersectAll(naturalBreaksPerRow);
            
            console.log("group:", group, "natural:", combinedNaturalBreaks);
            
            console.log("    :", "natural sep.:", naturalBreaksPerRow);

	    group.breaks = union_arrays(combinedNaturalBreaks, combinedForcedBreaks);
	});
	
	var html_list = linesWithBreakInfo.reduce(buildLine, []);

	acc.push($('<p></p>').append(html_list));

	return acc;
    }

    function handleTextBlock(acc, text) {
        console.log("handleGroup:", text);
        if ( text === "" ) {
            return acc;
        }
	var lines = text.split("\n").filter(function (line) { return line.trim() !== ""; });

        var positiveStartIndex = lines.findIndex(function (line) {
            return (line.trimEnd() === "#0")
        });

        if ( positiveStartIndex === -1 ) {
            positiveStartIndex = 0;
        }

        console.log("startindex:", positiveStartIndex);
        
        var regularLines = lines.filter(function (line) {
            return line.trimEnd() !== "#0";
        });

        //if ( lines.length === 1 ) {
        //    return acc.concat($("<p>" + text + "</p>"));
        //} else {
            return handleLineGroup(acc, regularLines, positiveStartIndex);
        //}
    }

    function handleSection(text) {
        var $section = $('<div class="section"></div>');

	var textBlocks = text.split(/\n\n\n*/).filter(function (text) { return text !== "" });

        if ( textBlocks.length === 0 ) {
            return $section;
        }

	var m = textBlocks[0].match(/^\n*#section ?(.*)/);
	if ( m ) {
	    $section.append($("<h2></h2>").text(m[1]));
            $section.addClass(escapeClassName(m[1]));
	    textBlocks.shift();
	}

	var p_elems = textBlocks.reduce(handleTextBlock, []);
        $section.append(p_elems);

        return $section;
    }

    function render() {
        var text = $("textarea").val();
        var $doc = $("#rendered");
        $doc.html("");
        
        var m = text.match(/^\n*#title (.*)\n/);
	if ( m ) {
	    $("title").text(m[1]);
	    $doc.append("<h1>" + m[1] + "</h1>");	    
	}


        text = text.replace(/^\n*#title (.*?)\n+/, "");
        text = text.replace(/^\n+/, "");


        var sections = text.split(/\n(?=#section)/);

        sections.forEach(function(sectionText) {
	    $doc.append(handleSection(sectionText));
        });
    }

    function getCurrentFilename() {
        var loadBtn = document.getElementById("load-button");

        if ( loadBtn.files.length > 0 ) {
            return loadBtn.files[0].name;
        }

        return null;
    }

    function saveSourceFile() {
        var content = $("textarea").val();
        var filename = getCurrentFilename() || $("title").html() + ".txt";
        
        console.log("filename:", filename);
        
        var blob = new Blob([ content ], { type: "text/plain;charset=utf-8" });
        saveAs(blob, filename);
    }

    function loadSourceFile() {
        console.log("changed");
        var reader = new FileReader();
        reader.readAsText(document.getElementById("load-button").files[0]);
        reader.onload = function (event) {
            console.log("loaded:", event);
            $("textarea").val(event.target.result);
            render();
        };
    }

    function exportHtml() {
        // TODO formatointi
        var content = $("#rendered").html()
                                    .replace("</h1>", "</h1>\n\n")
                                    .replace("</h2>", "</h2>\n\n")
                                    .replace("</p>", "</p>\n\n")
                                    .replace("</div>", "</div>\n\n");
        var filename = $("title").html() + ".html";
        
        console.log("filename:", filename);
        
        var blob = new Blob([ content ], { type: "text/html;charset=utf-8" });
        saveAs(blob, filename);
    }

    jQuery(document).ready(function () {
        $("#save-button").on('click', saveSourceFile);
        $("#load-button").on('change', loadSourceFile);
        $("#render-button").on('click', render);
        $("#export-html-button").on('click', exportHtml);
        
        render();
    });

}());
