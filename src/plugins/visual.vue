<template>
  <div v-bind:id="'MContainer'+ id" class='visual'>


  <fullscreen ref="fullscreen" :fullscreen.sync="fullscreen" :background="'#ffffff'" class=""> 
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
        <button class="nobutton" @click="toggle" >
          <i v-if="!fullscreen" class="fa fa-expand white" aria-hidden="true" title="Fullscreen"></i>
          <i v-if="fullscreen" class="fa fa-compress white" aria-hidden="true" title="Exit fullscreen"></i>
        </button>
      </b-navbar-nav>
    </b-navbar>
      <div v-bind:id="'Mgraph'+id" class="svg-container">
      </div>
          <div v-if="editTerm" id="inputDialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header header-xs">
                    <h4 class="modal-title" id='inputDialog_title'></h4>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="dataField">
                    <input type="text" placeholder="Enter name..." id="nameField">
                    <div id="descriptionField">
                        <tinymce id="descriptionEditor" v-model="editTerm.term_definition" :options="tinymceOptions" @change="changed"></tinymce>
                    </div>
                </div>
                <div class="modal-footer header-xs">
                    <button type="button" id='btn_newTerm' class="btn btn-info btn-xs" data-dismiss="modal">Create</button>
                    <button type="button" id='btn_deleteTerm' class="btn btn-danger btn-xs" data-dismiss="modal">Delete</button>
                    <button type="button" id='btn_closeInputDialog' class="btn btn-xs cancelDialog" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <!-- the fullscreen removes all divs, so re-add them to show loading and messages -->
    <show-loader v-if="fullscreen" /></show-loader>
    <notifications v-if="fullscreen" group="foo" />
  </fullscreen>
  </div>
</template>

<script>

const d3 = require("./visual/libs/d3.min");
const $ = require("./visual/libs/jquery-2.1.1.min");
d3.fisheye = require("./visual/libs/fisheye").fisheye;
var getData = require("./visual/getData").getData();
var Mgraph = require("./visual/graph").Mgraph(d3, $, getData);

import globalData from "../global_data";
import vuex from "vuex";
  import Loader from '../plugins/Loader.vue';


function changedZoom(event, zoomLevel) {
  /*	$("#zoomSlide").bootstrapSlider('setValue', zoomLevel);*/
}

$(window).resize(function() {
  //	$('#content').height($(window).height() - 46);
 
 // sizeDivs();
});



import Fullscreen from "vue-fullscreen/src/component.vue"
import Vue from "vue";



import { mapState } from "vuex";
import axios from '../backend/vue-axios';
export default {
  components: { Fullscreen ,showLoader: Loader},
  name: "visual",
  props: {
    id: {
      type: Number,
      required: true
    },
    collectionId: {
      type: String,
      required: false
    },
    termId: {
      type: Number,
      required: false
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
      editTerm: { id: 0, term_name: "", term_definition:  " " },
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
    toggle: function() {
        
    this.$refs['fullscreen'].toggle()
      //this.sizeDivs();
    },
    fullscreenChange: function(fullscreen) {
       this.fullscreen =fullscreen
       console.log(fullscreen)
    },
    sizeDivs: function() {
      var Mgraph=$("#Mgraph"+this.id);
      //this.fullscreen = !this.fullscreen
    
      // this.$nextTick(function () {
     //       var height=this.fullscreen?screen.height:$("#MContainer"+this.id).height();
      //      Mgraph.height(height - 38);
      //      Mgraph.width($(parentContainer).width());
     //   })
     // Mgraph.height(height - 38);
    //  Mgraph.width($(parentContainer).width());
  
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
      console.log("relation clustering")
      Mgraph.setClusterRelations(clusterType);
      this.relationClusterSet = clusterType;
    }
  },
  watch: {
    value: function(val) {
      Mgraph.setEditMode(val);
    },
    fullscreen: function(fs) {
      
      var height=$(document).height()-56;
      var widthapp=$("#app").width();
      var widthcontainer=$(".visual").width();
      console.log('fs', fs, height, widthapp, widthcontainer )
      var Mgraph1=$("#Mgraph"+this.id);
      if (fs) {
        Mgraph1.height(height)
        Mgraph1.width(widthapp)
        }
      else {
        Mgraph1.height(500)
       // .width(widthcontainer)
        Mgraph1.css('width', '100%');
        }
      Mgraph.setsize()
    }
  },
  created() {},
  computed: {
    ...mapState(["userinfo"])
  },
  mounted() {
    this.sizeDivs();
    var term_id = this.termId;
    var collection_id = this.collectionId;
    getData.init(Vue, this);
    getData.setToken(this.userinfo.token);

    // initialise the visualisation, and define the callback functions
    Mgraph.initGraph({
      id: this.id
    });
    this.autoFix(this.autoFixSet);
    this.showLocks(this.showLockOn);
    this.relationClustering(this.relationClusterSet);
    Mgraph.setEditMode(this.value);
    // do we want to see a complete collection, or only a term?
    $(".spinner").hide();
    if (typeof collection_id !== "undefined") {
      Mgraph.showModel(collection_id);
    //  Mgraph.loadLayout(collection_id, "name8");
    } else {
      console.log('term selected')
      Mgraph.showTerms([term_id]);
    }

    //Initial configuration

   
  },
  beforeDestroy() {
      // need to refetch the collection to update the store with the visual changes, and save layout of visual
      if (Mgraph.isDirty()) {
           this.$store.dispatch("FETCH_COLLECTION",this.collectionId )
           Mgraph.saveLayout(this.collectionId, "name8")
      }
      
  }
};
</script>

<style scoped>
@import "/src/plugins/visual/css/app.css";

.visual {
  
}

#descriptionField {
}
.fullscreen_container {
  width:100%;
  height: 100%;
}
.white {
  color: white;
}
.nobutton {
  background: none;
  border: 1px white solid;
}
.nobutton :active {
  border: 1px white solid;
}

#descriptionEditor {
  border: 1px solid lightgrey;
  border-radius: 3px;
  padding: 5px 10px;
  font-size: 14px;
  background-color: white;
}
.svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    clear: both;
    height: 100%;
    height: 500px;
    /*padding-bottom: 60px; /* aspect ratio */
    vertical-align: top;
    /*overflow: hidden;*/
  
  
}
.svg-content-responsive {
    display: inline-block;
    position: absolute;
    top: 0px;
    left: 0;
}
</style>