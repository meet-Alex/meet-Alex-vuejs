 (function() {
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
