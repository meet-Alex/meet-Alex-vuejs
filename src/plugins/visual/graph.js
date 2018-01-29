var Mgraph = function(d3,$, getData) {

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
        G_dirty,
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
     

        initParms = parms; // make parms global
        // fill interface variables with defaults. These can be changed by provided functions
        showLocks = true;
        hierarchyOnly = false; //only show hierarchy
        G_clusterRelations = NODECLUSTER.in; //0=no, 1=incoming, 2=outgoing
        G_editMode = false; // start in viewmode
        G_dirty = false;
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
        G_windowDims.width = Math.floor($(mainDiv).width());
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
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) { return (d.target.nodeType === NODETYPE.relation) ? 150 : 150; }).iterations(1) /*.strength(0.3)*/ )
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
     * @param {any} collectionId 
     * @param {String} name 
     */
    function loadLayout(collectionId, name) {
        G_modelId = collectionId;
        getData.getSketches(collectionId, showIt);
        function showIt(newData) {
            if (newData) {
              setClusterRelations(newData.G_clusterRelations);
              newData.nodePositions.map(function(nodePosition){
                var fndnode=G_graph.nodes.find(function(orgnode){
                    return orgnode.id==nodePosition.id;
                });
                if (fndnode) {
                    fndnode.fx=nodePosition.x;
                    fndnode.fy=nodePosition.y;
                    fndnode.x=nodePosition.x;
                    fndnode.y=nodePosition.y;
                    fndnode.fixed=true;
                }        
              });
                G_clusterRelations = newData.G_clusterRelations;
            }
        }
    }

    /**
     * Save the term and relation positions
     * 
     * @param {Object} event 
     * @param {any} collectionId 
     * @param {Sting} name 
     */
    function saveLayout(collectionId, name) {
        getData.saveSketch(collectionId, name, { G_termid: G_termid, G_graph: G_graph, G_nodelist: G_nodelist, G_clusterRelations: G_clusterRelations });
    }

    /**
     * Sets the graphical edit mode, and fix all elements
     *
     * @param {Object} event
     * @param {Boolean} active
     */
    function setEditMode( active) {
        G_editMode = active;
        if (active) {
            d3.selectAll('.menuItems').remove();
            setShowLocks(false);
            //setAllNodesLock(true);
            svg0.selectAll('.zoomRect').style('stroke', 'red');
            G_dirty=true; // it is possibly edited, so update everything on leave
        } else {
            svg0.selectAll('.zoomRect').style('stroke', 'grey');
        }
    }
    function isDirty() {
        return G_dirty;
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
    function setShowLocks( active) {
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
        console.log("getoneterm", toFetchIDs)
        getData.fetchAllTerms(toFetchIDs, showIt);

        function showIt(newData) {
            console.log("showit")
            G_data = newData;
            displayTerms(G_nodelist);
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
        console.log("display", termIDs)
        if (!termIDs.length) return;
        // when there is nothing displayed in the graph, show the logo, and remove the border of the graph rectangle
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
              // d.model = G_remote ? model  : 1;
                d.model=model;
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
    }

    function showModel( modelId, restorePositions) {
        G_modelId = modelId;
        restorePositions = (typeof restorePositions === 'undefined') ? false : restorePositions;
        getData.getModelId(modelId, showIt);

        function showIt(newData) {
            G_data = newData;
            G_nodelist = [];
            $.each(newData.terms, function(i, term) {
                G_nodelist.push(term.id);
            });

            G_graph = getGraph(newData.terms, newData.relations);
            loadLayout(modelId, "name8");
            positionUnrelatedTerms();
            updateGraph();
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
    function showTerms(termIds) {
        console.log(termIds);
        updateNodeList(termIds);
        updateGraph();
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
            .style("fill", "purple")
            .style("stroke-width", "1px")
            .style("opacity", "0")
            .attr("transform", "translate(" + (0.5 * (Dims.node.width) - 14) + "," + (-Dims.node.height + 24) + ") scale(0.7)")
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
            .style("fill", "purple")
            .style("stroke-width", "1px")
            .style("opacity", "0")
            .attr("transform", function(d) {
                var x = (0.5* this.parentNode.getBBox().width-10);
                var y = (-20);
                return "translate(" + x + "," + y + ") scale(0.7)";
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
        console.log('togglenode', term, G_nodelist)
        if ($.grep(G_nodelist, function(d) { return d == term.id; }).length === 0) {
            G_nodelist.push(term.id);
        } else {
            if (G_nodelist.length > 1) {// avoid removal of last node
                G_nodelist = $.grep(G_nodelist, function(d) { return d != term.id; }); //remove node
                console.log('remove')
                console.log(G_nodelist)
            }
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

               // $.publish("/show/description/termId", [d.id]);
            });
        menuDef.append("text")
            .text("Description")
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
        /*
        //(http://stackoverflow.com/questions/15693178/svg-line-markers-not-updating-when-line-moves-in-ie10)
        if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ){

             gLinks.each(function() { this.parentNode.insertBefore(this, this); });
        }
        */
        // hierarchical mode will show sources above the targets
        if (hierarchyOnly) {
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
               
                if (d.target.id === d.real_source.id) return;
                d.source.x = (d.target.x + d.real_source.x) / 2 + 30 * d.source.repeat; // there are more relations between the same 2 terms, adjust the relations boxes
                d.source.y = (d.target.y + d.real_source.y) / 2 + 30 * d.source.repeat;
            }
        });

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
    function setAutoFixOfNodes(fixed) {
        autoFix = fixed;
    }

    /**
     * Locks/unlocks all nodes
     *
     * @param {boolean} fixed - true=lock all, false=free all
     */
    function setAllNodesLock( fixed) {
        G_graph.nodes.map(function(d)  {
            console.log(d);
            d.fx = fixed ? d.x : null;
            d.fy = fixed ? d.y : null;
            d.fixed = fixed;
        });

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
    function setClusterRelations(clusterType) {
        G_clusterRelations = clusterType;
        //updateNodeList(getNodeList());
        displayTerms(G_nodelist);
    }

    function getUserInput(type, dataObject) {
        console.log('getting user input....');
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
        $("#inputDialog").show();
    }

    function createRelation(relname, nodes) {
        console.log(relname)
        if (relname !== null && relname.length > 1) {
            var relation = {
                name: relname,
                subject: nodes.mousedown_node.id,
                object: nodes.mouseup_node.id,
            };
            getData.saveRelation(G_modelId, relation, showIt);

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
              getData.saveTerm(G_modelId, { name: name, description: description }, showIt);
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
        getData.deleteTerm(G_modelId, { id: term.id }, showIt);

        function showIt(term) {
            G_data.terms = $.grep(G_data.terms, function(d) { return d.id != term.id; });
            G_data.relations = $.grep(G_data.relations, function(d) { return (d.object != term.id) && (d.subject != term.id); });
            G_graph = getGraph(G_data.terms, G_data.relations);
            updateGraph();
        }
    }

    function deleteRelation(relation) {
        getData.deleteRelation(G_modelId, { id: relation.orgId }, showIt);

        function showIt(relation) {
            G_data.relations = $.grep(G_data.relations, function(d) { return d.id != relation.id; });
            G_graph = getGraph(G_data.terms, G_data.relations);
            updateGraph();
        }
    }

    function changeTerm(name, description, oldTerm) {
        if (name === null) return;
        if (name.length) {
             getData.updateTerm(G_modelId, { name: name, id: oldTerm.id, description: description }, showIt);
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
            getData.updateRelation(G_modelId, { name: name, id: relation.id, subject: relation.subject, object: relation.object }, showIt);
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
        getUserInput(DIALOG.newTerm, { id: 0, term_name: "", term_definition:  " " });
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
        console.log('mouse up');
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
        setAllNodesLock(true);
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
        console.log("1")
        if (!G_editMode) return;
        console.log("2")
        G_editLinkParms.mouseup_node = $.grep(G_graph.nodes, function(d) { return d.id === node.id; })[0];
        if (G_editLinkParms.mouseup_node === G_editLinkParms.mousedown_node) { resetMouseVars(); return; }
        console.log("3")
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

    $(document).on('click', "#btn_closeInputDialog", function(e) {
        $("#inputDialog").hide();
    });



    $(document).off('click', "#btn_newTerm");
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
        $('#inputDialog').hide();
    });
    $(document).off('click', "#btn_deleteTerm");
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
        $('#inputDialog').hide();
    });
    $(document).off('click', ".cancelDialog");
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
        NODECLUSTER: NODECLUSTER,
        setAutoFixOfNodes,
        setAllNodesLock,
        setShowLocks,
        setClusterRelations,
        showModel,
        loadLayout,
        showTerms,
        saveLayout,
        setEditMode,
        isDirty
    };
};
exports.Mgraph=Mgraph;