/**
 * Shows the description box with meta information
 * Needs div #MContainer
 * uses external module functions
 *  -getData.getTermFromId
 *  -getData.findReference
 *  -Mgraph.updateNodeList
 *
 *
 *  $.publish("/graph/show/termId", [
 *           [$(this).attr("value")]
 *       ]);
 *  $.publish("/get/data/termId", [termId, fillbox]);
 *
 * @returns
 */

var defBox = (function() {

    var initParms;

    /**
     *  Provide in the parms the function names for draw the graph, get a term object and find the references of a term in other descriptions
     *
     *     {
     *
     *       getTerm: "getData.getTermFromId",
     *       findReference: "getData.findReference"
     *      }
     * @param {Object} parms
     */
    function initDefBox(parms) {
        initParms = parms;

        $.subscribe("/show/description/termId", showTermTop); // provide the termid to display


        $('<div />')
            .appendTo('#MContainer')
            .attr('id', 'def-box')
            .html('<button type="button" id="hideTermListButton" class="btn btn-default btn-xs"> \
                    <span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>  \
                    </button> ' +
                '<button type="button" id="closeAllTermsButton" class="btn btn-default btn-xs"> \
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>  \
                    </button> '
            );

        $('<div />')
            .appendTo('#def-box')
            .attr("id", "termList"); // Here the term descriptions are placed
        $('#def-box').draggable({ cancel: 'div#termList' }).hide();
    }

    /**
     * Returns the description HTML of this term, with links (buttons) to other terms
     * It needs in the description this text : [termId:name to display], and replaces that with
     * a button
     *
     * @param {Object} termObject
     * @returns {string} description
     */
    function makeLinks(termObject) {

        var description = termObject.description;

        var openBracketPos = description.indexOf("["),
            closeBracketPos = description.indexOf("]");
        var foundSelf = false;
        while (openBracketPos > 0 && closeBracketPos > 0) {
            var link = description.substring(openBracketPos + 1, closeBracketPos),
                seperatorPos = link.indexOf(":"),
                termRealId = link.substring(0, seperatorPos),
                termVisibleName = link.substring(seperatorPos + 1, 200),
                defProcessed = description.substring(0, openBracketPos);

            if (termRealId == termObject.id) { // == in case the termObject.id is a number
                // only first occurence of itself in the description is bold, the rest normal, and no links for it
                defProcessing = (!foundSelf) ? '<span class="defownterm">' + termVisibleName + '</span>' : termVisibleName;
                foundSelf = true;
            } else {
                defProcessing = '<button type="button" class="linkButton" value="' + termRealId + '">' + termVisibleName + '</button>';
            }

            defToProcess = description.substring(closeBracketPos + 1, 8000);
            description = defProcessed + defProcessing + defToProcess;
            openBracketPos = description.indexOf("[");
            closeBracketPos = description.indexOf("]");
        }

        return (description);
    }

    /**
     * Shows the term at the top of the list
     *
     * @param {string} termObject
     */
    function showTermTop(event, termId) {
        showTerm(termId, "");
    }


    /**
     * Shows the description of the termId below the other term in divId
     * @todo cleanup code
     *
     * @param {string} termId
     * @param {string} divId
     * @returns
     */
    function showTerm(termId, divId) {
        $('#termList').show();
        $('#hideTermListButton').children().removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');

        if ($("#def-box").is(':hidden')) {
            $('#def-box').css("left", "10px")
                .css("top", "60px")
                .show();
        }
        // term_Id = het id van de weer te geven term
        // divId = div waar onder deze term getoond moet worden

        if (termId === "-1") return; //a non existing term (from the referenced by selection)
        // maak een nieuwe div voor termdata en voeg deze toe aan de div termlist
        // get term information
        $.publish("/data/get/termId", [termId, fillbox]);

        function fillbox(termObject) {
            var detailVars = "";

            // create for each element not being "name, description, explanatory_note" a line in the detail view
            $.each(termObject, function(key, element) {
                if ($.grep(['name', 'description', 'explanatory_note'], function(e) { return (e === key.toLowerCase()) }).length === 0) {
                    //console.log(key, element);
                    if (!(element === '' || element === ' ')) {
                        detailVars = detailVars + "<tr><td><strong>" + key.charAt(0).toUpperCase() + key.slice(1) + ": </strong></td>	<td>" + element + "</td></tr>";
                    }
                }
            });

            // creeer divs voor termName: bevat de naam van de term en een close button
            // 					termDef: bevat de definitie van de term met links naar andere termen
            //				   termDetail:  bevat additionele meta informatie van de term, zoals bv owner. is initieel verborgen
            //					termShowDet: bevat de show/hide detail button

            // termname+close button
            var termName = $("<div>").addClass("panel-heading");
            termName.html(
                '<button type="button" class="btn btn-default btn-xs closeButton"> \
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>  \
                    </button> ' +
                /* @todo: show the color of the graphical boxes here
                '<div class="catalog_color" background-color="' + getGroupColor(d.group) + '"></div>'
                +
                */
                termObject.name);

            // term description
            var termDef = $("<div>").addClass("panel-body");

            termDef.html(makeLinks(termObject));
            // term details
            var termShowDet = $("<div>").addClass("termShowDet");
            termShowDet.html('<button type="button"  class="btn btn-default btn-xs showDetailButton" title="Show details"> \
                    <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>  \
                    </button> ' +
                '<button value="' + termId + '" type="button"  class="btn btn-default btn-xs showGraphButton" title="Show term in graph"> \
                    <span class="glyphicon glyphicon-unchecked" aria-hidden="true"></span>  \
                    </button> ' +
                '<button value="' + termObject.collection_id + '" type="button"  class="btn btn-default btn-xs showModelButton" title="Show model in graph"> \
                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>  \
                    </button> '
            );



            var termHideDet = $("<div>").addClass("termHideDet");
            termHideDet.html('<button type="button"  class="btn btn-default btn-xs hideDetailButton" title="Hide details"> \
                    <span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>  \
                    </button> ' +
                '<button value="' + termId + '" type="button"  class="btn btn-default btn-xs showGraphButton" title="Show term in graph"> \
                    <span class="glyphicon glyphicon-unchecked" aria-hidden="true"></span>  \
                    </button> ' +
                '<button value="' + termId + '" type="button"  class="btn btn-default btn-xs showModelButton" title="Show model in graph"> \
                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>  \
                    </button> '
            );
            var termDetail = $("<div>").addClass("termDetail");

            var refby = "";
            //var references = getData.findReference(termObject.id);
            // var references = executeFunctionByName(initParms.findReference, termObject.id);

            // @todo: only get referenced by when details are requested, now they are always fetched.
            $.publish("/data/get/references", [termObject.id, filldetails]);


            function filldetails(references) {


                // only show referenced by if it contains values
                if (references.length !== 0) {
                    refby = "<tr><td><strong>Referenced by: </strong></td><td>" +
                        '<select class="refBySelection">' +
                        '<option value="-1">Select...</option>' + references +
                        "</select></td></tr>";
                }

                termDetail.html(
                    "<table class='table1'>" +
                    detailVars +
                    refby +
                    "</table>"
                );
                $("#termList").children('.termData-active').attr('class', 'termData');
                var termData = $("<div>").addClass("panel panel-info"); // create a new div for displaying the term

                termName.appendTo(termData);
                termDef.appendTo(termData);
                termDetail.appendTo(termDef);
                termDetail.hide();
                termShowDet.appendTo(termDef);
                termHideDet.appendTo(termDef);
                termHideDet.hide();
                if (divId === "") {
                    termData.prependTo($("#termList")); // put the new div at the top
                    var pos = termData.offset().top;
                    var pos1 = termData.position().top;
                    $("#termList").animate({
                        scrollTop: 0
                    }, 200);
                } else {
                    $(divId).after(termData); // put the new div after the div this new term is called from, and indent 10 px
                    termData.css('margin-left', parseInt($(divId).css('margin-left').replace('px', '')) + 10 + 'px');
                    //termData[0].scrollIntoView(true);
                }
            }
        }
    }

    $(document).on('click', ".showDetailButton", function(e) {
        $(this).parent().parent().children('.termDetail').show();
        $(this).parent().parent().children('.termHideDet').show();
        $(this).parent().parent().children('.termShowDet').hide();
    });
    $(document).on('click', ".hideDetailButton", function(e) {
        $(this).parent().parent().children('.termDetail').hide();
        $(this).parent().parent().children('.termHideDet').hide();
        $(this).parent().parent().children('.termShowDet').show();
    });
    $(document).on('click', ".linkButton", function(e) {
        var x = $(this).parents('.termData')[0];
        if (typeof x == 'undefined') {
            x = $(this).parents('.termData-active')[0]
        }
        showTerm($(this).val(), x);
    });

    $(document).on('click', ".closeButton", function(e) {
        var nrTermsDisplayed = $('#termList').children().length;
        if (nrTermsDisplayed === 1) {
            $("#def-box").hide();
        }
        $(this).parent().parent().remove();
    });

    $(document).on('click', ".showGraphButton", function(e) {
        $.publish("/graph/show/termId", [
            [$(this).attr("value")]
        ]);
        //Mgraph.updateNodeList([$(this).attr("value")]);
    });
    $(document).on('click', ".showModelButton", function(e) {
        $.publish("/graph/show/collectionId", [
            [$(this).attr("value")]
        ]);
        //Mgraph.updateNodeList([$(this).attr("value")]);
    });

    $(document).on('change', ".refBySelection", function(e) {
        var x = $(this).parents('.termData')[0];
        if (typeof x == 'undefined') {
            x = $(this).parents('.termData-active')[0]
        }
        showTerm($(this).val(), x);

    });
    $(document).on('click', "#closeAllTermsButton", function(e) {
        var nrTermsDisplayed = $('#termList').children().length;
        if (nrTermsDisplayed === 1) {
            $("#clearAll").hide();
        }
        $("#termList").children().remove();
        $('#def-box').hide();
    });
    $(document).on('click', "#hideTermListButton", function(e) {

        var icon = $(this).children().first();
        console.log(icon);

        if (icon.hasClass('glyphicon-chevron-up')) {
            $('#termList').hide();
            icon.removeClass('glyphicon-chevron-up');
            icon.addClass('glyphicon-chevron-down');

        } else {
            $('#termList').show();
            icon.removeClass('glyphicon-chevron-down');
            icon.addClass('glyphicon-chevron-up');
        }
    });

    return {
        initDefBox: initDefBox
    }

    function executeFunctionByName(functionName /*, args */ ) {
        var context = window;
        if (typeof functionName != 'undefined') {
            var args = [].slice.call(arguments).splice(1);
            var namespaces = functionName.split(".");
            var func = namespaces.pop();
            for (var i = 0; i < namespaces.length; i++) {
                context = context[namespaces[i]];
            }
            return context[func].apply(context, args);
        }
    }
})();