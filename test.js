(function () {
    function escapeClassName(className) {

        return className.replace(/[^a-zA-Z0-9_-]/g, "");
                                   
        // ei toimi firefoxin inspectorilla
        /* return className.replace(/./g, function (char) {
         *     if ( char.match(/[a-zA-Z0-9_-]/) ) {
         *         return char;
         *     }
         *     else if ( char in [ "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":",
         *                         ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "`", "{", "|", "}", "~" ] ) {

         *         return "\\" + char;
         *     } else {
         *         return "\\" + parseInt(char.charCodeAt(0), 16);
         *     }
         * }); */
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
	var re = new RegExp(/(\b\w|\+)/g);
	
	while ( (match = re.exec(str)) !== null ) {
	    point = match.index;
	    //console.log("NAT BREAK: " + point);
	    breaks.push(point);
	}

	return breaks;
    }

    /**
     * Putkimerkillä merkityt pakotetut kohdat.
     **/
    function get_forced_breaks(str) {
	var point;
	var breaks = [];
	var re = new RegExp(/\|/g);
	
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
    
    function split_string(str, breaks, ank) {
	var out = [];
	var start = 0;
	var piece;
	breaks.forEach(function (brk) {
	    piece = str.substring(start, brk);
	    out.push(piece);
	    start = brk;

	});
	return out;
    }

    function getTd(text, addBar) {
        if ( addBar ) {

            return $('<td class="bar">' + text.trim() + '</td>');
        } else {
            return $('<td>' + text.trim() + '</td>');
        }
    }

    function getPhraseItem(chordsPart, lyricsPart, addBar) {
        if ( chordsPart.trim() === "#" ) {
	    var $table = $('<table class="phrase-item"></table>');
	    var $lyricsRow = $('<tr class="lyrics"><td>' + lyricsPart + '</td></tr>');
	    $table.append([$lyricsRow]);
            return $table;
            
        } else if ( lyricsPart.trim() === "#" ) {
	    var $table = $('<table class="phrase-item"></table>');
	    var $chordsRow = $('<tr class="chords"></tr>');
            var $chordsTd = getTd(chordsPart, addBar);
	    $table.append([$chordsRow.append($chordsTd)]);
            return $table;
            
        } else {
	    var $table = $('<table class="phrase-item"></table>');
	    var $chordsRow = $('<tr class="chords"></tr>');
	    var $lyricsRow = $('<tr class="lyrics"></tr>');
            var $chordsTd = getTd(chordsPart, addBar);
            var $lyricsTd = getTd(lyricsPart, addBar);
	    $table.append([$chordsRow.append($chordsTd), $lyricsRow.append($lyricsTd)]);
            return $table;
        }
    }

    function buildLine(acc, elem) {
	var breaks = elem.breaks;
	var s1 = split_string(elem.r1, breaks);
	var s2 = elem.r2 ? split_string(elem.r2, breaks, true) : "";
	var i;
        var bar = false;
        
	s1.forEach(function (chordsPart, index) {
	    var lyricsPart = s2[index].replace("@", "&nbsp;");

            if ( chordsPart === "|" && lyricsPart === "|" ) {
                bar = true;
            } else {
                var $table = getPhraseItem(chordsPart, lyricsPart, bar);
	        acc.push($table);
                bar = false;
            }
	});

	acc.push($('<br/>'));	
	return acc;
    }


    function handleLinePair(acc, lines) {
	var line_pairs = [];
	var index = 0;
	var counter = 0;
	lines.forEach(function (line) {
	    console.log("rivi:", line);
	    if ( line !== "" ) {
		counter = 0;
		if ( index % 2 === 0 ) {
		    line_pairs.push({ "r1" : line, "r2" : null, "breaks" : [] });
		} else {
		    line_pairs[line_pairs.length - 1].r2 = line;
		}
		index++;
	    }
	});

	line_pairs.forEach(function (pair) {
	    var b_r1 = get_breaks(pair.r1);
	    var b_r2 = get_breaks(pair.r2);
	    var b_f1 = get_forced_breaks(pair.r1);
            var b_f2 = get_forced_breaks(pair.r2);
            var b_f = union_arrays(b_f1, b_f2);

	    pair.breaks = union_arrays(intersect_safe(b_r1, b_r2), b_f);

            var l_r1 = pair.r1.length;
            var l_r2 = pair.r2 ? pair.r2.length : 0;
	    pair.breaks.push(Math.max(l_r1, l_r2));
	});
	


	var html_list = line_pairs.reduce(buildLine, []);

	//alert(JSON.stringify(line_pairs));
	acc.push($('<p></p>').append(html_list));

	return acc;
    }

    function handleLineGroup(acc, text) {
        console.log("handleGroup:", text);
        if ( text === "" ) {
            return acc;
        }
	var lines = text.split("\n").filter(function (line) { return line.trim() !== ""; });
        if ( lines.length === 1 ) {
            return acc.concat($("<p>" + text + "</p>"));
        } else if ( lines.length === 2 ) {
            return handleLinePair(acc, lines);
        } else {
            alert("Too many lines in group:\n" + text);
        }
    }

    function handleSection(text) {
        var $section = $('<div class="section"></div>');

	var lineGroups = text.split(/\n\n\n*/).filter(function (text) { return text !== "" });

        if ( lineGroups.length === 0 ) {
            return $section;
        }

	var m = lineGroups[0].match(/^\n*#section ?(.*)/);
	if ( m ) {
	    $section.append($("<h2></h2>").text(m[1]));
            $section.addClass(escapeClassName(m[1]));
	    lineGroups.shift();
	}

	var p_elems = lineGroups.reduce(handleLineGroup, []);
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
