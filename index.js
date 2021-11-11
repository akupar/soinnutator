(function () {
    var renderHooks = {
    };


    function getChords() {
        const $chordElems = $('.chord');
        const chords = [];

        $chordElems.each(function () {
            chords.push($(this).text());

        });

        return chords;
    }
    
    function mapChords(mapping) {
        const $chordElems = $('.chord');

        $chordElems.each(function () {
            $(this).data("orginal-chord", $(this).text());
            $(this).text(mapping[$(this).text()]);

        });
    }


    function doTransponation() {
        const amount = parseInt($("#transponate-amount").val(), 10);
        if ( Number.isNaN(amount) || amount === 0 ) {
            return;
        }
        
        const chords = getChords();
        console.log("chords:", chords);
        const mappings = window.getTransponateMappings(chords, amount);

        let mappingNo = 0;
        if ( mappings.length > 1 ) {
            mappingNo = parseInt(prompt("Two possible transponations, enter 0 or 1:\n\n" + JSON.stringify(mappings, null, 2)));
            if ( Number.isNaN(mappingNo) ) {
                return;
            }
        }

        $('#transponate-amount').data("transponation", { "amount": amount, "selection": mappingNo });
        
        mapChords(mappings[0]);

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

        for ( var hookKey in renderHooks ) {
            console.log("renderhook", hookKey);
            renderHooks[hookKey]();
        }
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


    function fancifyChords() {
        $('.chord').each(function () {
            $(this).text(
                $(this).text()
                       .replaceAll("#", "♯")
                       .replaceAll("b", "♭")
                       .replace(/([A-H][♯♭]?)([^♯♭ ])/, '$1 $2') // hair space U+200A between 
                       .replace(/(sus|add|dim|no|non)(.)/, '$1 $2')                
            );
        });
    }
    
    function toggleFancyChords(event) {
        var $elem = $(event.target);

        if ( $elem.prop('checked') === true ) {
            renderHooks["fancify chords"] =  fancifyChords;
        } else {
            delete renderHooks["fancify chords"]
        }
        
        render();
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
        $("#render-button").on('click', render);
        $("#export-html-button").on('click', exportHtml);
        $("#toggle-help-button").on('click', toggleHelp);
        if ( localStorage.getItem("show-help") === "no" ) {
            $("#toggle-help-button").text("Show Help");
            $("#help").hide();
        }
        $("#style-sheet-selector").on('change', changeStyleSheet);

        $("#font-size-input").on('change', changeFontSize);
        $("#fancy-chords-checkbox").on('change', toggleFancyChords);
        $("#transponate-amount").on('change', function() {
            clearTimeout($(this).data('transponation-delay'));
            $(this).data('transponation-delay', setTimeout(render, 1000));
        });

        $("#test-button").on('click', testParser);

        if ( $('#fancy-chords-checkbox').prop('checked') === true ) {
            renderHooks["fancify chords"] =  fancifyChords;
        }

        renderHooks["transponate"] = doTransponation;

        render();
    });

}());
