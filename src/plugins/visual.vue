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
                        <!-- /.navbar-collapse -->
                    </div>
                    <!-- /.container-fluid -->
                </nav>
            </div>
            <div id="Mgraph">
               <!-- <img style="top:40%;" id="alexlogo" height="42" width="42" src={{ URL::asset( "img/spinner.gif") }}></img> -->
               visual
                
            </div>
        </div>
    </div>
</template>

<script>
 const d3= require("./visual/libs/d3.v4");
 const $= require("./visual/libs/jquery-2.1.1.min");

/*
require("./visual/libs/jquery-2.1.1.min");
require("./visual/libs/jquery-ui.min");
require("./visual/libs/jquery.smartmenus.min");

require("./visual/libs/bootstrap-slider.min");
require("./visual/libs/fisheye");
require("./visual/libs/typeahead");
require("./visual/libs/tinysub"); 
*/

/*require("./visual/defBox");*/

require("./visual/libs/bootstrap-slider.min");



 // fisheye START-----------------------------------------


d3.fisheye = {
    scale: function(scaleType) {
      return d3_fisheye_scale(scaleType(), 3, 0);
    },
    circular: function() {
      var radius = 200,
          distortion = 2,
          k0,
          k1,
          focus = [0, 0];

      function fisheye(d) {
        var dx = d.x - focus[0],
            dy = d.y - focus[1],
            dd = Math.sqrt(dx * dx + dy * dy);
        if (!dd || dd >= radius) return {x: d.x, y: d.y, z: dd >= radius ? 1 : 10};
        var k = k0 * (1 - Math.exp(-dd * k1)) / dd * .75 + .25;
        return {x: focus[0] + dx * k, y: focus[1] + dy * k, z: Math.min(k, 10)};
      }

      function rescale() {
        k0 = Math.exp(distortion);
        k0 = k0 / (k0 - 1) * radius;
        k1 = distortion / radius;
        return fisheye;
      }

      fisheye.radius = function(_) {
        if (!arguments.length) return radius;
        radius = +_;
        return rescale();
      };

      fisheye.distortion = function(_) {
        if (!arguments.length) return distortion;
        distortion = +_;
        return rescale();
      };

      fisheye.focus = function(_) {
        if (!arguments.length) return focus;
        focus = _;
        return fisheye;
      };

      return rescale();
    }
  };

  function d3_fisheye_scale(scale, d, a) {

    function fisheye(_) {
      var x = scale(_),
          left = x < a,
          range = d3.extent(scale.range()),
          min = range[0],
          max = range[1],
          m = left ? a - min : max - a;
      if (m == 0) m = max - min;
      return (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a))) + a;
    }

    fisheye.distortion = function(_) {
      if (!arguments.length) return d;
      d = +_;
      return fisheye;
    };

    fisheye.focus = function(_) {
      if (!arguments.length) return a;
      a = +_;
      return fisheye;
    };

    fisheye.copy = function() {
      return d3_fisheye_scale(scale.copy(), d, a);
    };

    fisheye.nice = scale.nice;
    fisheye.ticks = scale.ticks;
    fisheye.tickFormat = scale.tickFormat;
    return d3.rebind(fisheye, scale, "domain", "range");
  }
  // fisheye END-----------------------------------------



// Mgraph START --------------------------------------------------------
 
    

var Mgraph = (function() {
   
    var o = $({});
    
      $.subscribe = function() {
        o.on.apply(o, arguments);
      };
    
      $.unsubscribe = function() {
        o.off.apply(o, arguments);
      };
    
      $.publish = function() {
        o.trigger.apply(o, arguments);
      };
    
    var FIX_PIN_SVG = "m3,9v11h14V9M4,9V6c0-3.3 2.7-6 6-6c3.3,0 6,2.7 6,6v3H14V6c0-2.2-1.8-4-4-4-2.2,0-4,1.8-4,4v3";
    var NODETYPE = { relation: 0, term: 1 },
        NODECLUSTER = { in: 1, out: 2, none: 0 };
    var DIALOG = { newTerm: 1, changeTerm: 2, newRelation: 3, changeRelation: 4 };
    var G_termid = 0;
    var colormap = d3.scaleOrdinal()
        .range(d3.schemeCategory20);

    var G_editLinkParms = {
        selected_node: null,
        selected_link: null,
        mousedown_link: null,
        mousedown_node: null,
        mouseup_node: null,
        drag_line: null
    };
    var G_windowDims = {};

    var G_nodelist,
        G_graph,
        G_data,
        G_editMode,
        G_shiftKey,
        G_modelId,
        G_mousepos,
        G_brush,
        G_brushing,
        G_brushing_selection,
        zoomcalled = 1,
        Dims = {},
        simulation,
        dragging,
        dragpos,
        svg0,
        svg,
        fisheye,
        panzoom,
        hierarchyOnly,
        G_clusterRelations,
        initParms,
        highlightedTermId,
        autoFix,
        zoom,
        autozoom,
        xposScale,
        yposScale,
        showLocks;

    function initGraph(parms) {
        G_graph = { nodes: [], links: [] };
        $.subscribe("/graph/show/termId", showTerms);
        $.subscribe("/graph/show/collectionId", showModel);
        //$.subscribe("/graph/show/collectionId", loadLayout);

        $.subscribe("/graph/set/hierarchy", setHierarchy);
        $.subscribe("/graph/set/editMode", setEditMode);
        $.subscribe("/graph/set/termsLock", setAllNodesLock);
        $.subscribe("/graph/set/clusterRelations", setClusterRelations);
        $.subscribe("/graph/set/zoom", setZoom);
        $.subscribe("/graph/set/highlightTerm", setHighlitedTerm);
        $.subscribe("/graph/set/autoFixTerms", setAutoFixOfNodes);
        $.subscribe("/graph/set/showFixpins", setShowLocks);
        $.subscribe("/graph/save/layout", saveLayout);
        $.subscribe("/graph/load/layout", loadLayout);
        $.subscribe("/graph/delete/layout", deleteLayout);

        initParms = parms; // make parms global
        console.log(initParms);
        // fill interface variables with defaults. These can be changed by provided functions
        showLocks = true;
        hierarchyOnly = false; //only show hierarchy
        G_clusterRelations = NODECLUSTER.in; //0=no, 1=incoming, 2=outgoing
        G_editMode = false; // start in viewmode
        highlightedTermId = null; //term ID to highlight in graph
        autoFix = true; //fix an element after dragging
        G_nodelist = []; // terms to display (with related terms)
        Dims = {
            node: { width: 110, height: 40, fill: "#ffffff", highlight: '#ff8080', font_family: 'helvetica, sans-serif', font_size: '10' },
            rel: { fill: "#9999aa", highlight: '#ff3333', font_family: 'helvetica, sans-serif', font_size: '10' },
            link: { stroke: "#1f77b4", highlight: '#ff3333' }
        };

        // fill helper global variables
        dragging = false; // holds info if node is dragged
        dragpos = 0; //hold the amount (distance) of dragging
        panzoom = { x: 0, y: 0, k: 1 }; // pan and zoom paremeters
        zoom = d3.zoom()
            .scaleExtent([0.1, 2])
            .on("zoom", zoomed);

        fisheye = d3.fisheye.circular()
            .radius(200)
            .distortion(0.1);

        var mainDiv = "#" + initParms.mainDivId;
        if (!$(mainDiv).length)
            console.log('Div [' + mainDiv + '] does not exist');
        G_windowDims.width = 900;// Math.floor($(mainDiv).width());
        G_windowDims.height = Math.floor($(mainDiv).height());

        svg0 = d3.select(mainDiv).append("svg").style("overflow", "hidden").attr("width", G_windowDims.width).attr("height", G_windowDims.height).append('g');
        var zoomRect = svg0.append("rect") // the zoomable container where graph is drawn
            .attr("class", "zoomRect")
            .attr("width", G_windowDims.width)
            .attr("height", G_windowDims.height)
            .style("fill", "transparent")
            .style("stroke", 'none')
            .on("dblclick", function(d) { zoomRect_doubleclick(d, this); })
            .on("mouseup", function(d) { zoomRect_mouseup(d, this); })
            .on("mousemove", function(d) { zoomRect_mousemove(d, this); })
            .call(zoom).on("dblclick.zoom", null);


        d3.select(window).on("resize.updatesvg", function() {
            G_windowDims.width = $(mainDiv).width();
            G_windowDims.height = $(mainDiv).height();
            d3.select(mainDiv).select("svg")
                .attr("width", G_windowDims.width)
                .attr("height", G_windowDims.height);
            svg.attr("width", G_windowDims.width)
                .attr("height", G_windowDims.height);
            svg0.selectAll('.zoomRect').attr("width", G_windowDims.width)
                .attr("height", G_windowDims.height);
        });
        // svg = d3.select(mainDiv).append("svg").attr("id", "svg").style("overflow", "hidden").attr("width", "100%").attr("height", "100%");
        svg = svg0.append("svg").attr("id", "svg").style("overflow", "hidden").attr("width", G_windowDims.width).attr("height", G_windowDims.height);
        // set up the pan/zoom/fisheye

        xposScale = d3.scaleLinear().domain([-500, 500]).range([-Dims.node.width / 2, Dims.node.width / 2]);
        yposScale = d3.scaleLinear().domain([-Dims.node.height * 2, Dims.node.height * 2]).range([-Dims.node.height / 2, Dims.node.height / 2]);
        svg.style("fill", "white");



        svg.append("defs").selectAll("marker") // these are the arrow heads
            .data(["target", "no", "target_red"])
            .enter().append("marker")
            .attr("id", function(d) { return d; })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 5)
            .attr("refY", 0)
            .attr("markerWidth", 4)
            .attr("markerHeight", 4)
            .attr("orient", "auto")
            .append("path")
            .attr("d", function(d) { return (d == 'no') ? "" : "M0,-5L10,0L0,5"; })
            .style("fill", function(d) { return (d == 'target_red') ? "red" : Dims.rel.fill; }) //Dims.link.stroke;
            .style("stroke-width", "2px")
            .style("opacity", "1");

        // define arrow markers for graph links
        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 6)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#000');

        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'start-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 4)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M10,-5L0,0L10,5')
            .attr('fill', '#000');
        var gWindow = svg.append("g").attr("class", "gWindow");
        G_brush = svg0.append("g")
            .datum(function() { return { selected: false, previouslySelected: false }; })
            .attr("class", "brush")
            .attr("transform", "translate(0,0)");

        gWindow.append("g").attr("class", "linkgroup") //put links(lines) in the first group, so they are displayed under the nodes
            .attr("fill", "none");
        gWindow.append("g").attr("class", "nodegroup")
            .attr("fill", "transparent")
            .attr("pointer-events", "none"); // give the events to the parent (zoomrect)
        gWindow.append("g").attr("class", "linkgroup_top") // here the new link is displayed so it is on top of the nodes
            .attr("fill", "none");

        G_editLinkParms.drag_line = svg.select('.linkgroup').append('svg:path')
            .attr('class', 'link dragline hidden')
            .attr('d', 'M0,0L0,0');

        createDropShadow();

        simulation = d3.forceSimulation()
            //.velocityDecay(0.1)
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) { return (d.target.nodeType === NODETYPE.relation) ? 150 : 150; }).iterations(1) /*.strength(0.3)*/ )
            //   .force("charge", d3.forceManyBody().strength(function(d) { return (d.nodeType === NODETYPE.relation) ? -600 : -600; }).distanceMax(600).distanceMin(400).theta(0.1))
            // .force("center", d3.forceCenter(parseFloat(svg.style("width")) / 2, parseFloat(svg.style("height")) / 2))
            .force("node", d3.forceCollide().radius(60).strength(0.5).iterations(1))
            .on("tick", ticked)
            .on('end', function() {});
    }

    function setBrushing(bool) {
        if (bool) {
            G_brushing = true;
            G_brush.call(d3.brush()
                .extent(function() {
                    var svg1 = svg0.select('.zoomRect');
                    // svg1 = svg;

                    var bbox = svg1.node().getBBox();

                    return [
                        [bbox.x, bbox.y],
                        [bbox.x + bbox.width, bbox.y + bbox.height]
                    ];
                })
                .on("start", function(d) {

                    var node = svg.selectAll('.gnode');

                    node.each(function(d) { d.previouslySelected = G_shiftKey && d.selected; });
                })
                .on("brush", function() {
                    var selection = d3.event.selection;
                    if (G_brushing) {
                        var node = svg.selectAll('.gnode');
                        node.selectAll('.nodeRect').classed("selected", function(d) {
                            //    return (selection[0][0] <= (d.x + panzoom.x * panzoom.k) && (d.x + panzoom.x * panzoom.k) < selection[1][0] &&
                            //        selection[0][1] <= (d.y + panzoom.y * panzoom.k) && (d.y + panzoom.y * panzoom.k) < selection[1][1]);
                            return (selection[0][0] <= (d.x * panzoom.k + panzoom.x) && (d.x * panzoom.k + panzoom.x) < selection[1][0] &&
                                selection[0][1] <= (d.y * panzoom.k + panzoom.y) && (d.y * panzoom.k + panzoom.y) < selection[1][1]);

                        });
                        node.each(function(d) {
                            d.selected = (selection[0][0] <= (d.x * panzoom.k + panzoom.x) && (d.x * panzoom.k + panzoom.x) < selection[1][0] &&
                                selection[0][1] <= (d.y * panzoom.k + panzoom.y) && (d.y * panzoom.k + panzoom.y) < selection[1][1]);

                        });
                    } else {
                        var dx = G_brushing_selection[0][0] - selection[0][0];
                        var dy = G_brushing_selection[0][1] - selection[0][1];

                        nudgeSelection(-dx / panzoom.k, -dy / panzoom.k);
                        G_brushing_selection = selection;
                    }
                })
                .on("end", function() {
                    G_brushing = false;
                    G_brushing_selection = d3.event.selection;

                    // d3.event.target.clear();
                    d3.select(this).call(d3.event.target);
                }));
        } else {
            d3.selectAll(".brush").remove();
            G_brush = svg0.append("g")
                .datum(function() { return { selected: false, previouslySelected: false }; })
                .attr("class", "brush")
                .attr("transform", "translate(0,0)");
            var node = svg.selectAll('.nodeRect').classed('selected', false);


        }
    }

    function nudgeSelection(dx, dy) {
        var node = svg.selectAll('.gnode');
        node.filter(function(d) { return d.selected; })
            .attr("transform", function(d) {
                d.x += dx;
                d.y += dy;
                d.fx = d.x;
                d.fy = d.y;
                d.fixed = true;
                return "translate(" + d.x + "," + d.y + ")";
            });
        var link = svg.selectAll('.links');
        link.filter(function(d) { return d.source.selected; })
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; });

        link.filter(function(d) { return d.target.selected; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    }

    /**
     * Load the term and relations positions, and display it.
     * 
     * @param {Object} event 
     * @param {any} collectionId 
     * @param {String} name 
     */
    function loadLayout(event, collectionId, name) {
        G_modelId = collectionId;
        $.publish("/data/get/sketches", [collectionId, showIt]);

        //$.publish("/data/get/sketch", [collectionId, name, showIt]);

        function showIt(newData) {
            if (newData) {
                G_graph = newData.G_graph;
                G_clusterRelations = newData.G_clusterRelations;
            }
            showModel(null, G_modelId, true);
        }
    }

    function deleteLayout(event, collectionId, name) {
        G_modelId = collectionId;
        $.publish("/data/delete/sketches", [collectionId, showIt]);

        //$.publish("/data/get/sketch", [collectionId, name, showIt]);

        function showIt(newData) {
            if (newData) {
                G_graph = newData.G_graph;
                G_clusterRelations = newData.G_clusterRelations;
            }
            showModel(null, G_modelId, true);
        }
    }



    /**
     * Save the term and relation positions
     * 
     * @param {Object} event 
     * @param {any} collectionId 
     * @param {Sting} name 
     */
    function saveLayout(event, collectionId, name) {
        $.publish("/data/put/sketch", [collectionId, name, { G_termid: G_termid, G_graph: G_graph, G_nodelist: G_nodelist, G_clusterRelations: G_clusterRelations }]);
    }

    /**
     * Sets the graphical edit mode, and fix all elements
     *
     * @param {Object} event
     * @param {Boolean} active
     */
    function setEditMode(event, active) {
        G_editMode = active;
        if (active) {
            d3.selectAll('.menuItems').remove();
            $.publish("/graph/set/showFixpins", [false]);
            $.publish("/graph/set/termsLock", [true]);
            svg0.selectAll('.zoomRect').style('stroke', 'red');
        } else {
            svg0.selectAll('.zoomRect').style('stroke', 'grey');
        }
    }

    /**
     * Show only the hierarchical relations
     *
     * @param {boolean} active
     */
    function setHierarchy(event, active) {
        hierarchyOnly = active;
        displayTerms(G_nodelist);
    }

    /**
     * Highlights the box of the term
     *
     * @param {number} termId
     */
    function setHighlitedTerm(event, termId) {
        highlightedTermId = termId;
        resetElements();
    }

    /**
     * Show/hide the fixing symbols when a node is fixed on the canvas
     *
     * @param {boolean} active
     */
    function setShowLocks(event, active) {
        showLocks = active;
        resetElements();
    }

    /**
     * Create the dropdown shadows (used to show that a node can be expanded)
     *
     */

    function createDropShadow() {
        // filters go in defs element
        var defs = svg.append("defs");

        // create filter with id #drop-shadow
        // height=130% so that the shadow is not clipped
        var filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "130%");

        // SourceAlpha refers to opacity of graphic that this filter will be applied to
        // convolve that with a Gaussian with standard deviation 3 and store result
        // in blur
        filter.append("feGaussianBlur")
            .attr("out", "SourceAlpha") // in for normal shadow
            .attr("stdDeviation", 1)
            .attr("result", "blur");

        // translate output of Gaussian blur to the right and downwards with 2px
        // store result in offsetBlur
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 4)
            .attr("dy", 4)
            .attr("result", "offsetBlur");

        // overlay original SourceGraphic over translated blurred opacity by using
        // feMerge filter. Order of specifying inputs is important!
        var feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
    }
    /**
     * Fetches and displays the terms and directly related terms from the specified termIds
     *
     * @param {Array.<string>} termIds
     */
    function updateNodeList(termIds) {
        G_nodelist = termIds;
        var newlist = [];
        $.each(termIds, function(i, term) {
            newlist.push(term);
        });
        getOneTerm(newlist);
    }

    /**
     * Fetches one term at a time
     *
     * @param {Array.<number>} toFetchIDs - List of IDs to fetch
     */
    function getOneTerm(toFetchIDs) {
        $('#alexlogo').show();
        $.publish("/data/get/termsWithRelations", [toFetchIDs, showIt]);

        function showIt(newData) {
            G_data = newData;
            displayTerms(G_nodelist);
            $('#alexlogo').hide();
        }
    }

    /**
     * Returns an array of relation objects, which are related to the termIds provided in the array
     * variable hierarchyOnly specifies only the hierarchical relations (True) or all (False)
     * @todo Selection of hierarchyOnly type relation is now hardcoded on name = 'is a kind of'
     * @todo It assumes the data is already available in G_relList (so function fetchTerm needed to be called first): very risky!
     *
     * @param {Array.<string>} termIdArray
     * @param {boolean} hierarchyOnly
     * @returns {Array.<Object>} relationObjectArray
     */

    function getRelations(termIdArray, hierarchyOnly) {
        var relationObjectArray = [];
        $.each(termIdArray, function(i, termId) {
            var rels = $.grep(G_data.relations, function(e) { return ((e.subject == termId) || (e.object == termId)); });
            $.each(rels, function(i, rel) {
                if ($.grep(relationObjectArray, function(e) { return e.name == rel.name && e.object == rel.object && e.subject == rel.subject; }).length === 0) {
                    if (!(hierarchyOnly) || rel.name == 'is a kind of') { // relation nr =9 is a hierarchy relation
                        relationObjectArray.push(rel);
                    }
                }
            });
        });
        return (relationObjectArray);
    }

    /**
     * Returns an arrray of term objects which are in the provided array of relation objects
     * So all terms which are object of subject in the relations
     * @todo It assumes the data is already available in G_termList (so function fetchTerm needed to be called first): very risky!
     *
     * @param {Array.<Object>} relationObjectArray
     * @returns {Array.<Object>} termObjectArray
     */

    function getTerms(relationObjectArray) {
        var termObjectArray = [];
        var term;
        $.each(relationObjectArray, function(i, relation) {
            term = $.grep(G_data.terms, function(e) { return (e.id == relation.object); })[0];
            if ($.grep(termObjectArray, function(e) { return e.id == term.id; }).length === 0) {
                termObjectArray.push(term);
            }
            term = $.grep(G_data.terms, function(e) { return (e.id == relation.subject); })[0];
            if ($.grep(termObjectArray, function(e) { return e.id == term.id; }).length === 0) {
                termObjectArray.push(term);
            }

        });
        return termObjectArray;
    }

    /**
     * Displays the terms and first level related terms of the provided list
     *
     * @param {Array.<number>} termIDs
     */
    function displayTerms(termIDs) {
        if (!termIDs.length) return;
        // when there is nothing displayed in the graph, show the logo, and remove the border of the graph rectangle
        $('#alexlogo').show();
        var relations = getRelations(termIDs, hierarchyOnly);
        var terms = getTerms(relations);
        // add terms which have no relations
        var term;
        $.each(termIDs, function(i, d) {
            if (!$.grep(terms, function(e) { return (e.id == d); }).length) {
                term = $.grep(G_data.terms, function(e) { return (e.id == d); })[0];
                terms.push(term);
            }
        });

        // TODO: create artificial different models
        {
            $.each(terms, function(i, d) {
                var model;
                // TEMP: create artificial different models
                if (d.name.length < 10) model = 1;
                else if (d.name.length < 15) model = 2;
                else model = 3;
                d.model = G_remote ? model : 1;
            });
        }

        if (relations.length === 0 && termIDs.length) { // no relations found, just show the element then
            terms = $.grep(G_data.terms, function(e) { return (e.id == termIDs[0]); });
            relations = [];
        }
        G_graph = getGraph(terms, relations);
        updateGraph();
        // Let the graph settle a bit before zooming
        setTimeout(function() {
            zoomFit();
        }, 1000);

        $('#alexlogo').hide();
    }

    /**
     * Set the zoomlevel between 0 and 1 is zoom out, above 1 is zoom in
     *
     * @param {number} k
     */
    function setZoom(event, k) {
        zoom.scaleTo(svg0.select('.zoomRect'), k);
    }

    /**
     * Called when the window is being zoomed.
     * It zooms the window, adjusts the fisheye accordingly
     * It also calls the function specified by initParms.changedZoom with the zoomlevel as parameter
     * zoomlevel is between 0-1 for zoom out, and above 1 for zoom in
     */
    function zoomed() {
        svg.select('.gWindow').attr("transform", d3.event.transform);
        panzoom.x = d3.event.transform.x;
        panzoom.y = d3.event.transform.y;
        panzoom.k = d3.event.transform.k;

        if (!G_editMode) {

            fisheye = d3.fisheye
                .circular()
                .radius(200)
                .distortion(1 / panzoom.k);
        }
        $.publish("/graph/event/changedZoom", [panzoom.k]);
    }

    function showModel(event, modelId, restorePositions) {
        G_modelId = modelId;
        restorePositions = (typeof restorePositions === 'undefined') ? false : restorePositions;

        $('#alexlogo').show();

        $.publish("/data/get/modelId", [modelId, showIt]);

        function showIt(newData) {
            //		 G_nodelist=?;
            //
            G_data = newData;
            G_nodelist = [];
            $.each(newData.terms, function(i, term) {
                G_nodelist.push(term.id);
            });

            var newGraph = getGraph(newData.terms, newData.relations);

            if (restorePositions) {
                $.each(newGraph.nodes, function(i, node) {
                    console.log(G_graph);
                    var curnode = $.grep(G_graph, function(cnode) { return node.id === cnode.id; })[0];
                    if (curnode) {
                        node.fixed = curnode.fixed;
                        node.fx = curnode.fx;
                        node.fy = curnode.fy;
                    }
                });
            }
            G_graph = newGraph;

            positionUnrelatedTerms();

            updateGraph();
            $('#alexlogo').hide();
            svg.selectAll('.zoomRect').style('stroke', 'grey');

            // Let the graph settle a bit before zooming
            setTimeout(function() {
                zoomFit();
            }, 1000);
        }
    }

    /**
     * Fixes the terms without a relation in a raster
     * 
     */
    function positionUnrelatedTerms() {
        var unrelTerm = $.grep(G_graph.nodes, function(d) { return (!d.relationCount) && (!d.fixed); });


        var horCount = Math.ceil(Math.sqrt(unrelTerm.length + 1));

        function SortByName(a, b) {
            var aName = a.name.toLowerCase();
            var bName = b.name.toLowerCase();
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        }

        unrelTerm.sort(SortByName);

        var col = 0,
            row = 0;
        $.each(unrelTerm, function(i, term) {
            var x = (col - horCount) * (Dims.node.width + 5);
            var y = (row - horCount) * (Dims.node.height + 5);
            term.x = x;
            term.fx = x;
            term.y = y;
            term.fy = y;
            term.fixed = true;

            col++;
            if (col > horCount) {
                col = 0;
                row++;
            }
        });
    }

    /**
     * Shows the terms and relations provided by the list of termIds
     *
     * @param {Array.<string>} termIds
     */
    function showTerms(event, termIds) {
        updateNodeList(termIds);
        // updateGraph();
    }

    /**
     * This is the function which sets the forces.
     *
     */
    function setForces() {
        // set different forces for different amount of links (G_graph.links.length). The more links, the higher the force.
        var freeNodeForce, connectedNodeForce, velocity;
        if (G_graph.links.length < 10) {
            freeNodeForce = 0;
            connectedNodeForce = 0;
            velocity = 0.3;
        } else if (G_graph.links.length < 30) {
            freeNodeForce = -0;
            connectedNodeForce = -300;
            velocity = 0.3;
        } else {
            freeNodeForce = -0;
            connectedNodeForce = -600;
            velocity = 0.1;
        }

        // apply the forces calculated above
        // draw free standing nodes (d.relationCount===0) to (50,50) and nodes with links to the center

        simulation.velocityDecay(velocity)
            .force("charge", d3.forceManyBody().strength(function(d) {
                return (d.relationCount === 0) ? freeNodeForce : connectedNodeForce;
            }).distanceMax(1000).distanceMin(400).theta(0.9))
            .force('X', d3.forceX()
                .x(function(d) { return !d.relationCount ? 50 : parseFloat(G_windowDims.width) / 2; })
                .strength(function(d) { return !d.relationCount ? 0.1 : 0.02; })
            )
            .force('Y', d3.forceY()
                .y(function(d) { return !d.relationCount ? 50 : parseFloat(G_windowDims.height) / 2; })
                .strength(function(d) { return !d.relationCount ? 0.3 : 0.02; })
            );
    }

    /**
     * Updates the graph
     * Uses the global variable G_graph.links and G_graph.nodes which contain the elements to draw
     */
    function updateGraph() {

        setForces();
        var gLink = svg.selectAll(".linkgroup")
            .selectAll(".links")
            .data(G_graph.links, function(d) { return d.id; });

        gLink.exit().remove();

        var linkEnter = gLink
            .enter().append("line")
            .attr("class", "links")
            .attr("id", function(d) { return d.id; })
            .attr("stroke-width", "2px")
            .attr("stroke", function(d) { return d.stroke; })
            .style("marker-end", function(d) { return (d.targetIsRelation) ? "url(#target)" : "url(#no)"; });

        var relationNodes = $.grep(G_graph.nodes, function(e) { return e.nodeType === NODETYPE.relation; });
        var termNodes = $.grep(G_graph.nodes, function(e) { return e.nodeType === NODETYPE.term; });

        var gNodesTerm = svg.select('.nodegroup')
            .selectAll(".gnode.term")
            .data(termNodes, function(d) { return d.id; });

        gNodesTerm.exit().remove();

        var gnodesTermEnter = gNodesTerm
            .enter()
            .append("g") // add group which handles mouse, and will hold the visual elements
            .attr('class', 'gnode term')
            .attr("pointer-events", "all")
            .on("mousemove", function(d) { termGroup_mousemove(d, this); })
            .on("mousedown", function(d) { termGroup_mousedown(d, this); })
            .on("dblclick", function(d) { termGroup_dblclick(d, this); })
            .on("click", function(d) { termGroup_click(d, this); })
            .on('mouseup', function(d) { termGroup_mouseup(d, this); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );
        gnodesTermEnter
            .append("rect") // add rectangle for node: if (relation) fit box around the text
            .attr("transform", "translate(" + ((-Dims.node.width - 30) / 2) + "," + ((-Dims.node.height - 30) / 2) + ")")
            .attr("width", Dims.node.width + 30)
            .attr("class", "termBorderRect")
            .attr("height", Dims.node.height + 30)
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("fill", "none")
            .attr("stroke", 'none')
            .attr("pointer-events", "all")
            .attr("opacity", "0.5")
            .on("mouseover", function(d) { termBorderRect_mouseover(d, this); })
            .on("mousedown", function(d) { termBorderRect_mousedown(d, this); })
            .on("mouseup", function(d) { termBorderRect_mouseup(d, this); })
            .on("mouseout", function(d) { termBorderRect_mouseout(d, this); });

        var gnodesRectEnter = gnodesTermEnter.append('g');
        gnodesRectEnter
            .append("rect") // add rectangle for node: if (relation) fit box around the text
            .attr("transform", "translate(" + (-Dims.node.width / 2) + "," + (-Dims.node.height / 2) + ")")
            .attr("width", Dims.node.width)
            .attr("class", "nodeRect")
            .attr("height", Dims.node.height)
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("fill", "white")
            .attr("stroke", function(d) { return getGroupColor(d.group); })
            .attr("stroke-width", 3)
            .on("mouseover", function(d) { termRect_mouseover(d, this); })
            .on("dblclick", function(d) { termRect_doubleclick(d, this); })
            .on("mouseout", function(d) { termRect_mouseout(d, this); })
            .on("mouseup", function(d) { termRect_mouseup(d, this); })
            .style("filter", function(d) {
                return (d.expandable) ? "url(#drop-shadow)" : "";
            });

        gnodesRectEnter.append("path")
            .attr("class", "fixpin")
            .attr("d", FIX_PIN_SVG)
            .style("fill", "grey")
            .style("stroke-width", "1px")
            .style("opacity", "0")
            .attr("transform", "translate(" + (0.5 * (Dims.node.width) - 14) + "," + (-Dims.node.height + 24) + ") scale(0.5)")
            .on("mousedown", function(d) { termFixpin_mousedown(d, this); });

        gnodesRectEnter
            .append("text") // add text for node
            .attr("class", "node-text termname")
            .text(function(d) { return d.name; })
            .style("text-anchor", "middle")
            .attr("pointer-events", "none")
            .attr("fill", "black")
            .style("font-size", Dims.node.font_size + 'px')
            .style("font-family", Dims.node.font_family)
            .call(wrap, 100, true);

        var gNodesRelation = svg.select('.nodegroup')
            .selectAll(".gnode.relation")
            .data(relationNodes, function(d) { return d.id; });

        gNodesRelation.exit().remove();

        var gnodesRelationEnter = gNodesRelation
            .enter()
            .append("g") // add group which handles mouse, and will hold the visual elements
            .attr('class', 'gnode relation')
            .attr("pointer-events", "all")
            .on("mousemove", function(d) { relation_mousemove(d, this); })
            .on("mousedown", function(d) { relation_mousedown(d, this); })
            .on('mouseup', function(d) { relation_mouseup(d, this); })
            .on("click", function(d) { relationGroup_click(d, this); })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );

        gnodesRelationEnter
            .append("text") // add text for node
            .attr("class", "node-text")
            .text(function(d) { return d.name; })
            .style("text-anchor", "middle")
            .attr("pointer-events", "none")
            .attr("fill", "white")
            .style("font-size", Dims.rel.font_size + 'px')
            .style("font-family", Dims.rel.font_family);

        gnodesRelationEnter
            .insert("rect", "text") // add rectangle for node: if (relation) fit box around the text
            .attr("transform", function(d) { return "translate(" + (-this.parentNode.getBBox().width / 2 - 5) + "," + (-this.parentNode.getBBox().height / 2 - 7) + ")"; })
            .attr("width", function(d) { return (this.parentNode.getBBox().width + 10); })
            .attr("class", "relation nodeRect")
            .attr("height", 20)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("stroke", 'none')
            .attr("stroke-width", 1);

        gnodesRelationEnter.append("path")
            .attr("class", "fixpin")
            .attr("d", FIX_PIN_SVG)
            .style("fill", "lightgrey")
            .style("stroke-width", "1px")
            .style("opacity", "0")
            .attr("transform", function(d) {
                var x = (30 - 0.08 * 0.5 * this.parentNode.getBBox().width);
                var y = (-40);
                return "translate(" + x + "," + y + ") scale(0.08)";
            })
            .on("mousedown", function(d) { termFixpin_mousedown(d, this); });

        resetElements();

        simulation
            .nodes(G_graph.nodes);


        simulation.force("link")
            .links(G_graph.links);
        $.each(G_graph.links, function(i, d) {
            if (typeof d.real_source === 'string' || typeof d.real_source === 'number') {
                d.real_source = getNodeObject(d.real_source);

            }
            if (typeof d.real_target === 'string' || typeof d.real_target === 'number') {

                d.real_target = getNodeObject(d.real_target);

            }


        });
        simulation.alpha(1).restart();
    }

    function getNodeObject(id) {
        return $.grep(G_graph.nodes, function(d) { return d.id === id })[0];
    }

    function zoomFit(paddingPercent, transitionDuration) {
        var gWindow = svg.select('.gWindow');
        var bounds = gWindow.node().getBBox();
        var parent = svg;
        var fullWidth = G_windowDims.width,
            fullHeight = G_windowDims.height;

        var width = bounds.width,
            height = bounds.height;

        var midX = bounds.x + width / 2,
            midY = bounds.y + height / 2;
        if (width === 0 || height === 0) return; // nothing to fit
        var scale = Math.min(1, (paddingPercent || 0.75) / Math.max(width / fullWidth, height / fullHeight));
        var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

        function transform() {
            return d3.zoomIdentity
                .translate(fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY)
                .scale(scale);
            // .translate(-point[0], -point[1]);
        }
        svg0.select('.zoomRect').transition().duration(1500).call(zoom.transform, transform)
            .on('end', function(d) { if (simulation.alpha() > 0.01) { zoomFit(0.95, 1500); } });
    }

    /**
     * Resets the elements to their normal states
     * - colors, shadows and fix pins
     *
     */
    function resetElements() {
        svg.selectAll('.links')
            .attr("stroke", function(e) { return e.stroke; })
            .style("marker-end", function(d) { return (d.target.nodeType === NODETYPE.relation) ? "url(#no)" : "url(#target)"; });

        svg.selectAll('.nodeRect')
            .data(G_graph.nodes, function(d) { return d.id; })
            .attr("fill", function(d) { return (d.id == highlightedTermId) ? '#ffff33' : d.fill; })
            .attr("stroke", function(d) { return getGroupColor(d.group); })
            .style("filter", function(d) {
                return (d.expandable) ? "url(#drop-shadow)" : "";
            });
        var showit = showLocks ? 1 : 0;
        svg
            .selectAll('.fixpin')
            .data(G_graph.nodes, function(d) { return d.id; })
            .style("opacity", function(d) { return (d.fixed ? showit : 0); });
        // $('html, body').animate({ scrollTop: $(document).height() }, 'fast');
    }

    /**
     * Removes or adds the term to the history (G_nodelist) and updates the graph
     *
     * @param {Object} term
     */
    function toggleNode(term) {
        if ($.grep(G_nodelist, function(d) { return d == term.id; }).length === 0) {
            G_nodelist.push(term.id);
        } else {
            if (G_nodelist.length > 1) // avoid removal of last node
                G_nodelist = $.grep(G_nodelist, function(d) { return d != term.id; }); //remove node
        }
        updateNodeList(G_nodelist);
    }

    function resetMouseVars() {
        svg.select('.zoomRect').call(zoom).on("dblclick.zoom", null);
        G_editLinkParms.mousedown_node = null;
        G_editLinkParms.mouseup_node = null;
        G_editLinkParms.mousedown_link = null;
        G_editLinkParms.drag_line
            .classed('hidden', true)
            .style('marker-end', '');
    }

    /**
     * Handles a click on the node
     *
     * @param {Object} node
     * @param {Object} d3object
     */

    function restart() {
        updateGraph();
    }
    /**
     * Toggles a menu for the node (expand/collapse and description)
     *
     * @param {Object} node
     * @param {Object} d3object - The object to add the menu
     *
     */
    function showNodeMenu(node, d3object) {
        //if (d3.event.defaultPrevented) return;
        //simulation.alpha(0);  //stop animation
        if (G_editMode) return;
        if (node.nodeType === NODETYPE.relation) return; // if clicked on a relation-node, do nothing
        var menuIsShown = d3object.selectAll('.menuItems').nodes().length > 0;
        d3.selectAll('.menuItems').remove(); // remove all menus from all nodes
        if (menuIsShown) return;

        // is the node expanded (is on the G_nodelist), or has unexpanded relations (node.group==0) then show collapse/expand menu above the node
        if (($.grep(G_nodelist, function(d) { return d == node.id; }).length) || node.expandable) {
            var menuExpand = d3object
                .append("g")
                .attr("class", "menuItems")
                .attr("transform", "translate(" + (2 - Dims.node.width / 2) + "," + (2 - Dims.node.height) + ")");

            menuExpand
                .append('rect')
                .attr("width", Dims.node.width - 4)
                .attr("class", "infoButton")
                .attr("height", 18)
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("stroke", "grey")
                .attr("fill", "grey")
                .attr("stroke-width", 0)
                .style("opacity", 0.2)
                .on("mouseover", function(d) { d3.select(this).style("opacity", 0.6); })
                .on("mouseout", function(d) { d3.select(this).style("opacity", 0.2); })
                .on("mousedown", function(d) {
                    d3.event.stopPropagation();
                    d3object.selectAll('.menuItems').remove();
                    toggleNode(d);
                });

            menuExpand
                .append("text")
                .text(function(d) { return d.expandable ? "Expand" : "Collapse"; })
                .attr("class", "node-text")
                .attr("x", (Dims.node.width - 4) / 2)
                .attr("y", 12)
                .style("text-anchor", "middle")
                .attr("pointer-events", "none")
                .attr("fill", "black")
                .style("font-size", Dims.node.font_size + 'px')
                .style("font-family", Dims.node.font_family);
        }
        //add description menu item below the node
        var menuDef = d3object.append("g").attr("class", "menuItems")
            .attr("transform", "translate(" + (2 - Dims.node.width / 2) + "," + (Dims.node.height / 2) + ")");
        menuDef
            .append('rect')
            .attr("width", Dims.node.width - 4)
            .attr("class", "infoButton")
            .attr("height", 18)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("stroke", "grey")
            .attr("fill", "grey")
            .attr("stroke-width", 0)
            .style("opacity", 0.2)
            .on("mouseover", function(d) { d3.select(this).style("opacity", 0.6); })
            .on("mouseout", function(d) { d3.select(this).style("opacity", 0.2); })
            .on("mousedown", function(d) {
                d3.event.stopPropagation();
                d3object.selectAll('.menuItems').remove();

                $.publish("/show/description/termId", [d.id]);
            });
        menuDef.append("text")
            .text("description")
            .attr("class", "node-text")
            .attr("x", (Dims.node.width - 4) / 2)
            .attr("y", 12)
            .style("text-anchor", "middle")
            .attr("pointer-events", "none")
            .attr("fill", "black")
            .style("font-size", Dims.node.font_size + 'px')
            .style("font-family", Dims.node.font_family);
    }


    function getTermFromId(termid) {
        var term = null;
        for (var i = 0; i < G_data.terms.length; i++) {
            if (G_data.terms[i] === termid) {
                term = G_data.terms[i];
                break;
            }
        }
        return term;
    }

    /**
     * returns the graph object {links, nodes} for the specified lists of term objects and relation objects
     *
     * @param {Array.<Object>} terms
     * @param {Array.<Object>} relations
     * @returns {Object} anonymous {links, nodes}
     */

    function getGraph(terms, relations) {
        var term1 = [];
        var relation1 = [];
        var term_rels = [];
        var termrel = [];

        // test for more relations between 2 terms
        $.each(relations, function(i, relation) {
            relation.repeat = 0;
            termrel = $.grep(term_rels, function(d) { return (d.term1 == relation.subject && d.term2 == relation.object) || (d.term2 == relation.subject && d.term1 == relation.object) });

            if (termrel.length === 0) {
                term_rels.push({
                    term1: relation.subject,
                    term2: relation.object,
                    relcount: 0
                });
            } else {
                termrel[0].relcount++;
                relation.repeat = termrel[0].relcount;
            }


        });


        // for each relation create the links and the relation-node
        $.each(relations, function(i, relation) {
            var relationBoxId;
            if (G_clusterRelations === NODECLUSTER.in || hierarchyOnly)
                relationBoxId = 'R_' + relation.name + '.' + relation.object;
            else if (G_clusterRelations === NODECLUSTER.none)
                relationBoxId = 'R_' + relation.name + '.' + relation.subject + '.' + relation.object;
            else
                relationBoxId = 'R_' + relation.name + '.' + relation.subject;

            // create the node for the relation
            if ($.grep(term1, function(e) { return (e.id == relationBoxId); }).length === 0) {
                term1.push({
                    id: relationBoxId,
                    orgId: relation.id,
                    name: relation.name,
                    description: 'No information',
                    expandable: false,
                    group: 0,
                    nodeType: NODETYPE.relation,
                    dragging: false,
                    repeat: relation.repeat,
                    fill: Dims.rel.fill,
                    highlight: Dims.rel.highlight,
                    fixed: (relation.fx || null) > 0,
                    fx: relation.fx || null,
                    fy: relation.fy || null,
                    relationCount: 3 // @todo find real amount for a relation, because it can be clustered
                });
            }



            // create the link from subject to relation node
            if ($.grep(relation1, function(e) { return (e.target == relationBoxId) && (e.source == relation.subject); }).length === 0) {
                relation1.push({
                    source: relation.subject,
                    real_target: relation.object,
                    target: relationBoxId,
                    targetIsRelation: true,
                    stroke: Dims.rel.fill,
                    highlight: Dims.rel.highlight //,
                        //	id:'R_'+relation.name+'.'+relation.object + '.'+relation.subject

                });
            }
            // create the link from the relation node to the object
            if ($.grep(relation1, function(e) { return (e.source == relationBoxId) && (e.target == relation.object); }).length === 0) {
                relation1.push({
                    source: relationBoxId,
                    real_source: relation.subject,
                    target: relation.object,
                    targetIsRelation: false,
                    // stroke: Dims.link.stroke,
                    stroke: Dims.rel.fill,
                    highlight: Dims.link.highlight //,
                        //id:'R_'+relation.name+'.'+relation.object
                });
            }

        });

        // for each term create the term node
        $.each(terms, function(i, d) {
            // check if all relations are displayed
            var allRelations = getRelations([d.id]);
            var hasNonDisplayedRelations = false;
            $.each(allRelations, function(i, noderel) {
                if ($.grep(relations, function(e) { return e.name == noderel.name && e.object == noderel.object && e.subject == noderel.subject; }).length === 0) {
                    hasNonDisplayedRelations = true;
                    return false;
                }
            });

            term1.push({
                id: d.id,
                name: d.name,
                description: d.description,
                expandable: hasNonDisplayedRelations,
                group: d.collection_id,
                nodeType: NODETYPE.term,
                dragging: false,
                fill: Dims.node.fill,
                highlight: Dims.node.highlight,
                fixed: (d.fx || null) > 0,
                fx: d.fx || null,
                fy: d.fy || null,
                relationCount: allRelations.length
            });
        });

        // keep fixed node positions
        if (typeof G_graph != 'undefined') {
            $.each(G_graph.nodes, function(i, node) {
                var term = $.grep(term1, function(e) { return e.id == node.id; });
                if (term.length > 0) {
                    term[0].fx = node.fx;
                    term[0].fy = node.fy;
                    term[0].x = node.x;
                    term[0].y = node.y;
                    term[0].fixed = node.fixed;
                }
            });
        }
        return ({ links: relation1, nodes: term1 });
    }

    /**
     * Highlights this term and all outgoing relations
     *
     * @param {Object} node
     *
     */
    function highlightRelations(node) {
        if (node.nodeType === NODETYPE.relation) return; // if mouse-over on a relation-node, do nothing

        //The path which need to be highlighted is:
        //  selected node --- relation --> target node
        //      nA        lA     nB    lB     nC
        var linksA = $.grep(G_graph.links, function(e) { return e.source.id === node.id; }); //select all links which have this node as a source
        var linksAB = [];
        $.each(linksA, function(i, linkA) {
            linksAB.push(linkA);
            var linkB = $.grep(G_graph.links, function(e) { return e.source.id === linkA.target.id; })[0]; // select all links which have the target of previous selected node as a target
            linksAB.push(linkB);
        });

        svg.selectAll('.links')
            .attr("stroke", function(link) {
                return ($.grep(linksAB, function(linkAB) {
                    return linkAB.source.id == link.source.id;
                }).length ? link.highlight : link.stroke);
            })
            .style("marker-end", function(link) {
                return ($.grep(linksAB, function(linkAB) {
                    return linkAB.source.id == link.source.id;
                }).length ? "url(#target_red)" : (link.target.nodeType === NODETYPE.term) ? "url(#target)" : "url(#no)");
            });
        svg.selectAll('.nodeRect')
            .attr("stroke", function(nodeRect) {
                return (($.grep(linksAB, function(linkAB) {
                            return (linkAB.target.id == nodeRect.id);
                        }).length && nodeRect.nodeType === NODETYPE.term) || // this is  nC
                        nodeRect.id == node.id) ? // this is nA
                    nodeRect.highlight : getGroupColor(nodeRect.group);
            })
            .attr("fill", function(nodeRect) {
                return (($.grep(linksAB, function(linkAB) {
                        return (linkAB.target.id == nodeRect.id);
                    }).length && nodeRect.nodeType === NODETYPE.relation)) ? // this is nB
                    "red" : (nodeRect.id == highlightedTermId) ? '#ffff33' : nodeRect.fill;
            });
    }

    /**
     * D3 ticked function, with change parameters to draw the end-arrows
     *
     */
    function ticked() {

        var gLinks = svg.selectAll('.links');
        // to support links in IE11
        //(http://stackoverflow.com/questions/15693178/svg-line-markers-not-updating-when-line-moves-in-ie10)
        //	if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ){
        //gLink
        gLinks.each(function() { this.parentNode.insertBefore(this, this); });
        //	}

        // hierarchical mode will show sources above the targets
        if (hierarchyOnly) {
            //gLink
            gLinks.each(function(d) {
                if (d.source.nodeType === NODETYPE.relation) {
                    d.source.x = d.target.x; // relation boxes have the same x position as its target
                }
                //source is placed above the target (between 50 and 100 px)
                d.source.y = Math.min(d.source.y, d.target.y - 50);
                d.source.y = Math.max(d.source.y, d.target.y - 100);
            });
        }
        //   reposition relation exactlye between target  and source term. If there are more relations between the same two terms, adjust the relations boxes a bit
        //@todo: if relations are clustered, this can cause drifting, because it tries to reposition in between all the related terms.
        gLinks.each(function(d) {
            if (d.source.nodeType === NODETYPE.relation && !d.source.fixed && !d.source.dragging) { // do not reposition relation box if fixed or dragging
               // console.log(d.source, d.target, d.real_source);
                if (d.target.id === d.real_source.id) return;
                d.source.x = (d.target.x + d.real_source.x) / 2 + 30 * d.source.repeat; // there are more relations between the same 2 terms, adjust the relations boxes
                d.source.y = (d.target.y + d.real_source.y) / 2 + 30 * d.source.repeat;
            }
        });

        // gLink
        gLinks
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return calcX2(d); })
            .attr("y2", function(d) { return calcY2(d); });

        var gNodes = svg.selectAll('.gnode');
        gNodes //.each(groupFreeNodes(.2 * simulation.alpha()));
            .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
        /*
        var gNodeRelations = svg.selectAll('.gnode.relation');
        gNodeRelations //.each(groupFreeNodes(.2 * simulation.alpha()));
            .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
        */

    }

    // draw nodes without a relation to position 100
    function groupFreeNodes(alpha) {
        return function(d) {
            d.y += (d.relationCount || d.fixed || 1) ? 0 : (100 - d.y) * alpha;
            d.x += (d.relationCount || d.fixed || 1) ? 0 : (100 - d.x) * alpha;
        };
    }

    /**
     * draw the targets of links (from relation-node) to term-node alongside the rectangle
     *
     * @param {any} d
     * @returns
     */
    function calcX2(d) {
        var x = 0;
        if (d.target.nodeType === NODETYPE.term) { //if it is not a relation element (they can be drawn up to the center)
            // if connected node is above/below this one, draw arrows on top/bottom of this node
            if (drawAbove(d)) {
                var dif = d.source.x - d.target.x;
                dif = (dif < -500) ? -500 : (dif > 500) ? 500 : dif;
                x = xposScale(dif);
            } else { // draw arrow on left/right
                x = Dims.node.width / 2 + 8;
                x = (d.target.x < d.source.x) ? x : (-x);
            }
        }
        return d.target.x + x;
    }

    /**
     * draw the targets of links (from relation-node) to term-node alongside the rectangle
     *
     * @param {any} d
     * @returns
     */
    function calcY2(d) {
        // if connected node is above/below this one, draw arrows on top/bottom of this node
        var y = 0;
        if (d.target.nodeType === NODETYPE.term) {
            if (drawAbove(d)) {
                y = (d.target.y < d.source.y) ? Dims.node.height / 2 + 8 : (-Dims.node.height / 2 - 8);
            } else { // draw arrow on left/right
                y = yposScale(d.source.y - d.target.y);
            }
        }
        return d.target.y + y;
    }

    /**
     * calculate if the link is on top/bottom (true) or left-righ (false)
     *
     * @param {any} d
     * @returns
     */
    function drawAbove(d) {
        var dy = Math.abs(Math.abs(d.target.y - d.source.y) - 0);
        var dx = Math.abs(Math.abs(d.target.x - d.source.x) - 0);
        var ret = false;
        if (dy > 100 || dx < dy) {
            ret = true;
        }
        return (ret);
    }

    function dragstarted(d) {
        if (G_editMode) svg.style("cursor", "default");
        d.dragging = true;

        if (G_editMode && G_shiftKey) {

        } else {
            dragging = true;
            dragpos = 0;
            //d3.event.sourceEvent.stopPropagation();
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        }
    }

    function dragged(d) {

        d.fx = d3.event.x;
        d.fy = d3.event.y;
        //d.fixed=1;
        dragpos++;
    }

    function dragended(node) {
        if (G_editMode) svg.style("cursor", "text");
        dragging = false;
        node.dragging = false;
        if (!d3.event.active) simulation.alphaTarget(0);
        if (node.fixed || autoFix) {
            node.fixed = true;
            node.fx = node.x;
            node.fy = node.y;
        } else {
            node.fx = null;
            node.fy = null;
            node.fixed = false;
        }
        // save node positions in data
        var term = $.grep(G_graph.nodes, function(e) { return e.id == node.id; })[0];
        term.fx = node.fx;
        term.fy = node.fy;
        term.x = node.x;
        term.y = node.y;
        term.fixed = node.fixed;
        var showit = showLocks ? 1 : 0;
        svg.selectAll('.gnode').selectAll('.fixpin').data(G_graph.nodes, function(d) { return d.id; })
            .style("opacity", function(d) { return (d.fixed ? showit : 0); });
    }

    /**
     * Returns the color of the group the term belongs to. This is the border of the term box.
     *
     * @param {number} groupnr
     * @returns {string} hexcolor
     */

    function getGroupColor(groupnr) {
        return colormap(groupnr);
    }


    /**
     * set automatically Fix nodes after move
     *
     * @param {boolean} fixed
     */
    function setAutoFixOfNodes(event, fixed) {
        autoFix = fixed;
    }

    /**
     * Locks/unlocks all nodes
     *
     * @param {boolean} fixed - true=lock all, false=free all
     */
    function setAllNodesLock(event, fixed) {

        svg.selectAll('.gnode').each(function(d) {
            if (d.relationCount) { // leave the terms without relations as is
                d.fx = fixed ? d.x : null;
                d.fy = fixed ? d.y : null;
                d.fixed = fixed;
            }
        });
        //updateNodeList(G_nodelist);
        var showit = showLocks ? 1 : 0;
        svg.selectAll('.gnode')
            .selectAll('.fixpin')
            .data(G_graph.nodes, function(d) { return d.id; })
            .style("opacity", function(d) { return (d.fixed ? showit : 0); });
        updateGraph();
    }

    /**
     * Returns an arry of ids of terms which are displayed (also the related terms of this list are displayed)
     *
     * @returns
     */
    function getNodeList() {
        return G_nodelist;
    }

    /**
     * Set type of relation clustering. Use NODECLUSTER.in, .out, .none
     *
     * @param {number} clusterType
     */
    function setClusterRelations(event, clusterType) {
        G_clusterRelations = clusterType;
        // updateNodeList(getNodeList());
        displayTerms(G_nodelist);
    }

    function getUserInput(type, dataObject) {

        $('#btn_deleteTerm').show();
        $("#nameField").show();
        $("#descriptionField").show();
        $("#nameField").val("");
        $("#descriptionField").val("");
        $("#dataField").val(JSON.stringify(dataObject));

        if (type === DIALOG.newTerm) { // new term
            $("#inputDialog_title").html('Create Term');
            $('#btn_deleteTerm').hide();
            $("#btn_newTerm").html("Create");
        }
        if (type === DIALOG.changeTerm) { // change term
            $("#inputDialog_title").html('Change Term');
            $("#nameField").val(dataObject.name);
            $("#descriptionField").val(dataObject.description);
            $("#btn_newTerm").html("Update");
        }
        if (type === DIALOG.newRelation) { // new relation
            $("#inputDialog_title").html('Create Relation');
            $("#descriptionField").hide();
            $('#btn_deleteTerm').hide();
            $("#btn_newTerm").html("Create");
        }
        if (type === DIALOG.changeRelation) { // change term
            if (G_clusterRelations !== NODECLUSTER.none) {
                alert("Currently, this only works when the relation are not clustered.\n\nSelect 'Relations->No clustering'");
                return;
            }
            $("#inputDialog_title").html('Change Relation');
            $("#nameField").val(dataObject.name);
            // $("#descriptionField").val(dataObject.description);
            $("#descriptionField").hide();
            $("#btn_newTerm").html("Update");
        }

        $("#btn_newTerm").val(type);
        $("#btn_deleteTerm").val(type);
        $("#inputDialog").modal();
    }

    function createRelation(relname, nodes) {
        if (relname !== null && relname.length > 1) {
            var relation = {
                name: relname,
                subject: nodes.mousedown_node.id,
                object: nodes.mouseup_node.id,
            };
            $.publish("/data/put/relation", [G_modelId, relation, showIt]);
        } else {
            resetMouseVars();
        }

        function showIt(relation) {
            var subject = $.grep(G_graph.nodes, function(d) { return d.id === relation.subject; })[0];
            var object = $.grep(G_graph.nodes, function(d) { return d.id === relation.object; })[0];
            // fix the relation, exactly in the middle
            var x = (subject.fx + object.fx) / 2;
            var y = (subject.fy + object.fy) / 2;
            //  relation.fx = x;
            //  relation.fy = y;
            relation.id = relation.relation_id || relation.id;
            //  relation.fixed = true;
            G_data.relations.push(relation); //@TODO: Call api to store relation
            G_graph = getGraph(G_data.terms, G_data.relations);
            resetMouseVars();
            updateGraph();
        }
    }

    function createTerm(name, description) {
        if (name !== null && name.length > 1) {
            //@TODO: move this to getData.js
            //@TODO: proper error handling
            $.publish("/data/put/term", [G_modelId, { name: name, description: description }, showIt]);
        }

        function showIt(term) {

            if (typeof term !== 'object') {
                alert(term);
                return;
            }
            // fix term to click position
            term.fx = G_mousepos[0];
            term.fy = G_mousepos[1];

            G_data.terms.push(term); //@TODO: Call api to store relation
            G_graph = getGraph(G_data.terms, G_data.relations);
            updateGraph();
        }
    }

    function deleteTerm(term) {
        $.publish("/data/delete/term", [G_modelId, { id: term.id }, showIt]);

        function showIt(term) {
            G_data.terms = $.grep(G_data.terms, function(d) { return d.id != term.id; });
            G_data.relations = $.grep(G_data.relations, function(d) { return (d.object != term.id) && (d.subject != term.id); });
            G_graph = getGraph(G_data.terms, G_data.relations);
            updateGraph();
        }
    }

    function deleteRelation(relation) {

        $.publish("/data/delete/relation", [G_modelId, { id: relation.orgId }, showIt]);

        function showIt(relation) {
            G_data.relations = $.grep(G_data.relations, function(d) { return d.id != relation.id; });
            G_graph = getGraph(G_data.terms, G_data.relations);
            updateGraph();
        }
    }

    function changeTerm(name, description, oldTerm) {
        if (name === null) return;
        if (name.length) {
            $.publish("/data/update/term", [G_modelId, { name: name, id: oldTerm.id, description: description }, showIt]);
        }

        function showIt(term) {
            var changeTerm = $.grep(G_data.terms, function(d) { return d.id === term.id; })[0];
            changeTerm.name = term.name;
            changeTerm.description = term.description;

            G_graph = getGraph(G_data.terms, G_data.relations);
            // update the name in the graph
            svg.selectAll(".termname")
                .data(G_graph.nodes, function(d) { return d.id; })
                .filter(function(d) { return d.id === term.id; })
                .text(function(d) { return d.name; })
                .call(wrap, 100, true);
            var termNodes = $.grep(G_graph.nodes, function(e) { return e.nodeType === NODETYPE.term; });
            var gNodesTerm = svg.select('.nodegroup')
                .selectAll(".gnode.term")
                .data(termNodes, function(d) { return d.id; });
            updateGraph();
        }
    }

    function changeRelation(name, oldRelation) {

        if (name === null) return;


        var relation = $.grep(G_data.relations, function(d) { return d.id == oldRelation.orgId; })[0];

        if (name.length) {
            $.publish("/data/update/relation", [G_modelId, { name: name, id: relation.id, subject: relation.subject, object: relation.object }, showIt]);
        }

        function showIt(newRelation) {
            G_data.relations = $.grep(G_data.relations, function(d) { return d.id != oldRelation.orgId; });
            G_graph = getGraph(G_data.terms, G_data.relations);
            var subject = $.grep(G_graph.nodes, function(d) { return d.id === newRelation.subject; })[0];
            var object = $.grep(G_graph.nodes, function(d) { return d.id === newRelation.object; })[0];
            // fix the relation, exactly in the middle
            var x = (subject.fx + object.fx) / 2;
            var y = (subject.fy + object.fy) / 2;
            newRelation.fx = x;
            newRelation.fy = y;
            newRelation.id = newRelation.relation_id;
            newRelation.fixed = true;
            G_data.relations.push(newRelation); //@TODO: Call api to store relation
            G_graph = getGraph(G_data.terms, G_data.relations);
            resetMouseVars();
            updateGraph();
        }
    }

    ///-------------MOUSE EVENTS
    function zoomRect_mouseclick(node, that) {}

    function zoomRect_doubleclick(node, that) {
        G_mousepos = d3.mouse(svg.select('.gWindow').node());
        if (!G_editMode) return;
        getUserInput(DIALOG.newTerm, {});
    }

    function zoomRect_mouseup(node, that) {
        G_editLinkParms.drag_line
            .classed('hidden', true)
            .style('marker-end', '');
        resetMouseVars();
    }

    function zoomRect_mousemove(node, that) {
        that = svg0.select('.zoomRect').node();
        if (G_editMode) { // no fisheye when in edit mode
            if (!G_editLinkParms.mousedown_node) return;

            // update drag line
            G_editLinkParms.drag_line.attr('d', 'M' + G_editLinkParms.mousedown_node.x + ',' + G_editLinkParms.mousedown_node.y + 'L' +
                (1 / panzoom.k) * (d3.mouse(that)[0] - panzoom.x) + ',' + (1 / panzoom.k) * (d3.mouse(that)[1] - panzoom.y));
            return;
        }

        if (panzoom.k > 0.75) return; // do nothing when zoomlevel is high, otherwise show fisheye
        fisheye.focus([(1 / panzoom.k) * (d3.mouse(that)[0] - panzoom.x), (1 / panzoom.k) * (d3.mouse(that)[1] - panzoom.y)]);
        //d3.mouse must be corrected of the panzoom shift and the zoomfactor

        // to support links in IE11
        //(http://stackoverflow.com/questions/15693178/svg-line-markers-not-updating-when-line-moves-in-ie10)
        if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
            svg.selectAll('.links').each(function() { this.parentNode.insertBefore(this, this); });
        }

        svg.selectAll('.gnode')
            .each(function(d) { d.fisheye = fisheye(d); })
            .attr("transform", function(d) {
                return "translate(" + d.fisheye.x + "," + d.fisheye.y + ")" +
                    " scale(" + d.fisheye.z + ")";
            });

        svg.selectAll('.links')
            .each(function(d) { d.fisheye = fisheye(d); });

        svg.selectAll('.links')
            .attr("x1", function(d) { return d.source.fisheye.x; })
            .attr("y1", function(d) { return d.source.fisheye.y; })
            .attr("x2", function(d) { return calcX2({ target: { nodeType: d.target.nodeType, x: d.target.fisheye.x, y: d.target.fisheye.y }, source: { nodeType: d.source.nodeType, x: d.source.fisheye.x, y: d.source.fisheye.y } }); })
            .attr("y2", function(d) { return calcY2({ target: { nodeType: d.target.nodeType, x: d.target.fisheye.x, y: d.target.fisheye.y }, source: { nodeType: d.source.nodeType, x: d.source.fisheye.x, y: d.source.fisheye.y } }); });
    }

    function relation_mousedown(node, that) {
        console.log("---Node properties: ", node, that);
        console.log(G_graph);
        console.log(G_data);
    }

    function relation_mousemove(node, that) {
        zoomRect_mousemove(node, that); //continue handle fisheye and drag of new relation
    }

    function relation_mouseup(node, that) {
        G_editLinkParms.drag_line
            .classed('hidden', true)
            .style('marker-end', '');
        resetMouseVars();
    }

    function termRect_mouseout(node, that) {
        if (!dragging) { resetElements(); }
        if (G_editMode) svg.style("cursor", "default");
    }


    function termRect_doubleclick(node, that) {}

    function termRect_mouseup(node, that) {
        G_editLinkParms.drag_line
            .classed('hidden', true)
            .style('marker-end', '');
        resetMouseVars();
    }

    function termRect_mouseover(node, that) {
        if (G_editMode && !dragging) svg.style("cursor", "text");
        highlightRelations(node);
    }

    function termGroup_mousemove(node, that) {
        zoomRect_mousemove(node, that); //continue handle fisheye and drag of new relation
    }

    function termGroup_mousedown(node, that) {
        if (G_editMode) svg.style("cursor", "default");
        console.log("---Node properties: ", node, that);
        console.log(G_graph);
        console.log(G_data);
    }

    function termGroup_mouseup(node, that) {}

    function termGroup_dblclick(node, that) {
        toggleNode(node);
    }

    function termGroup_click(node, that) {
        if (G_editMode) {
            getUserInput(DIALOG.changeTerm, node);
        } else {
            var d3object = d3.select(that);
            showNodeMenu(node, d3object);
        }
    }

    function relationGroup_click(node, that) {
        if (G_editMode) {
            getUserInput(DIALOG.changeRelation, node);
        }

    }

    function termFixpin_mousedown(node, that) {
        // remove fixed positions from saved terms, and from the element
        var term = $.grep(G_graph.nodes, function(e) { return e.id == node.id; })[0];
        term.fx = null;
        term.fy = null;
        term.x = node.x;
        term.y = node.y;
        term.fixed = false;
        d3.event.stopPropagation();
        node.fx = null;
        node.fy = null;
        node.fixed = false;
        d3.select(that).style("opacity", "0");
    }

    function termBorderRect_mouseover(d, that) {
        if (!G_editMode) return;
        svg.style("cursor", "crosshair");
        d3.select(that).style("fill", "grey");
        G_editLinkParms.drag_line
            .classed('nok', false);
    }

    function termBorderRect_mousedown(node, that) {
        setAllNodesLock(null, true);
        d3.event.preventDefault();
        d3.event.stopPropagation();
        resetMouseVars();
        svg.select('.zoomRect').on('.zoom', null);

        G_editLinkParms.mousedown_node = $.grep(G_graph.nodes, function(d) { return d.id === node.id; })[0];
        G_editLinkParms.mousedown_node.x = G_editLinkParms.mousedown_node.fx;
        G_editLinkParms.mousedown_node.y = G_editLinkParms.mousedown_node.fy;

        G_editLinkParms.drag_line
            .style('marker-end', 'url(#end-arrow)')
            .classed('hidden', false)
            .attr('d', 'M' + G_editLinkParms.mousedown_node.x + ',' + G_editLinkParms.mousedown_node.y + 'L' + G_editLinkParms.mousedown_node.x + ',' + G_editLinkParms.mousedown_node.y);
    }

    function termBorderRect_mouseup(node, that) {
        if (!G_editMode) return;
        G_editLinkParms.mouseup_node = $.grep(G_graph.nodes, function(d) { return d.id === node.id; })[0];
        if (G_editLinkParms.mouseup_node === G_editLinkParms.mousedown_node) { resetMouseVars(); return; }

        //  var relname = prompt("Enter relation name", "");
        getUserInput(DIALOG.newRelation, G_editLinkParms);
    }

    function termBorderRect_mouseout(d, that) {
        if (!G_editMode) return;
        G_editLinkParms.drag_line
            .classed('nok', true);
        d3.select(that).style("fill", "none");
        svg.style("cursor", "default");
    }

    $(document).on('click', "#btn_newTerm", function(e) {
        var dataObject = JSON.parse($('#dataField').val());
        var name = $('#nameField').val();
        var description = $('#descriptionField').val();
        $('#newNameField').val("");
        $('#newDescField').val("");
        if ($(this).val() == DIALOG.newTerm) {
            createTerm(name, description);
        }
        if ($(this).val() == DIALOG.changeTerm) {
            changeTerm(name, description, dataObject);
        }
        if ($(this).val() == DIALOG.newRelation) {
            createRelation(name, dataObject);
        }
        if ($(this).val() == DIALOG.changeRelation) {
            changeRelation(name, dataObject);
        }
    });
    $(document).on('click', "#btn_deleteTerm", function(e) {
        var dataObject;
        if ($(this).val() == DIALOG.changeTerm) { // the change term dialog contains a delete button to remove the term
            dataObject = JSON.parse($('#dataField').val());
            deleteTerm(dataObject);
        }
        if ($(this).val() == DIALOG.changeRelation) { // the change term dialog contains a delete button to remove the term
            dataObject = JSON.parse($('#dataField').val());
            deleteRelation(dataObject);
        }
    });
    $(document).on('click', ".cancelDialog", function(e) {
        resetMouseVars(); //there might be a dragline for new relations. close it
    });
    window.addEventListener("keydown", onKeydown, false);
    window.addEventListener("keyup", onKeyup, false);

    // ********* help functions
    function onKeydown(event) {

        if (event.key === 'Control') {
            setBrushing(true);
        }

    }

    function onKeyup(event) {

        if (event.key === 'Control') {
            setBrushing(false);
        }
    }

    function wrap(text1, orgwidth, vert_center) {
         console.log('wrap called', text1, orgwidth);
        if (orgwidth === 0) return;
       

        text1.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1,
                y = text.attr("y"),
                x = Number(text.attr("x")),
                dy = 0,
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy * Dims.node.font_size + "px");

            var width = (orgwidth === 0) ? text.data()[0].width : orgwidth;

            $.each(words, function(i, w) {
                if (tspan.text(w).node().getComputedTextLength() > width) { // if the word is too long, break it up
                    for (var a = 0; a < 3; a++) { // do it for max 4 lines, as only 3 are displayed
                        var maxwordlen = 20;
                        while (tspan.text(w.substring(0, maxwordlen) + "+").node().getComputedTextLength() > width) {
                            maxwordlen--;
                        }
                        maxwordlen--;
                        if (w.length <= maxwordlen) break;
                        var fitword = w.substring(0, maxwordlen) + '+';
                        var restword = w.substring(maxwordlen);
                        words[i] = restword;
                        w = restword;
                        words.splice(i + 1, 0, fitword);
                    }
                }
            });

            var nrlines = 1;
            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    nrlines++;

                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    if ((words.length) && nrlines > 2) { word = word + "..."; }
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", /*++lineNumber * lineHeight*/ Dims.node.font_size + "px").text(word);
                    if (nrlines > 2) break;
                }
            }
            if (vert_center && (nrlines == 1)) {
                text.attr("transform", "translate(0,3)");
            }
            if (vert_center && (nrlines == 2)) {
                text.attr("transform", "translate(0,-2)");
            }
            if (vert_center && (nrlines == 3)) {
                text.attr("transform", "translate(0,-6)");
            }
        });
    }

    return {
        initGraph: initGraph,
        NODECLUSTER: NODECLUSTER
    };


})();
// Mgraph END --------------------------------------------------------
// getData START --------------------------------------------------------
var getData = (function() {
    var G_termList = [];
    var G_relList = [];
    var G_parms;

    function init(parms) {
        G_parms = parms;
        $.subscribe("/data/get/termId", getTermId);
        $.subscribe("/data/get/modelId", getModelId);
        $.subscribe("/data/get/references", findReference);
        $.subscribe("/data/get/allTerms", getAllTerms); // @todo
        $.subscribe("/data/get/termsWithRelations", fetchAllTerms);
        $.subscribe("/data/get/sketches", getSketches);
        $.subscribe("/data/put/sketch", saveSketch);
        $.subscribe("/data/put/term", saveTerm);
        $.subscribe("/data/update/term", updateTerm);
        $.subscribe("/data/update/relation", updateRelation);

        $.subscribe("/data/delete/term", deleteTerm);
        $.subscribe("/data/delete/relation", deleteRelation);
        $.subscribe("/data/delete/sketches", deleteSketches);
        $.subscribe("/data/put/relation", saveRelation);
        $.subscribe("/data/get/sketch", loadSketch);



        if (!G_parms.remote) {
            if ((typeof G_FRIM != "undefined") && G_FRIM) {
                $.each(DATA_term, function(i, term) {
                    var def = $.grep(DATA_def, function(e) { return e.id == term.id; })[0];
                    G_termList.push({
                        id: term.id,
                        name: term.name,
                        description: def.description,
                        addinfo: def.addinfo
                    });

                });
                $.each(DATA_rel, function(i, relation) {
                    var relmeta = $.grep(DATA_relation_id, function(e) { return (e.id == relation.relation); })[0];
                    G_relList.push({
                        name: relmeta.name,
                        subject: relation.subject,
                        object: relation.object
                    });

                });
            } else {
                $.each(DATA_term, function(i, term) {
                    var def = $.grep(DATA_def, function(e) { return e.id == term.id; })[0];
                    G_termList.push({
                        id: term.id,
                        name: term.name,
                        description: def.description,
                        addinfo: def.addinfo
                    });

                });
                $.each(DATA_relation, function(i, relation) {

                    G_relList.push({
                        name: relation.relation,
                        subject: relation.subject,
                        object: relation.object
                    });

                });

            }

        }
    }

    function createRelation(link) {
        return {
            name: link.link_name,
            subject: link.source,
            object: link.target,
            id: link.id
        };

    }

    function loadSketch(event, collection_id, sketch_name, callback) {
        var token = $('meta[name="_token"]').attr('content');
        var url = $('meta[name="base_url"]').attr('content');
        console.log(sketch_name);
        $.ajax({
            type: "GET",
            url: url + "/api/sketches",
            data: {
                "collection_id": parseInt(collection_id),
                _token: token
            },
            success: function(json) {
                console.log(json);
                var sketch_data = $.grep(json, function(d) { return d.sketch_name === sketch_name; });
                console.log(sketch_data);
                callback(JSON.parse(sketch_data[0].sketch_data));
            },
            failure: function(errMsg) {
                console.log(errMsg);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
                alert(xhr.responseJSON.message);
            }
        });

    }

    function getSketches(event, collection_id, callback) {
        /*
        $(document).ready(function() {
            var token = $('meta[name="_token"]').attr('content');
            var url = $('meta[name="base_url"]').attr('content');
            console.log("get sketches:", url + "/api/collections/" + collection_id + "/sketches");
            $.ajax({
                type: "GET",
                url: url + "/api/collections/" + collection_id + "/sketches",
                data: {
                    _token: token
                },
                success: function(json) {
                    console.log(json);
                    var retVal = null;
                    if (json.sketch_data[0] === '{') {
                        try {
                            retVal = JSON.parse(json.sketch_data);
                        } catch (e) {
                            // alert(e); // error in the above string (in this case, yes)!
                        }

                    }
                    callback(retVal);
                },
                failure: function(errMsg) {
                    console.log(errMsg);
                },
                error: function(xhr, status, error) {
                    console.log(xhr, status, error);
                    // alert(xhr.responseJSON.message);
                    callback(null);
                }
            });

        });
        */
    }

    function createTerm(node) {
        console.log(node);
        // var term = $.grep(graph.nodes, function(e) { return (e.id === termId); })[0];
        return {
            id: node.id,
            name: node.term_name,
            description: node.term_definition || "<em>No description available</em>",
            addinfo: "",
            collection_id: node.collection.id,
            collection_name: node.collection.collection_name,
            updated_at: node.updated_at
        };
    }

    function createTerm1(node) {
        // var term = $.grep(graph.nodes, function(e) { return (e.id === termId); })[0];
        return {
            id: node.id,
            name: node.term_name,
            description: node.term_definition,
            addinfo: "",
            collection_id: node.collection_id,
            collection_name: node.collection_name
        };
    }

    function createTerms(nodes) {
        var termArray = [];
        $.each(nodes, function(i, node) {
            termArray.push(createTerm1(node));
        });
        return termArray;
    }

    function createRelations(links) {
        var relationArray = [];
        $.each(links, function(i, link) {
            relationArray.push(createRelation(link));
        });
        return relationArray;
    }

    function getModelId(event, modelId, callback) {
        if (G_parms.remote) {

            var query = G_parms.remoteURL + '/visualise?getCollection=' + modelId;
            console.log(query);
            $.getJSON(query, function(graph) {
                    console.log(graph);
                    var terms = createTerms(graph.nodes);
                    var relations = createRelations(graph.links);
                    console.log(terms, relations);
                    callback({ terms: terms, relations: relations });
                })
                .fail(function(jqxhr) {
                    console.log(jqxhr);
                    var term1 = createTerm(jqxhr.responseJSON[0]);
                    callback(term1);
                });
        }


    }
    /**
     * Fetches the term object which has the termId, and calls the callback function
     *
     * @param {Object} event
     * @param {string} id
     * @param {function} callback
     */

    function getTermId(event, termId, callback) {


        if (G_parms.remote) {
            var query = G_parms.remoteURL + '/terms/' + termId;
            console.log(query);
            $.getJSON(query, function(graph) {
                    console.log(graph);
                    var term1 = createTerm(graph);
                    callback(term1);
                })
                .fail(function(jqxhr) {
                    console.log(jqxhr);
                    var term1 = createTerm(jqxhr.responseJSON[0]);
                    callback(term1);
                });
        } else {
            var term = $.grep(G_termList, function(e) { return (e.id == termId); })[0];
            callback(term);
        }
    }

    function fetchAllTerms(event, toFetchIds, callback) {
        if (toFetchIds.length) {
            fetchTerm(toFetchIds, fetchAllTerms, callback);
        } else {
            callback({ terms: G_termList, relations: G_relList });
        }
    }

    function processArray(graph) {
        $.each(graph.nodes, function(i, node) {
            if ($.grep(G_termList, function(e) { return e.id == node.id; }).length === 0) {
                G_termList.push(createTerm1(node));
            }
        });

        $.each(graph.links, function(i, link) {
            if ($.grep(G_relList, function(e) { return e.name == link.name && e.subject == link.source && e.object == link.target; }).length === 0) {
                G_relList.push(createRelation(link));
            }
        });
    }


    function saveRelation(event, collection_id, relation, callback) {
        console.log(collection_id, relation);

        var token = $('meta[name="_token"]').attr('content');
        var url = $('meta[name="base_url"]').attr('content');
        $.ajax({
            type: "POST",
            url: url + "/api/ontologies",
            data: {
                "collection_id": Number(collection_id),
                "object_id": relation.object,
                "relation_name": relation.name,
                "subject_id": relation.subject,
                _token: token
            },
            success: function(json) {
                console.log(json);
                var rel = {
                    "name": relation.name,
                    "object": relation.object,
                    "relation_id": json.id, //relation.name
                    "subject": relation.subject,
                    "status_id": 1

                };
                callback(rel);
            },
            failure: function(errMsg) {
                console.log(errMsg);
            }
        });




    }

    function deleteTerm(event, collection_id, term, callback) {
        var token = $('meta[name="_token"]').attr('content');
        var url = $('meta[name="base_url"]').attr('content');
        $.ajax({
            type: "DELETE",
            url: url + "/api/terms/" + term.id,
            data: {
                _token: token
            },
            success: function(json) {
                console.log(json);
                callback(term);
            },
            failure: function(errMsg) {
                console.log(errMsg);
            }
        });
    }

    function deleteRelation(event, collection_id, relation, callback) {
        console.log(relation);
        var token = $('meta[name="_token"]').attr('content');
        var url = $('meta[name="base_url"]').attr('content');
        $.ajax({
            type: "DELETE",
            url: url + "/api/ontologies/" + relation.id,
            data: {
                _token: token
            },
            success: function(json) {
                console.log(json);
                callback(relation);
            },
            failure: function(errMsg) {
                console.log(errMsg);
            }
        });
    }

    function updateTerm(event, collection_id, term, callback) {
        var token = $('meta[name="_token"]').attr('content');
        var url = $('meta[name="base_url"]').attr('content');
        $.ajax({
            type: "PUT",
            url: url + "/api/terms/" + parseInt(term.id),
            data: {
                "collection_id": parseInt(collection_id),
                "term_name": term.name,
                "term_definition": term.description,
                _token: token
            },
            success: function(json) {
                console.log(json);
                var term = {
                    name: json.term_name,
                    description: json.term_definition,
                    collection_id: json.collection_id,
                    id: json.id
                };
                callback(term);
            },
            failure: function(errMsg) {
                console.log(errMsg);
            }
        });
    }

    function updateRelation(event, collection_id, relation, callback) {
        console.log(relation);
        deleteRelation(null, null, relation, createNew);

        function createNew(relation) {
            console.log('createnew', relation);
            saveRelation(event, collection_id[0], relation, callback);

        }

        /*
        var token = $('meta[name="_token"]').attr('content');
        var url = $('meta[name="base_url"]').attr('content');
        $.ajax({
            type: "PUT",
            url: url + "/api/terms/" + parseInt(term.id),
            data: {
                "collection_id": parseInt(collection_id),
                "term_name": term.name,
                "term_definition": term.description,
                _token: token
            },
            success: function(json) {
                console.log(json);
                var term = {
                    name: json.term_name,
                    description: json.term_definition,
                    collection_id: json.collection_id,
                    id: json.id
                }
                callback(term);
            },
            failure: function(errMsg) {
                console.log(errMsg);
            }
        });
        */
    }


    function saveTerm(event, collection_id, term, callback) {
        var token = $('meta[name="_token"]').attr('content');
        var url = $('meta[name="base_url"]').attr('content');
        $.ajax({
            type: "POST",
            url: url + "/api/terms",
            data: {
                "collection_id": parseInt(collection_id),
                "term_name": term.name,
                "term_definition": term.description,
                _token: token
            },
            success: function(json) {
                if (typeof jsone !== 'object') {
                    var term = {
                        id: json.id,
                        name: json.term_name,
                        description: json.term_definition,
                        addinfo: "",
                        collection_id: parseInt(json.collection_id),
                        collection_name: json.collection_name
                    };
                    callback(term);
                } else {
                    callback(json);
                }

            },
            failure: function(errMsg) {
                console.log(errMsg);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
                alert(xhr.responseJSON.message);
            }
        });
    }

    function deleteSketches(event, collection_id) {
        var token = $('meta[name="_token"]').attr('content');
        var url = $('meta[name="base_url"]').attr('content');
        console.log(url + "/api/sketches/" + parseInt(collection_id));
        $.ajax({
            type: "DELETE",
            url: url + "/api/sketches/" + parseInt(collection_id),
            data: {
                _token: token
            },
            success: function(json) {
                console.log(json);
            },
            failure: function(errMsg) {
                console.log(errMsg);
            }
        });

    }



    function saveSketch(event, collection_id, sketch_name, graph) {
        var token = $('meta[name="_token"]').attr('content');
        var url = $('meta[name="base_url"]').attr('content');
        console.log(graph);
        $.ajax({
            type: "POST",
            url: url + "/api/sketches",
            data: {
                "collection_id": parseInt(collection_id),
                "sketch_name": "name8",
                "sketch_data": JSON.stringify(graph),
                _token: token
            },
            success: function(json) {
                console.log(json);
            },
            failure: function(errMsg) {
                console.log(errMsg);
            },
            error: function(xhr, status, error) {
                console.log(xhr, status, error);
                //   alert(xhr.responseJSON.message);
            }
        });
    }


    /**
     * Fetches the first termID from the provided array, including all related terms and relations 2 levels deep
     * It adds the nodes to the global var G_termList, and the links to the global var G_relList
     *
     * @param {Array.<number>} termIdArray
     * @param {any} callback
     */
    function fetchTerm(termIdArray, callback, orgcallback) {
        var element = termIdArray.pop();
        if (G_parms.remote) {
            var query = G_parms.remoteURL + '/visualise?withIds=' + element + '&getUnfetchedRelations=1&levelsDeep=2';
            console.log(query);
            $.getJSON(query, function(graph) {
                    console.log(graph);
                    processArray(graph);
                    callback(null, termIdArray, orgcallback);
                })
                .fail(function(jqxhr) {
                    console.log(jqxhr.responseJSON);
                    processArray(jqxhr.responseJSON);
                });
        } else {
            callback(null, termIdArray, orgcallback);
        }
    }


    /**
     * returns an array of ALL term Objects (used for finding termname via typeahead)
     * @todo Only is available in local data. It uses global var DATA_term. Need to implement a remote option
     *
     * @returns {Array.<Object>} termObjectArray
     */
    function getAllTerms(event, query, callback) {

    }

    /**
     * Find all terms which have a reference to the provided termId in their term_description and Returns
     * a text string with the options for a selection refTermlist
     * @todo uses external global variable G_termList, and assumes it has all terms fetched
     * @todo returns a text string with the options, this should be more generic like an array of term objects
     * @todo sloppy code...
     *
     * @param {number} termId
     * @returns {string} options
     */
    function findReference(event, termId, callback) {


        var refTermList = [];
        var pref_ref = "00000";

        var i, description, x, y, link, a, link_id, link_name, termId1, termName1;

        // search all descriptions
        console.log(G_termList);
        for (i = 0; i < G_termList.length; i++) {
            description = G_termList[i].description;
            x = description.indexOf("[");
            y = description.indexOf("]");
            // now search a link in the description
            while (x > 0 && y > 0) {
                link = description.substring(x + 1, y);

                a = link.indexOf(":");
                link_id = link.substring(0, a);
                link_name = link.substring(a + 1, 100);
                description = description.substring(y + 1, 8000);

                x = description.indexOf("[");
                y = description.indexOf("]");

                // term found in description
                // sometimes the term is used more times in the same description,
                // so only add it once
                if ((link_id == termId) && (G_termList[i].id != pref_ref)) {
                    refTermList.push(G_termList[i]);
                    pref_ref = G_termList[i].id;
                }
            }
        }
        /* refTermlist contains the Ids of the terms. So the names need to be lookedup to sort on name */

        refTermList.sort(
            function(a, b) {
                if (a.name < b.name) {
                    return -1;
                } else {
                    return (a.name > b.name) ? 1 : 0;
                }
            }
        );

        var ref_terms_txt = "";
        for (i = 0; i < refTermList.length; i++) {
            termId1 = refTermList[i].id;
            termName1 = refTermList[i].name;
            ref_terms_txt = ref_terms_txt + '<option value="' + termId1 + '">' + termName1 + '</option>';
        }
        callback(ref_terms_txt);
    }

    return {
        init: init
    };

})();

// getData END --------------------------------------------------------
var G_remote=true;
 
function changedZoom(event, zoomLevel) {
/*	$("#zoomSlide").bootstrapSlider('setValue', zoomLevel);*/
}

$(window).resize(function () {
	//	$('#content').height($(window).height() - 46);
	console.log('resized');
	sizeDivs();
});

function sizeDivs() {
	$('#Mgraph').height($(window).height() - $('#Mmenu').height() - 20);
	$('#Mgraph').css("marginTop", '5px');
}



var collection_id;
$(document).ready(function () {
	

	//  $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
});


$(document).on('click', "#saveCollectionLayout", function (e) {
	//$(this).parent().addClass('disabled');
	$.publish("/graph/save/layout", [collection_id, "name8"]);
});
$(document).on('click', "#loadCollectionLayout", function (e) {
	//$(this).parent().addClass('disabled');
	$.publish("/graph/load/layout", [collection_id, "name8"]);
});
$(document).on('click', "#deleteCollectionLayout", function (e) {
	//$(this).parent().addClass('disabled');
	var del = confirm("Delete this layout?");
	if (del) {
		$.publish("/graph/delete/layout", [collection_id, "name8"]);
	}
});

$(document).on('click', "#editCollection", function (e) {
	$(this).addClass('hide');
	$('#viewCollection').removeClass('hide');
	$.publish("/graph/set/editMode", [true]);
});
$(document).on('click', "#viewCollection", function (e) {

	$('#viewCollection').addClass('hide');
	$('#editCollection').removeClass('hide');
	$.publish("/graph/set/editMode", [false]);
});

$(document).on('click', "#unlockAll", function (e) {
	$.publish("/graph/set/termsLock", [false]);
});
$(document).on('click', "#lockAll", function (e) {
	$.publish("/graph/set/termsLock", [true]);
});
$(document).on('click', "#relationShowAll", function (e) {
	$.publish("/graph/set/hierarchy", [false]);
	$(this).parent().addClass('disabled');
	$('#relationShowHierarchy').parent().removeClass('disabled');
});
$(document).on('click', "#relationShowHierarchy", function (e) {
	$.publish("/graph/set/hierarchy", [true]);

	$(this).parent().addClass('disabled');
	$('#relationShowAll').parent().removeClass('disabled');
});
$(document).on('click', "#clusterIn", function (e) {
	$.publish("/graph/set/clusterRelations", [Mgraph.NODECLUSTER.in]);

	$(this).parent().addClass('disabled');
	$('#clusterOut').parent().removeClass('disabled');

	$('#clusterNone').parent().removeClass('disabled');
});
$(document).on('click', "#clusterOut", function (e) {
	$.publish("/graph/set/clusterRelations", [Mgraph.NODECLUSTER.out]);
	$(this).parent().addClass('disabled');
	$('#clusterIn').parent().removeClass('disabled');
	$('#clusterNone').parent().removeClass('disabled');
});
$(document).on('click', "#clusterNone", function (e) {
	$.publish("/graph/set/clusterRelations", [Mgraph.NODECLUSTER.none]);
	$(this).parent().addClass('disabled');
	$('#clusterOut').parent().removeClass('disabled');
	$('#clusterIn').parent().removeClass('disabled');
});

$(document).on('click', "#autoLockOn", function (e) {
	$.publish("/graph/set/autoFixTerms", [true]);
	$(this).parent().addClass('disabled');
	$('#autoLockOff').parent().removeClass('disabled');
});
$(document).on('click', "#autoLockOff", function (e) {
	$.publish("/graph/set/autoFixTerms", [false]);
	$(this).parent().addClass('disabled');
	$('#autoLockOn').parent().removeClass('disabled');
});

$(document).on('click', "#showLockOn", function (e) {
	$.publish("/graph/set/showFixpins", [true]);
	$(this).parent().addClass('disabled');
	$('#showLockOff').parent().removeClass('disabled');
});
$(document).on('click', "#showLockOff", function (e) {
	console.log("clicked");

	$('#showLockOff').parent().addClass('disabled');
	$('#showLockOn').parent().removeClass('disabled');
	$.publish("/graph/set/showFixpins", [false]);
});
window.onbeforeunload = function () {
	console.log('saving layout');
	$.publish("/graph/save/layout", [collection_id, "name8"]);
	// debugger;
};





import Vue from 'vue'
export default {
    name: "visual",
    props: {
        id: {
            type: String,
            required: true
        },

        collectionId: {
            type:String,
            required:true
        }
    },
    data() {
        return {
            content: ""
        }
    },
    watch: {
       
    },
    created() {
        
    },
    mounted() {
  sizeDivs();

	console.log("ja");



/*
	$('#zoomSlide').bootstrapSlider({ tooltip: 'hide' })
		.on('slide', function (e, f) { $.publish("/graph/set/zoom", [e.value]); });
*/

	$.subscribe("/graph/event/changedZoom", changedZoom);

	var url = " http://localhost/meet-Alex/public/index.php" ;
	var term_id = null;
	collection_id = this.collectionId;

	getData.init({
		remote: G_remote, // true=remote (fill remoteURL), false=local
		remoteURL: url + '/api'
	});
	//typeahead.initTypeAhead(G_remote, url + '/api'); // the typeahead search function
	// typeahead.initTypeAhead(false, url + '/api'); // the typeahead search function
	//defBox.initDefBox({
	//	mainDivId: "Mgraph"
	//}); // the boxes with the definitions and details

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

        //Initial configuration

    },
    beforeDestroy() {
        
    }
}
</script>

<style>
@import '/src/plugins/visual/css/app.css';
@import '/src/plugins/visual/css/defBox.css';

@import '/src/plugins/visual/libs/typeahead.css';
@import '/src/plugins/visual/libs/jquery-ui.min.css';
@import '/src/plugins/visual/libs/jquery-ui.theme.min.css';
@import '/src/plugins/visual/libs/jquery-ui.structure.min.css';
@import '/src/plugins/visual/libs/bootstrap-slider.css';
/*
@import '/src/plugins/visual/sm-core-css.css';
@import '/src/plugins/visual/sm-simple.css';
*/
</style>