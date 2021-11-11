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

    
    function getBarClass(barSymbol) {
        switch ( barSymbol ) {
            case "|":
                return "bar";
            case "¦":
                return "bar-2";
            case " ":
                return "bar-space";
        }

        throw new Exception("Tuntematon bar-symboli: " + barSymbol);
    }

    
    function getTd(blockData) {
        var text = blockData.text.trim();
        if ( text === "" ) {
            text = "&ZeroWidthSpace;";
        }

        var texts = text.split(/(\$)/g);
        var domTexts = texts.map(function (piece) {
            if ( piece === '$' ) {
                return '<span class="spacer"></span>';
            } else {
                return piece;
            }
        });

        var $td = $('<td></td>').append(domTexts);
        
        if ( blockData.index === 0 && text.match("^([A-H][♭♯#b]?)") ) {
            $td.addClass("chord");
        }

        return $td;
    }

    
    function $buildMeasureBlock(measureBlock) {
	var $table = $('<table class="measure-block"></table>');

        if ( measureBlock.spaceAfter ) {
            $table.addClass("bar-end");
        }

        if ( measureBlock.rows[0].bar ) {
            $table.addClass(getBarClass(measureBlock.rows[0].bar));
        }
        
        var $rows = measureBlock.rows.map(function (row) {
            return $('<tr></tr>')
                .addClass("line-" + row.index)
                .append(getTd(row));
        });
        
	$table.append($rows);
        return $table;
    }

    


    function $handlePhrase(phrase) {
        var $phrase = $('<p class="phrase"></p>');

        $phrase.append(
            phrase.measures.map($buildMeasureBlock)
        );

        return $phrase;
    }

    
    function $handleSection(section) {
        var $section = $('<div class="section"></div>');

        if ( section.phrases.length === 0 ) {
            return $section;
        }
        
	if ( section.title ) {
	    $section.append(
                $("<h2></h2>").text(section.title)
            );
            $section.addClass(escapeClassName(section.title));
	}

	$section.append(
            section.phrases.map($handlePhrase)
        );

        return $section;
    }

    
    function build($doc, parsedDoc) {

        var $h1 = $("<h1>" + (parsedDoc.title || "") + "</h1>");
	
	if ( parsedDoc.rightTitle ) {
	    $h1.append('<span class="right">' + parsedDoc.rightTitle + '</span>');	    
        }

        $doc.html("");
        
        if ( parsedDoc.title || parsedDoc.rightTitle ) {
            $doc.append($h1);

        }
        
        parsedDoc.sections.forEach(function(sectionData) {
	    $doc.append($handleSection(sectionData));
        });

    }
    

    window.builder = {
        build: build
    };

}());
