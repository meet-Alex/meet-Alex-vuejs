<template>
  <div id="MContainer">
    <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-nav class="ml-auto">
        <b-nav>
            <b-nav-item-dropdown text="Positions" left title='behavior of positioning'>
                <b-dropdown-item v-on:click="setLock(true)">Lock postitions</b-dropdown-item>
                <b-dropdown-item v-on:click="setLock(false)">Unlock positions</b-dropdown-item>
                <b-dropdown-item v-if="!autoFixSet" v-on:click="autoFix(true)">Auto fix ON</b-dropdown-item>
                <b-dropdown-item v-if="autoFixSet" v-on:click="autoFix(false)">Auto fix OFF</b-dropdown-item>
                <b-dropdown-item v-if="!showLocksSet" v-on:click="showLocks(true)">Show locks</b-dropdown-item>
                <b-dropdown-item v-if="showLocksSet" v-on:click="showLocks(false)">Hide locks</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Lay-out" left title='layout options'>
                <b-dropdown-item v-if="relationClusterSet!==Mgraph.NODECLUSTER.in" v-on:click="relationClustering(Mgraph.NODECLUSTER.in)">Cluster incoming</b-dropdown-item>
                <b-dropdown-item v-if="relationClusterSet!==Mgraph.NODECLUSTER.out" v-on:click="relationClustering(Mgraph.NODECLUSTER.out)">Cluster outgoing</b-dropdown-item>
                <b-dropdown-item v-if="relationClusterSet!==Mgraph.NODECLUSTER.none" v-on:click="relationClustering(Mgraph.NODECLUSTER.none)">No Clustering</b-dropdown-item>
            </b-nav-item-dropdown>
        </b-nav>
      </b-navbar-nav>
    </b-navbar>
      <div id="Mgraph">
          <!-- <img style="top:40%;" id="alexlogo" height="42" width="42" src={{ URL::asset( "img/spinner.gif") }}></img> -->
      </div>
  </div>
</template>

<script>
    const d3 = require("./visual/libs/d3.v4");
    const $ = require("./visual/libs/jquery-2.1.1.min");
    d3.fisheye = require("./visual/libs/fisheye").fisheye;
    var getData = require("./visual/getData").getData($);
    var Mgraph = require("./visual/graph").Mgraph(d3, $, getData);
    import globalData from '../global_data';
    console.log(globalData);

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

    window.onbeforeunload = function() {
      console.log("saving layout");
      Mgraph.saveLayout(collection_id, "name8");
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
          content: "",
          autoFixSet: true,
          showLocksSet: false,
          relationClusterSet: Mgraph.NODECLUSTER.none,
          Mgraph: Mgraph
        };
      },
      methods: {
        setLock: function(setLockOn) {
          Mgraph.setAllNodesLock(setLockOn);
        },
        autoFix: function(autoFixOn) {
          Mgraph.setAutoFixOfNodes(autoFixOn);
          this.autoFixSet = autoFixOn;
        },
        showLocks: function(showLockOn) {
          Mgraph.setShowLocks(showLockOn);
          this.showLocksSet = showLockOn;
        },
        relationClustering: function(clusterType) {
          Mgraph.setClusterRelations(clusterType);
          this.relationClusterSet = clusterType;
        }
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

      //  $.subscribe("/graph/event/changedZoom", changedZoom);

       // var url = " http://localhost/meet-Alex/public/index.php";
        var term_id = null;
        var collection_id = this.collectionId;

        getData.init({
          remote: true, // true=remote (fill remoteURL), false=local
          remoteURL: globalData.apiURL
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

        // do we want to see a complete collection, or only a term?
        $(".spinner").hide();
        if (typeof collection_id !== "undefined") {
          Mgraph.showModel(collection_id);
          Mgraph.loadLayout(collection_id, "name8");
        } else {
          Mgraph.showTerms([term_id]);
        }

        //Initial configuration

        this.autoFix(this.autoFixSet);
        this.showLocks(this.showLockOn);
        this.relationClustering(this.relationClusterSet);
        Mgraph.setEditMode(false);
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