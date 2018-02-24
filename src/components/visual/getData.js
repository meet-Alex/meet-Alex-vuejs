var getData = function () {
    var G_termList = [];
    var G_relList = [];
   
    var Vue;
    var That;

    function init(vue, that) {
        That = that;
        Vue = vue;
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
        nodes.forEach (function ( node) {
            termArray.push(createTerm1(node));
        });
        return termArray;
    }

    function createRelations(links) {
        var relationArray = [];
        links.forEach(function (link) {
            relationArray.push(createRelation(link));
        });
        return relationArray;
    }

    function getModelId(modelId, callback) {
        That.$store.commit("isLoading", true);
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
     
        //@todo: all terms are refetched, actually only the new term is needed to be fetched.

        if (toFetchIds.length) {
            That.$store.commit("isLoading", true);
            var promises=[];
            toFetchIds.map(function(term) {
                 promises.push( Vue.axios.get('visualise?withIds='+term + '&getUnfetchedRelations=1&levelsDeep=2'))
             });
             Promise.all(promises).then(values=> {
                 values.map(function(item) {
                    processArray(item.data)
                 })
                 That.$store.commit("isLoading", false);
                 callback({ terms: G_termList, relations: G_relList })
             })
             .catch(error => {console.log(error); That.$store.commit("isLoading", false);})

        } else {
            callback({ terms: G_termList, relations: G_relList });
        }
    }

    function processArray(graph) {
        graph.nodes.forEach(function (node) {
           // if ($.grep(G_termList, function (e) { return e.id == node.id; }).length === 0) {
              if (G_termList.findIndex(x => x.id === node.id) <0) {
                G_termList.push(createTerm1(node));
            }
        });

        graph.links.forEach(function (link) {
          //  if ($.grep(G_relList, function (e) { return e.name == link.name && e.subject == link.source && e.object == link.target; }).length === 0) {
                if (G_relList.findIndex(x => x.name === link.name && e.subject==link.source && e.object==link.target) <0) {  
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
          console.log(error);
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
        deleteRelation(null, relation, createNew);
        function createNew(relation) {
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
     //   $(document).ready(function () {
            That.$store.commit("isLoading", true);
            Vue.axios.get("collections/" +collection_id + "/sketches",)
            .then(response => {
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
      //  });
    }

    function deleteSketches(collection_id) {
        //@todo create axios call for this
        /*
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
        */
    }

    function saveSketch(collection_id, sketch_name, graph) {
    
        var positions=extractNodePositions(graph);
        var newgraph={G_clusterRelations:graph.G_clusterRelations, G_termid:graph.G_termid, G_nodelist:graph.G_nodelist, nodePositions:positions};
        Vue.axios.post("sketches", {
            "collection_id": parseInt(collection_id),
            "sketch_name": "name8",
            "sketch_data": JSON.stringify(newgraph),
          })
            .then(response => {
            })
            .catch(error => {
              console.log(error.response);
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
    };
};
exports.getData = getData;
