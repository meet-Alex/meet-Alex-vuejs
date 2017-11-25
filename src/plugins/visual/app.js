	function changedZoom(event, zoomLevel) {
	    $("#zoomSlide").bootstrapSlider('setValue', zoomLevel);
	}

	$(window).resize(function() {
	    //	$('#content').height($(window).height() - 46);
	    console.log('resized');
	    sizeDivs();
	});

	function sizeDivs() {
		console.log($(window).width());
		$('#Mgraph').height($(window).height() - $('#Mmenu').height() - 20);
		$('#Mgraph').width($(window).width());
		$('#Mgraph').css("marginTop", '5px');
		
	}


	function initMenu() {
	    $('#main-menu').smartmenus({
	        mainMenuSubOffsetX: -1,
	        subMenusSubOffsetX: 10,
	        subMenusSubOffsetY: 0
	    });
	    var $mainMenuState = $('#main-menu-state');
	    if ($mainMenuState.length) {
	        // animate mobile menu
	        $mainMenuState.change(function(e) {
	            var $menu = $('#main-menu');
	            if (this.checked) {
	                $menu.hide().slideDown(250, function() { $menu.css('display', ''); });
	            } else {
	                $menu.show().slideUp(250, function() { $menu.css('display', ''); });
	            }
	        });
	        // hide mobile menu beforeunload
	        $(window).bind('beforeunload unload', function() {
	            if ($mainMenuState[0].checked) {
	                $mainMenuState[0].click();
	            }
	        });
	    }
	}
	var collection_id;
	$(document).ready(function() {
	    sizeDivs();
	    initMenu();
	    console.log("ja");


	    $('#zoomSlide').bootstrapSlider({ tooltip: 'hide' })
	        .on('slide', function(e, f) { $.publish("/graph/set/zoom", [e.value]); });


	    $.subscribe("/graph/event/changedZoom", changedZoom);

	    var url = $('meta[name="base_url"]').attr('content');
	    var term_id = $('meta[name="term_id"]').attr('content');
	    collection_id = $('meta[name="collection_id"]').attr('content');

	    getData.init({
	        remote: G_remote, // true=remote (fill remoteURL), false=local
	        remoteURL: url + '/api'
	    });
	    typeahead.initTypeAhead(G_remote, url + '/api'); // the typeahead search function
	    // typeahead.initTypeAhead(false, url + '/api'); // the typeahead search function
	    defBox.initDefBox({
	        mainDivId: "Mgraph"
	    }); // the boxes with the definitions and details

	    // initialise the visualisation, and define the callback functions
	    Mgraph.initGraph({
	        mainDivId: 'Mgraph'
	    });

	    // set defaults for menu
	    $("#showLockOff").click();
	    $("#autoLockOn").click();
	    $("#relationShowAll").click();
	    $("#clusterNone").click();
	    $("#viewCollection").click();


	    // ***********temp start in edit editMode
	    //$.publish("/graph/set/editMode", [true]);

	    // do we want to see a complete collection, or only a term?
	    $('.spinner').hide();
	    if (typeof collection_id !== 'undefined') {
	        $.publish("/graph/show/collectionId", [
	            [collection_id]
	        ]);

	        $.publish("/graph/load/layout", [collection_id, "name8"]);

	    } else {
	        $.publish("/graph/show/termId", [
	            [term_id]
	        ]);
	    }

	    //  $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
	});


	$(document).on('click', "#saveCollectionLayout", function(e) {
	    //$(this).parent().addClass('disabled');
	    $.publish("/graph/save/layout", [collection_id, "name8"]);
	});
	$(document).on('click', "#loadCollectionLayout", function(e) {
	    //$(this).parent().addClass('disabled');
	    $.publish("/graph/load/layout", [collection_id, "name8"]);
	});
	$(document).on('click', "#deleteCollectionLayout", function(e) {
	    //$(this).parent().addClass('disabled');
	    var del = confirm("Delete this layout?");
	    if (del) {
	        $.publish("/graph/delete/layout", [collection_id, "name8"]);
	    }
	});

	$(document).on('click', "#editCollection", function(e) {
	    $(this).addClass('hide');
	    $('#viewCollection').removeClass('hide');
	    $.publish("/graph/set/editMode", [true]);
	});
	$(document).on('click', "#viewCollection", function(e) {

	    $('#viewCollection').addClass('hide');
	    $('#editCollection').removeClass('hide');
	    $.publish("/graph/set/editMode", [false]);
	});

	$(document).on('click', "#unlockAll", function(e) {
	    $.publish("/graph/set/termsLock", [false]);
	});
	$(document).on('click', "#lockAll", function(e) {
	    $.publish("/graph/set/termsLock", [true]);
	});
	$(document).on('click', "#relationShowAll", function(e) {
	    $.publish("/graph/set/hierarchy", [false]);
	    $(this).parent().addClass('disabled');
	    $('#relationShowHierarchy').parent().removeClass('disabled');
	});
	$(document).on('click', "#relationShowHierarchy", function(e) {
	    $.publish("/graph/set/hierarchy", [true]);

	    $(this).parent().addClass('disabled');
	    $('#relationShowAll').parent().removeClass('disabled');
	});
	$(document).on('click', "#clusterIn", function(e) {
	    $.publish("/graph/set/clusterRelations", [Mgraph.NODECLUSTER.in]);

	    $(this).parent().addClass('disabled');
	    $('#clusterOut').parent().removeClass('disabled');

	    $('#clusterNone').parent().removeClass('disabled');
	});
	$(document).on('click', "#clusterOut", function(e) {
	    $.publish("/graph/set/clusterRelations", [Mgraph.NODECLUSTER.out]);
	    $(this).parent().addClass('disabled');
	    $('#clusterIn').parent().removeClass('disabled');
	    $('#clusterNone').parent().removeClass('disabled');
	});
	$(document).on('click', "#clusterNone", function(e) {
	    $.publish("/graph/set/clusterRelations", [Mgraph.NODECLUSTER.none]);
	    $(this).parent().addClass('disabled');
	    $('#clusterOut').parent().removeClass('disabled');
	    $('#clusterIn').parent().removeClass('disabled');
	});

	$(document).on('click', "#autoLockOn", function(e) {
	    $.publish("/graph/set/autoFixTerms", [true]);
	    $(this).parent().addClass('disabled');
	    $('#autoLockOff').parent().removeClass('disabled');
	});
	$(document).on('click', "#autoLockOff", function(e) {
	    $.publish("/graph/set/autoFixTerms", [false]);
	    $(this).parent().addClass('disabled');
	    $('#autoLockOn').parent().removeClass('disabled');
	});

	$(document).on('click', "#showLockOn", function(e) {
	    $.publish("/graph/set/showFixpins", [true]);
	    $(this).parent().addClass('disabled');
	    $('#showLockOff').parent().removeClass('disabled');
	});
	$(document).on('click', "#showLockOff", function(e) {
	    console.log("clicked");

	    $('#showLockOff').parent().addClass('disabled');
	    $('#showLockOn').parent().removeClass('disabled');
	    $.publish("/graph/set/showFixpins", [false]);
	});
	window.onbeforeunload = function() {
	    console.log('saving layout');
	    $.publish("/graph/save/layout", [collection_id, "name8"]);
	    // debugger;
	};


	// The typeahead search function
	// INITIALISE: Call function==> initTypeAhead(true)
	// INPUTS: Needs as input the function which gives all terms==> getAllTerms();
	// OUTPUTS: It calls on selection==> showTermTop(suggestion.id, false);

	var typeahead = (function() {

	    function calculateSearchData() {
	        //@todo get data from database in stead of array DATA_term
	        var DATA_term = [{ name: "a test", id: 1 }];
	        var data = [];
	        $.each(DATA_term, function(key, element) {
	            data.push({ searchTerm: element["name"], id: element["id"] });
	        });
	        return data;
	    }

	    function initTypeAhead(remote, url) {

	        if (remote) {
	            initTypeAhead_remote(url);
	        } else {
	            initTypeAhead_local();
	        }


	        $('#input-box').bind('typeahead:select', function(ev, suggestion) {
	            console.log(suggestion);

	            $.publish("/data/get/termId", [suggestion.id, showIt]);

	            function showIt(term) {
	                console.log(term);
	                $.publish("/show/description/termId", [term.id]);
	                $('#input-box').typeahead('val', '');
	            }
	        });

	    };

	    function initTypeAhead_remote(url) {
	        var disp_lay = function(d) {
	            return (d.searchTerm + ">" + d.searchTerm);
	        }
	        var suggestion = new Bloodhound({
	            datumTokenizer: function(datum) {
	                return Bloodhound.tokenizers.whitespace(datum.value);
	            },
	            queryTokenizer: Bloodhound.tokenizers.whitespace,
	            remote: {
	                wildcard: '%QUERY',
	                url: url + '/terms?limit=100&search=%QUERY',

	                transform: function(response) {
	                    // Map the remote source JSON array to a JavaScript object array
	                    return $.map(response, function(result) {
	                        return {
	                            value: result.term_name,
	                            id: result.id
	                        };
	                    });

	                }
	            }


	        });

	        $('#input-box').typeahead({
	            hint: false,
	            highlight: true,
	            minLength: 1
	        }, {
	            Project_naam: 'suggestion',
	            source: suggestion.ttAdapter(),
	            limit: 2000,
	            // display:disp_lay,
	            templates: {
	                empty: [
	                    '<div class="empty-message">',
	                    'No matches',
	                    '</div>'
	                ].join('\n'),
	                suggestion: function(data) {
	                    return '<p>' + data.value + '</p>';
	                }
	            }
	        });
	    }

	    function initTypeAhead_local() {
	        var disp_lay = function(d) {
	            return (d.searchTerm + ">" + d.searchTerm);
	        }
	        var suggestion = new Bloodhound({
	            datumTokenizer: function(d) {
	                var test = Bloodhound.tokenizers.whitespace(d.searchTerm);
	                $.each(test, function(k, v) {
	                    i = 0;
	                    while ((i + 1) < v.length) {
	                        test.push(v.substr(i, v.length));
	                        i++;
	                    }
	                })
	                return test;
	            },
	            queryTokenizer: Bloodhound.tokenizers.whitespace,
	            local: calculateSearchData(), // fetch search names
	            limit: 2000,
	            sorter: function(a, b) {
	                var InputString = $('.typeahead').val().toLowerCase(),
	                    val_a = a.searchTerm.toLowerCase(),
	                    val_b = b.searchTerm.toLowerCase();
	                if (InputString == val_a) { return -1; }
	                if (InputString == val_b) { return 1; }

	                if (val_a.indexOf(InputString) == 0) {
	                    if (val_b.indexOf(InputString) == 0) {
	                        if (val_a < val_b) {
	                            return -1;
	                        } else if (val_a > val_b) {
	                            return 1;
	                        } else return 0;
	                    } else {
	                        return -1;
	                    }
	                } else if (val_b.indexOf(InputString) == 0) {
	                    return 1;
	                } else {
	                    if (val_a < val_b) {
	                        return -1;
	                    } else if (val_a > val_b) {
	                        return 1;
	                    } else return 0;
	                }
	            },
	        });
	        suggestion.initialize();

	        $('#input-box').typeahead({
	            hint: false,
	            highlight: true,
	            minLength: 1
	        }, {
	            Project_naam: 'suggestion',
	            source: suggestion.ttAdapter(),
	            limit: 2000,
	            // display:disp_lay,
	            templates: {
	                empty: [
	                    '<div class="empty-message">',
	                    'No matches',
	                    '</div>'
	                ].join('\n'),
	                suggestion: function(data) {
	                    console.log(data);
	                    return '<p>' + data.searchTerm + '</p>';
	                }
	            }
	        });
	    }

	    return {
	        initTypeAhead: initTypeAhead
	    }
	})();