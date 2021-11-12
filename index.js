(function () {
    // Hooks run after render.
    var renderHooks = [];


    function getChords() {
        const $chordElems = $('.chord');
        const chords = [];

        $chordElems.each(function () {
            var chordName = $(this).attr('data-normalized-original');

            chords.push(chordName);
        });

        return chords;
    }
    
    function mapChords(mapping) {
        const $chordElems = $('.chord');

        $chordElems.each(function () {
            var normalizedName = $(this).data("normalized-original");
            var transponatedChord = mapping[normalizedName];
            if ( !transponatedChord ) {
                throw new Error("No mapping for chord " + normalizedName);
            }
            $(this).text(transponatedChord);

        });
    }


    function doTransponation() {
        var amount     = parseInt($("#transponate-amount").val(), 10);
        var prevValue  = $("#transponate-amount").data('previous-value') || "0";
        var prevAmount = parseInt(prevValue, 10);
        var dir = amount - prevAmount;
        
        if ( Number.isNaN(amount) || amount === 0 ) {
            return;
        }
        
        var chords = getChords();
        var mappings = window.transponation.getMappings(chords, amount);

        var mappingNo = 0;
        if ( mappings.length > 1 ) {
            if ( dir >= 0 ) {
                mappingNo = 0;
            } else {
                mappingNo = 1;
            }
            /* mappingNo = parseInt(prompt("Two possible transponations, enter 0 or 1:\n\n" + JSON.stringify(mappings, null, 2)));
             * if ( Number.isNaN(mappingNo) ) {
             *     return;
             * } */
        }

        $('#transponate-amount').data("transponation", { "amount": amount, "selection": mappingNo });
        
        mapChords(mappings[mappingNo]);

        $("#transponate-amount").data('previous-value', amount);

        //alert(JSON.stringify(mappings, null, 2));

    }


    
    function prepareParseTree(parsedDoc) {
        if ( ! parsedDoc.sections ) {
            return;
        }

        for ( var section of parsedDoc.sections ) {
            for ( var phrase of section.phrases ) {
                var prevMeasure = phrase.measures[0];
                
                for ( var measure of phrase.measures.slice(1) ) {
                    if ( measure.rows[0].bar !== null ) {
                        prevMeasure.spaceAfter = true;
                    }
                    
                    prevMeasure = measure;
                }
                
            }
        }

    }

    
    function render() {
        console.log("render");
        var text = $("textarea").val();
        var $doc = $("#rendered");
        var parsedDoc = window.parser.parse(text);
        
        prepareParseTree(parsedDoc);

        window.builder.build($doc, parsedDoc);

	if ( parsedDoc.title && parsedDoc.rightTitle ) {
	    $("title").text(parsedDoc.title + " — " + parsedDoc.rightTitle);
	} else if ( parsedDoc.title ) {
	    $("title").text(parsedDoc.title);
	} else if ( parsedDoc.rightTitle ) {
	    $("title").text(parsedDoc.rightTitle);
        } else {
            $("title").text("Untitled");
        }

        for ( var i in renderHooks ) {
            renderHooks[i]();
        }
    }

    /**
     * Check that the given input only has chords from the selected note name convention.
     **/
    function checkConvention() {
        var $chords = $('.chord');

        var culture = getConvention();

        console.log("culture:", culture);
        
        $chords.each(function () {
            var text = $(this).data('normalized-original');

            var m = text.match("^([A-H][♭♯#b]?)(.*?)/([A-H][♭♯#b]?)$")
            if ( !m ) {
                m = text.match("^([A-H][♭♯#b]?)(.*)()$")
            }

            console.log('m:', m);
            if ( m && m[1].startsWith('H') && culture !== 'H' ) {
                alert('Error: Source has chord ' + text + ' but note name convention is not set to ”German H, B”.');
            } else if ( m && m[3].startsWith('H') && culture !== 'H' ) {
                alert('Error: Source has chord ' + text + ' but note name convention is not set to ”German H, B”.');
            } else if ( m && m[1].startsWith('B♭') && culture !== 'B' ) {
                alert('Error: Source has chord ' + text + ' but note name convention is not set to ”English B, B♭”.');
            } else if ( m && m[3] === ('B♭') && culture !== 'B' ) {
                alert('Error: Source has chord ' + text + ' but note name convention is not set to ”English B, B♭”.');
            }

        });
    }


    function runRenderAndCheck() {
        render();
        checkConvention();
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
        
        var blob = new Blob([ content ], { type: "text/plain;charset=utf-8" });
        saveAs(blob, filename);
    }

    
    function loadSourceFile() {
        var reader = new FileReader();
        reader.readAsText(document.getElementById("load-button").files[0]);
        reader.onload = function (event) {
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
        
        var blob = new Blob([ content ], { type: "text/html;charset=utf-8" });
        saveAs(blob, filename);
    }

    
    function toggleHelp() {
        if ( $("#toggle-help-button").text() === "Hide Help" ) {
            $("#help").slideUp();
            $("#toggle-help-button").text("Show Help");
            localStorage.setItem("show-help", "no");
        } else {
            $("#help").slideDown();
            $("#toggle-help-button").text("Hide Help");
            localStorage.setItem("show-help", "yes");            
        }
    }

    
    function disableExtraStyleSheets() {
        var $styleSheets = $(".extra-style-sheet");
        
        $styleSheets.each(function () {
            var $styleSheet = $(this);

            var href = $styleSheet.attr("href");
            $styleSheet.attr("data-href", href);
            $styleSheet.attr("href", "");
            
        });

    }

    
    function populateStyleSheetSelector() {
        var $styleSheets = $(".extra-style-sheet");
        var $styleSheetSelect = $("#style-sheet-selector");
        var selectedStyleSheet = localStorage.getItem("style-sheet") || $styleSheets.first().attr("id");
        
        $styleSheets.each(function () {
            var $styleSheet = $(this);
            
            $styleSheetSelect.append(
                $("<option>", {
                    value: $styleSheet.attr("id"),
                    text: $styleSheet.attr("data-description") || $styleSheet.attr("id"),
                    selected: (selectedStyleSheet === $styleSheet.attr("id"))
                })
            );
        });
    }

    
    function changeStyleSheet() {
        var $extraStyleSheets = $(".extra-style-sheet");
        var $styleSheetSelect = $("#style-sheet-selector");        
        var selectedStyleSheetId = $styleSheetSelect.val();
        var $selectedStyleSheet = $("#" + selectedStyleSheetId);

        localStorage.setItem("style-sheet", selectedStyleSheetId);

        $extraStyleSheets.attr("href", "");
        
        $selectedStyleSheet.attr("href", $selectedStyleSheet.attr("data-href"));

        changeFontSize();
    }

    
    function changeFontSize() {
        var $div = $("#rendered");
        $div.css({ fontSize: $('#font-size-input').val() + "%" });
    }


    /**
     * Saves the original (before transponation) chord name in a normalized
     * format to the element.
     **/
    function saveNormalizedFormOfChords() {
        $('.chord').each(function () {
            var normalizedName = $(this).text()
                              .replaceAll("##", "𝄪")
                              .replaceAll("bb", "𝄫")
                              .replaceAll("#", "♯")
                              .replaceAll("b", "♭");
            

            $(this).attr('data-normalized-original', normalizedName);
        });
    }

    function fancifyChords() {
        $('.chord').each(function () {
            var normalizedName = $(this).attr('data-normalized-original');

            console.log("normalaized:", normalizedName);
            $(this).text(
                normalizedName.replace(/([A-H][♯♭]?)([^♯♭ ])/, '$1 $2') // insert hair space U+200A after root name 
                              .replace(/(sus|add|aug|dim|non|no)(.)/, '$1 $2')
            );
        });
    }

    

    function getConvention() {
        return $('#convention-selector').val();
    }
    

    function testParser() {
        var text = $("textarea").val();
        var parsedDoc = window.parser.parse(text);
        prepareParseTree(parsedDoc);
        alert(JSON.stringify(parsedDoc, null, 2));
        
    }
    
    jQuery(document).ready(function () {
        //disableExtraStyleSheets();
        populateStyleSheetSelector();
        changeStyleSheet();
        
        $("#save-button").on('click', saveSourceFile);
        $("#load-button").on('change', loadSourceFile);
        $("#render-button").on('click', runRenderAndCheck);
        $("#export-html-button").on('click', exportHtml);
        $("#toggle-help-button").on('click', toggleHelp);
        if ( localStorage.getItem("show-help") === "no" ) {
            $("#toggle-help-button").text("Show Help");
            $("#help").hide();
        }
        $("#style-sheet-selector").on('change', changeStyleSheet);

        $("#font-size-input").on('change', changeFontSize);
        $("#transponate-amount").on('change', function(event) {
            var oldTimeoutHandle = $(this).data('transponation-delay');
            clearTimeout(oldTimeoutHandle);
            
            var newTimeoutHandle = setTimeout(render, 1000);
            $(this).data('transponation-delay', newTimeoutHandle);
        });

        $("#test-button").on('click', testParser);
        //$("#test-button").on('click', getConvention);        

        renderHooks.push(saveNormalizedFormOfChords);
        renderHooks.push(fancifyChords);        
        renderHooks.push(doTransponation);
        
        render();
    });

}());
