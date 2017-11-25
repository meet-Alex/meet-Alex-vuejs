<template>
    <div class='content' >
        <tablemenu v-model="relationMenu" :showSortAuth='false' :showMenu="false" />
        <div class='tableContent' ref='tabcontent'>
            <table class="table relationtable">
                <tbody>
                    <tr>
                        <td v-for="column in ['Subject', 'Relation', 'Object']">
                            <a href="#" v-on:click="sortBy(column)">{{column}}</a>
                            <i v-if="column===relationTableSort.column&&relationTableSort.order===1" class="fa fa-sort-desc"></i>
                            <i v-if="column===relationTableSort.column&&relationTableSort.order===-1" class="fa fa-sort-asc"></i>
                            <i v-if="column!==relationTableSort.column" class="fa fa-sort unactive"></i>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr v-if="value&&editRelationId!==0">
                        <td>
                            <b-button v-on:click="editRelationId=0" variant="default" size="sm">New Relation</b-button>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr v-if="value&&editRelationId===0">
                        <td ref='newRelFocus'>
                            <autocomplete :new="true" :suggestions="collection.terms" v-model="newRelation.subject" :displayName="newRelation.subject.term_name"></autocomplete>
                        </td>
                        <td>
                            <input class="form-control lightblue" type="text" v-model="newRelation.name">
                        </td>
                        <td>
                            <autocomplete :new="true" :suggestions="collection.terms" v-model="newRelation.object" :displayName="newRelation.object.term_name"></autocomplete>
                        </td>
                        <td></td>
                    </tr>
                    <tr v-if="!value" class="" v-for="relation in filteredRelationList">
                        <td>
                            <router-link :to="{ name: 'termDetail', params: { id: relation.subject.id } }" v-html="$options.filters.highlight(relation.subject.term_name, relationMenu.filter)"></router-link>
                        </td>
                        <td v-html="$options.filters.highlight(relation.name, relationMenu.filter)">
                        </td>
                        <td>
                            <router-link :to="{ name: 'termDetail', params: { id: relation.object.id } }" v-html="$options.filters.highlight(relation.object.term_name, relationMenu.filter)"></router-link>
                        </td>
                        <td></td>
                    </tr>
                    <tr v-if="value" v-on:click="clickTest(relation.id)" v-for="(relation, index) in filteredRelationList">
                        <td v-if="relation.id!==editRelationId">
                            {{relation.subject.term_name}}
                        </td>
                        <td v-if="relation.id===editRelationId">
                            <autocomplete :new="false" :suggestions="collection.terms" v-model="relation.subject" :displayName="relation.subject.term_name"></autocomplete>
                        </td>

                        <td v-if="relation.id!==editRelationId">
                            {{relation.name}}
                        </td>
                        <td v-if="relation.id===editRelationId">
                            <input class="form-control lightblue" type="text" v-model="relation.name">
                        </td>

                        <td v-if="relation.id!==editRelationId">
                            {{relation.object.term_name}}
                        </td>
                        <td v-if="relation.id===editRelationId">
                            <autocomplete :new="false" :suggestions="collection.terms" v-model="relation.object" :displayName="relation.object.term_name"></autocomplete>
                        </td>

                        <td>
                            <a v-if="relation.id===editRelationId" href="#" class='iconbutton' v-on:click="removeRelation(relation.id, $event)">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <a href="#"></a>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import globalData from "../global_data";
import { mapGetters, mapState, mapMutations } from "vuex";
import tablemenu from "./tablemenu.vue";

export default {
  name: "relationList",
  components: { tablemenu },

  data() {
    return {
      globalData: globalData,
      editTermId: 0,
      editRelationId: 0,
      newRelation: {
        subject: { term_name: "" },
        name: "",
        object: { term_name: "" },
        id: 0
      },
      relationMenu: {
        filter: "",
        viewType: globalData.VIEWTYPE.FULL,
        sortType: globalData.SORTTYPE.NAME
      },
      relationList: [],
      relationTableSort: {
        column: "Subject",
        o1: "subject",
        o2: "term_name",
        order: 1
      }
    };
  },
  props: {
    value: { type: Boolean, required: true }
  },
  created: function() {
      var that=this;
      this.$root.$on('addRelation', function() {
            if (that.newRelation.subject.term_name.length &&
                that.newRelation.subject.term_name.length &&
                that.newRelation.name.length) {
                console.log('add it now!!');
                that.relationList.push({ subject: that.newRelation.subject, name: that.newRelation.name, object: that.newRelation.object, id: that.generateId() });
                that.newRelation = { subject: { term_name: "" }, name: "", object: { term_name: "" }, id: 0 };

                // reset new input field; and set focus on input field in the first cell
                that.editRelationId = -1;
                that.$nextTick(function() {
                    that.editRelationId = 0;
                    that.$nextTick(function() {
                        that.$refs.newRelFocus.children[0].children[0].focus();
                    });
                });
            }
        });
  },
  methods: {
   removeRelation: function(id, event) {
            this.relationList = this.relationList.filter(function(relation) {
                return relation.id != id;
            });
            if (event) event.stopPropagation();
        },
        generateId: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        clickTest: function(relationId) {
            console.log("clicked", relationId);
            this.editRelationId = relationId;
        },
        sortBy: function(column) {
            this.relationTableSort.order = (this.relationTableSort.column === column) ? this.relationTableSort.order * -1 : 1;
            this.relationTableSort.column = column;
            this.relationTableSort.o1 = (column == "Object") ? "object" : (column == "Subject") ? "subject" : "relation";
            this.relationTableSort.o2 = (column == "Object") ? "term_name" : (column == "Subject") ? "term_name" : "name";
        }
  },
  computed: {
    ...mapState(["collection"]),
    filteredRelationList: function() {
        if (!this.collection.relationList||!this.collection.relationList.length) return null;
        var self = this;
        var result = this.collection.relationList.filter(
            function(relation) {
                return (relation.subject.term_name.toLowerCase().indexOf(self.relationMenu.filter.toLowerCase()) >= 0) ||
                    (relation.object.term_name.toLowerCase().indexOf(self.relationMenu.filter.toLowerCase()) >= 0) ||
                    (relation.name.toLowerCase().indexOf(self.relationMenu.filter.toLowerCase()) >= 0)

            });
        if (this.relationTableSort.o1 !== 'relation') {
            return result.sort((a, b) => this.relationTableSort.order * a[this.relationTableSort.o1][this.relationTableSort.o2].localeCompare(b[this.relationTableSort.o1][this.relationTableSort.o2]));
        } else {
            return result.sort((a, b) => this.relationTableSort.order * a[this.relationTableSort.o2].localeCompare(b[this.relationTableSort.o2]));

        }
    }
  }
};
</script>

<style scoped>
 .content {padding-top:0.5rem}

</style>