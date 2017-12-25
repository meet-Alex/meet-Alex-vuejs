<template>

  <div id="MContainer" class='content'>
    <div id="inputDialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header header-xs">
                   
                    <h4 class="modal-title" id='inputDialog_title'></h4>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="dataField">
                    <input type="text" placeholder="Enter name..." id="nameField">
                    <div id="descriptionField">
                        <!--<div ui-tinymce="tinymceOptions" class="editDescription" ng-model="inputObject.description"></div> -->
                        <tinymce id="descriptionEditor" v-model="editTerm.term_definition" :options="tinymceOptions" @change="changed"></tinymce>
                    </div>
                    <!--
                    <textarea id="descriptionField" placeholder="Enter description..."></textarea>
                    -->
                </div>
                <div class="modal-footer header-xs">
                    <button type="button" id='btn_newTerm' class="btn btn-info btn-xs" data-dismiss="modal">Create</button>
                    <button type="button" id='btn_deleteTerm' class="btn btn-danger btn-xs" data-dismiss="modal">Delete</button>
                    <button type="button" id='btn_closeInputDialog' class="btn btn-xs cancelDialog" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
   <fullscreen ref="fullscreen" :fullscreen.sync="fullscreen" :background="'#ffffff'">
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
        <button type="button" @click="toggle" >Fullscreen</button>
      </b-navbar-nav>
    </b-navbar>
      <div id="Mgraph">
          <!-- <img style="top:40%;" id="alexlogo" height="42" width="42" src={{ URL::asset( "img/spinner.gif") }}></img> -->
      </div>
   </fullscreen> 
  </div>
</template>

<script>

const d3 = require("./visual/libs/d3.min");
const $ = require("./visual/libs/jquery-2.1.1.min");
d3.fisheye = require("./visual/libs/fisheye").fisheye;
var getData = require("./visual/getData").getData($);
var Mgraph = require("./visual/graph").Mgraph(d3, $, getData);

import globalData from "../global_data";
import vuex from "vuex";
console.log(globalData, vuex);
var Fullscreen1 = false;

function changedZoom(event, zoomLevel) {
  /*	$("#zoomSlide").bootstrapSlider('setValue', zoomLevel);*/
}

$(window).resize(function() {
  //	$('#content').height($(window).height() - 46);
 
  sizeDivs();
});

function sizeDivs() {
 
  $("#Mgraph").height($(window).height() - $("#Mmenu").height() - 20);
  if (Fullscreen1) {
    $("#Mgraph").width($(window).width());
  } else {
    $("#Mgraph").width($("#MContainer").width());
  }
  $("#Mgraph").css("marginTop", "5px");
}

window.onbeforeunload = function() {
  console.log("saving layout");
  //@todo
  //Mgraph.saveLayout(collection_id, "name8");
  // debugger;
};

import Fullscreen from "vue-fullscreen/src/component.vue";
import Vue from "vue";

import { mapState, mapMutations } from "vuex";
import axios from '../backend/vue-axios';
export default {
  components: { Fullscreen },
  name: "visual",
  props: {
    id: {
      type: String,
      required: true
    },

    collectionId: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      fullscreen: false,
      content: "",
      autoFixSet: true,
      showLocksSet: false,
      relationClusterSet: Mgraph.NODECLUSTER.none,
      Mgraph: Mgraph,
      editTerm: { id: 0, term_name: "", term_definition: "---" },
      tinymceOptions: {
        inline: false,
        plugins:
          "advlist autolink link image lists charmap print preview paste",
        skin: "lightgray",
        menubar: false,
        toolbar: "undo redo | bold italic underline",
        statusbar: false,
        branding: false,
        theme: "modern",
        paste_as_text: true,
        content_css: "css/app_mce.css",
        height:"100px",
        mode: "textareas",
        force_br_newlines: false,
        force_p_newlines: false,
        forced_root_block: ""
      }
    }
  },
  methods: {
     ...mapMutations(["fetchTerm", "clearTermList", "fetchVisual", "fetchCollection"]),
    toggle: function() {
      this.$refs["fullscreen"].toggle();
      Fullscreen1 = !this.fullscreen;
      this.fullscreen = !this.fullscreen;
      sizeDivs();
    },
    changed : function(){
      console.log(' changed');
    },
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
  watch: {
    value: function(val) {
      Mgraph.setEditMode(val);
    }
  },
  created() {},
  computed: {
    ...mapState(["userinfo"])
  },
  mounted() {
    Fullscreen1 = this.fullscreen;
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
    }, Vue);
    getData.setToken(this.userinfo.token);

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
    Mgraph.setEditMode(this.value);
  },
  beforeDestroy() {
      // need to refetch the collection to update the store with the visual changes, and save layout of visual
      if (Mgraph.isDirty()) {
        console.log('refetch collection');
         this.fetchCollection(this.collectionId);
      }
      Mgraph.saveLayout(this.collectionId, "name8");
  }
};
</script>

<style scoped>
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

.content {
  padding-top: 0.5rem;
}
#descriptionField {
  
}

#descriptionEditor {
    border: 1px solid lightgrey;
    border-radius: 3px;
    padding: 5px 10px;
    font-size: 14px;
    background-color: white;
}
</style>