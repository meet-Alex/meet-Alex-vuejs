<template>
    <div class="col-md-12 col-xs-12">
        <div id="MContainer">

            <div class="modal fade" id="inputDialog" role="dialog">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header header-xs">
                            <button type="button" class="close cancelDialog" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title" id='inputDialog_title'></h4>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" id="dataField">
                            <input type="text" placeholder="Enter name..." id="nameField">
                            <textarea id="descriptionField" placeholder="Enter description..."></textarea>
                        </div>
                        <div class="modal-footer header-xs">
                            <button type="button" id='btn_newTerm' class="btn btn-info btn-xs" data-dismiss="modal">Create</button>
                            <button type="button" id='btn_deleteTerm' class="btn btn-danger btn-xs" data-dismiss="modal">Delete</button>
                            <button type="button" class="btn btn-xs cancelDialog" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            <!--
            <div id="Mmenu">
                <nav class="navbar navbar-default">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        </div>
                        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul class="nav navbar-nav">
                                <li class="dropdown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Terms <span class="caret"></span></a>
                                    <ul class="dropdown-menu">
                                        <li> <a href="#" id="unlockAll" title="Unfix all elements from their position">Unfix all</a></li>
                                        <li> <a href="#" id="lockAll" title="Fix all elements to their position">Fix all</a></li>
                                        <li role="separator" class="divider"></li>
                                        <li> <a href="#" id="autoLockOn" title="Auto fix elements after moving them">Autofix On</a></li>
                                        <li> <a href="#" id="autoLockOff" title="Do not fix elements after moving them">Autofix Off</a></li>
                                        <li role="separator" class="divider"></li>
                                        <li> <a href="#" id="showLockOn" title="Show a pin when the element is fixed to a position">Show pin On</a></li>
                                        <li> <a href="#" id="showLockOff" title="Do not show a pin when the element is fixed">Show pin Off</a></li>
                                    </ul>
                                </li>
                                <li class="dropdown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Relations <span class="caret"></span></a>
                                    <ul class="dropdown-menu">
                                        <li> <a href="#" id="relationShowAll" title="Show all relations">All relations</a></li>
                                        <li> <a href="#" id="relationShowHierarchy" title="Show only the hierarchical relations">Hierarchy only</a></li>
                                        <li role="separator" class="divider"></li>
                                        <li> <a href="#" id="clusterIn" title="Cluster relation at incoming side">Cluster Incoming</a></li>
                                        <li> <a href="#" id="clusterOut" title="Cluster relation at outgoing side">Cluster Outgoing</a></li>
                                        <li> <a href="#" id="clusterNone" title="Show each relation separate">No clustering</a></li>
                                    </ul>
                                </li>
                                <li class="dropdown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Collection <span class="caret"></span></a>
                                    <ul class="dropdown-menu">
                                        <li> <a href="#" id="saveCollectionLayout" title="Save this layout">Save layout</a></li>
                                        <li> <a href="#" id="loadCollectionLayout" title="Load the layout">Load layout</a></li>
                                        <li> <a href="#" id="deleteCollectionLayout" title="Delete the layout">Delete layout</a></li>
                                    </ul>
                                </li>
                                <li> <a href="#" id="viewCollection" title="Currently in Edit mode. Select to set to View mode">View mode</a></li>
                                <li> <a href="#" id="editCollection" title="Currently in View mode. Select to set to Edit mode">Edit mode</a></li>
                            </ul>
                            <ul class="nav navbar-nav navbar-right">
                                <input id="zoomSlide" data-slider-id='zoomSlider' type="text" data-slider-min="0.1" data-slider-max="2" data-slider-step="0.1" data-slider-value="1" />
                            </ul>
                        </div>
                  
                    </div>
                
                </nav>
            </div>
            -->
            <div id="Mgraph">
               <!-- <img style="top:40%;" id="alexlogo" height="42" width="42" src={{ URL::asset( "img/spinner.gif") }}></img> -->
            </div>
        </div>
    </div>
</template>

<script>
const d3 = require("./visual/libs/d3.v4");
const $ = require("./visual/libs/jquery-2.1.1.min");
require("./visual/libs/tinysub").tinysub($);
d3.fisheye = require("./visual/libs/fisheye").fisheye;
var Mgraph = require("./visual/graph").Mgraph(d3,$);
var getData = require("./visual/getData").getData($);

var G_remote = true;

function changedZoom(event, zoomLevel) {
  /*	$("#zoomSlide").bootstrapSlider('setValue', zoomLevel);*/
}

$(window).resize(function() {
  //	$('#content').height($(window).height() - 46);
  console.log("resized");
  sizeDivs();
});

function sizeDivs() {
  $("#Mgraph").height($(window).height() - $("#Mmenu").height() - 20);
  $("#Mgraph").css("marginTop", "5px");
}

var collection_id;
$(document).ready(function() {
  //  $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
});

$(document).on("click", "#saveCollectionLayout", function(e) {
  //$(this).parent().addClass('disabled');
  $.publish("/graph/save/layout", [collection_id, "name8"]);
});
$(document).on("click", "#loadCollectionLayout", function(e) {
  //$(this).parent().addClass('disabled');
  $.publish("/graph/load/layout", [collection_id, "name8"]);
});
$(document).on("click", "#deleteCollectionLayout", function(e) {
  //$(this).parent().addClass('disabled');
  var del = confirm("Delete this layout?");
  if (del) {
    $.publish("/graph/delete/layout", [collection_id, "name8"]);
  }
});

$(document).on("click", "#editCollection", function(e) {
  $(this).addClass("hide");
  $("#viewCollection").removeClass("hide");
  $.publish("/graph/set/editMode", [true]);
});
$(document).on("click", "#viewCollection", function(e) {
  $("#viewCollection").addClass("hide");
  $("#editCollection").removeClass("hide");
  $.publish("/graph/set/editMode", [false]);
});

$(document).on("click", "#unlockAll", function(e) {
  $.publish("/graph/set/termsLock", [false]);
});
$(document).on("click", "#lockAll", function(e) {
  $.publish("/graph/set/termsLock", [true]);
});
$(document).on("click", "#relationShowAll", function(e) {
  $.publish("/graph/set/hierarchy", [false]);
  $(this)
    .parent()
    .addClass("disabled");
  $("#relationShowHierarchy")
    .parent()
    .removeClass("disabled");
});
$(document).on("click", "#relationShowHierarchy", function(e) {
  $.publish("/graph/set/hierarchy", [true]);

  $(this)
    .parent()
    .addClass("disabled");
  $("#relationShowAll")
    .parent()
    .removeClass("disabled");
});
$(document).on("click", "#clusterIn", function(e) {
  $.publish("/graph/set/clusterRelations", [Mgraph.NODECLUSTER.in]);

  $(this)
    .parent()
    .addClass("disabled");
  $("#clusterOut")
    .parent()
    .removeClass("disabled");

  $("#clusterNone")
    .parent()
    .removeClass("disabled");
});
$(document).on("click", "#clusterOut", function(e) {
  $.publish("/graph/set/clusterRelations", [Mgraph.NODECLUSTER.out]);
  $(this)
    .parent()
    .addClass("disabled");
  $("#clusterIn")
    .parent()
    .removeClass("disabled");
  $("#clusterNone")
    .parent()
    .removeClass("disabled");
});
$(document).on("click", "#clusterNone", function(e) {
  $.publish("/graph/set/clusterRelations", [Mgraph.NODECLUSTER.none]);
  $(this)
    .parent()
    .addClass("disabled");
  $("#clusterOut")
    .parent()
    .removeClass("disabled");
  $("#clusterIn")
    .parent()
    .removeClass("disabled");
});

$(document).on("click", "#autoLockOn", function(e) {
  $.publish("/graph/set/autoFixTerms", [true]);
  $(this)
    .parent()
    .addClass("disabled");
  $("#autoLockOff")
    .parent()
    .removeClass("disabled");
});
$(document).on("click", "#autoLockOff", function(e) {
  $.publish("/graph/set/autoFixTerms", [false]);
  $(this)
    .parent()
    .addClass("disabled");
  $("#autoLockOn")
    .parent()
    .removeClass("disabled");
});

$(document).on("click", "#showLockOn", function(e) {
  $.publish("/graph/set/showFixpins", [true]);
  $(this)
    .parent()
    .addClass("disabled");
  $("#showLockOff")
    .parent()
    .removeClass("disabled");
});
$(document).on("click", "#showLockOff", function(e) {
  console.log("clicked");

  $("#showLockOff")
    .parent()
    .addClass("disabled");
  $("#showLockOn")
    .parent()
    .removeClass("disabled");
  $.publish("/graph/set/showFixpins", [false]);
});
window.onbeforeunload = function() {
  console.log("saving layout");
  $.publish("/graph/save/layout", [collection_id, "name8"]);
  // debugger;
};

import Vue from "vue";
export default {
  name: "visual",
  props: {
    id: {
      type: String,
      required: true
    },

    collectionId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      content: ""
    };
  },
  watch: {},
  created() {},
  mounted() {
    sizeDivs();

    console.log("ja");

    /*
	$('#zoomSlide').bootstrapSlider({ tooltip: 'hide' })
		.on('slide', function (e, f) { $.publish("/graph/set/zoom", [e.value]); });
*/

    $.subscribe("/graph/event/changedZoom", changedZoom);

    var url = " http://localhost/meet-Alex/public/index.php";
    var term_id = null;
    collection_id = this.collectionId;

    getData.init({
      remote: G_remote, // true=remote (fill remoteURL), false=local
      remoteURL: url + "/api"
    });
    //typeahead.initTypeAhead(G_remote, url + '/api'); // the typeahead search function
    // typeahead.initTypeAhead(false, url + '/api'); // the typeahead search function
    //defBox.initDefBox({
    //	mainDivId: "Mgraph"
    //}); // the boxes with the definitions and details

    // initialise the visualisation, and define the callback functions
    Mgraph.initGraph({
      mainDivId: "Mgraph"
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
    $(".spinner").hide();
    if (typeof collection_id !== "undefined") {
      $.publish("/graph/show/collectionId", [[collection_id]]);

      $.publish("/graph/load/layout", [collection_id, "name8"]);
    } else {
      $.publish("/graph/show/termId", [[term_id]]);
    }

    //Initial configuration
  },
  beforeDestroy() {}
};
</script>

<style>
@import "/src/plugins/visual/css/app.css";
@import "/src/plugins/visual/css/defBox.css";

@import "/src/plugins/visual/libs/typeahead.css";
@import "/src/plugins/visual/libs/jquery-ui.min.css";
@import "/src/plugins/visual/libs/jquery-ui.theme.min.css";
@import "/src/plugins/visual/libs/jquery-ui.structure.min.css";
@import "/src/plugins/visual/libs/bootstrap-slider.css";
/*
@import '/src/plugins/visual/sm-core-css.css';
@import '/src/plugins/visual/sm-simple.css';
*/
</style>