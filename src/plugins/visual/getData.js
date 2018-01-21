var getData = function ($) {
    var G_termList = [];
    var G_relList = [];
    var G_parms;
    var G_token;
    var Vue;
    var That;

    function init(parms, vue, that) {
        That = that;
        Vue = vue;
        G_parms = parms;
        console.log(G_parms);
        if (!G_parms.remote) {
            $.each(DATA_term, function (i, term) {
                var def = $.grep(DATA_def, function (e) { return e.id == term.id; })[0];
                G_termList.push({
                    id: term.id,
                    name: term.name,
                    description: def.description,
                    addinfo: def.addinfo
                });
            });
            $.each(DATA_relation, function (i, relation) {
                G_relList.push({
                    name: relation.relation,
                    subject: relation.subject,
                    object: relation.object
                });
            });
        }
    }
    function setToken(token) {
      
        G_token=token;
    }

    function createRelation(link) {
        return {
            name: link.link_name,
            subject: link.source,
            object: link.target,
            id: link.id
        };
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
        $.each(nodes, function (i, node) {
            termArray.push(createTerm1(node));
        });
        return termArray;
    }

    function createRelations(links) {
        var relationArray = [];
        $.each(links, function (i, link) {
            relationArray.push(createRelation(link));
        });
        return relationArray;
    }

    function getModelId(modelId, callback) {
        That.$store.commit("isLoading", true);
        console.log('isloading')
        Vue.axios.get('visualise?getCollection=' + modelId)
        .then(graph => {
            var terms = createTerms(graph.data.nodes);
            var relations = createRelations(graph.data.links);
            That.$store.commit("isLoading", false);
           
            callback({ terms: terms, relations: relations });
        })
        .catch(error => {
            console.log(error.response, error);
            alert(error.response.data.message);
        });
    }
    /**
     * Fetches the term object which has the termId, and calls the callback function
     *
     * @param {Object} event
     * @param {string} id
     * @param {function} callback
     */

    function getTermId(termId, callback) {
            Vue.axios.get('terms/'+termId)
            .then(graph => {
                var term1 = createTerm(graph);
                callback(term1);
            })
            .catch(error => {
                console.log(error.response, error);
                alert(error.response.data.message);
            });
    }

    function fetchAllTerms(toFetchIds, callback) {
        if (toFetchIds.length) {
            fetchTerm(toFetchIds, fetchAllTerms, callback);
        } else {
            callback({ terms: G_termList, relations: G_relList });
        }
    }

    function processArray(graph) {
        $.each(graph.nodes, function (i, node) {
            if ($.grep(G_termList, function (e) { return e.id == node.id; }).length === 0) {
                G_termList.push(createTerm1(node));
            }
        });

        $.each(graph.links, function (i, link) {
            if ($.grep(G_relList, function (e) { return e.name == link.name && e.subject == link.source && e.object == link.target; }).length === 0) {
                G_relList.push(createRelation(link));
            }
        });
    }
    function saveRelation(collection_id, relation, callback) {
        Vue.axios.post("ontologies", {
            "collection_id": Number(collection_id),
            "object_id": relation.object,
            "relation_name": relation.name,
            "subject_id": relation.subject,
        })
        .then(response => {
            var rel = {
                "name": relation.name,
                "object": relation.object,
                "relation_id": response.data.id, //relation.name
                "subject": relation.subject,
                "status_id": 1
            };
            callback(rel);
        })
        .catch(error => {
            console.log(error);
            if (error.status == 201) {  // somehow 201 is reported as error, but it is ok
                state.collection_relationList.push({ subject: newRelation.subject, name: newRelation.name, object: newRelation.object, id: response.data.id });
            } else {
                alert(error.response.data.message);
            }
        });
    }

    function deleteTerm(collection_id, term, callback) {
        Vue.axios.delete("terms/" + term.id)
        .then(response => {
            callback(term);
        })
        .catch(error => {
          console.log(error.response);
          alert(error.response.data.message);
        });
    }

    function deleteRelation(collection_id, relation, callback) {
        Vue.axios.delete("ontologies/" + relation.id)
        .then(response => {
            callback(relation);
        })
        .catch(error => {
          console.log(error.response);
          alert(error.response.data.message);
        });
    }

    function updateTerm(collection_id, term, callback) {
        Vue.axios.put("terms/" + term.id, {
        "collection_id": parseInt(collection_id),
        "term_name": term.name,
        "term_definition": term.description
        })
        .then(response => { 
            console.log(response);
            var term = {
                name: response.data.term_name,
                description: response.data.term_definition,
                collection_id: response.data.collection_id,
                id: response.data.id
            };
            callback(term);
        })
        .catch(error => {
            console.log(error.response, error);
            alert(error.response.data.message);
        });
    }

    function updateRelation(collection_id, relation, callback) {
        console.log(relation);
        deleteRelation(null, relation, createNew);

        function createNew(relation) {
            console.log('createnew', relation);
            saveRelation(collection_id[0], relation, callback);
        }
    }

    function saveTerm(collection_id, term, callback) {
        Vue.axios.post("terms", {
            "collection_id": parseInt(collection_id),
            "term_name": term.name,
            "term_definition": term.description,
        })
          .then(response => {
            console.log(response);
            var term = {
                id: response.data.id,
                name: response.data.term_name,
                description: response.data.term_definition,
                addinfo: "",
                collection_id: parseInt(response.data.collection_id),
                collection_name: response.data.collection_name
            };
            callback(term);
          })
          .catch(error => {
            console.log(error.response);
          });
    }
    function getSketches(collection_id, callback) {
        $(document).ready(function () {
            That.$store.commit("isLoading", true);
            Vue.axios.get("collections/" +collection_id + "/sketches",)
            .then(response => {
             console.log(response);
             var retVal = null;
             That.$store.commit("isLoading", false);
             if (response.data.sketch_data && response.data.sketch_data[0] === '{') {
                 try {
                     retVal = JSON.parse(response.data.sketch_data);
                 } catch (e) {
                     // alert(e); // error in the above string (in this case, yes)!
                 }
             }
             callback(retVal);
            })
            .catch(error => {
              console.log(error.response, error);
             
              That.$store.commit("isLoading", false);
            });
        });
    }

    function deleteSketches(collection_id) {
        var token = $('meta[name="_token"]').attr('content');
        var url = G_parms.remoteURL;
        console.log(url + "/sketches/" + parseInt(collection_id));
        $.ajax({
            type: "DELETE",
            url: url + "/sketches/" + parseInt(collection_id),
            data: {
                _token: token
            },
            success: function (json) {
              
            },
            failure: function (errMsg) {
                console.log(errMsg);
            }
        });
    }

    function saveSketch(collection_id, sketch_name, graph) {
    
        var positions=extractNodePositions(graph);
        var newgraph={G_clusterRelations:graph.G_clusterRelations, G_termid:graph.G_termid, G_nodelist:graph.G_nodelist, nodePositions:positions};
        console.log(newgraph);
        Vue.axios.post("sketches", {
            "collection_id": parseInt(collection_id),
            "sketch_name": "name8",
            "sketch_data": JSON.stringify(newgraph),
          })
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.log(error.response);
              alert(error.response.data.message);
            });
    }
    function extractNodePositions(graph) {
        var positions=[];
        graph.G_graph.nodes.map(function(node) {
            if (node.fixed && node.relationCount) {
            positions.push({id:node.id, x:node.fx, y:node.fy});
        
            }
        });
        return(positions);
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
            $.getJSON(query, function (graph) {
                console.log(graph);
                processArray(graph);
                callback(null, termIdArray, orgcallback);
            })
                .fail(function (jqxhr) {
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
    function findReference(termId, callback) {
        var refTermList = [];
        var pref_ref = "00000";
        var i, description, x, y, link, a, link_id, link_name, termId1, termName1;

        // search all descriptions
     
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
            function (a, b) {
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
        init: init,
        getModelId,
        saveRelation,
        saveTerm,
        deleteTerm,
        deleteRelation,
        updateTerm,
        updateRelation,
        getSketches,
        deleteSketches,
        saveSketch,
        fetchAllTerms,
        findReference,
        getTermId,
      //  loadSketch,
        setToken
    };
};
exports.getData = getData;
