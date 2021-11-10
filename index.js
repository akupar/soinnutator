(function () {

    function prepareParseTree(parsedDoc) {
        if ( ! parsedDoc.sections ) {
            return;
        }

        for ( var section of parsedDoc.sections ) {
            console.log("N PHRASES:", section);
                for ( var phrase of section.phrases ) {
                    var prevMeasure = phrase.measures[0];
                    
                    for ( var measure of phrase.measures.slice(1) ) {
                        console.log("MEASURE:", measure.rows[0].bar);
                        if ( measure.rows[0].bar !== null ) {
                        prevMeasure.spaceAfter = true;
                    }
                    
                    prevMeasure = measure;
                }
                
            }
        }

    }
    
    function render() {
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
    }

    function changeFontSize() {
        var $div = $("#rendered");
        $div.css({ fontSize: $('#font-size-input').val() + "%" });
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

        $("#test-button").on('click', testParser);
        
        render();
    });

}());
