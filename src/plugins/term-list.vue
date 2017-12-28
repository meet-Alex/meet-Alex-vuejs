<template>
    <div class="content">
        <tablemenu v-model="termMenu" :showSortAuth='false' :showMenu="true" />
        <div class='tableContent' ref='tabcontent'>
            
            <table v-if="termMenu.viewType!==globalData.VIEWTYPE.INDEX" class="table termtable">
                <tbody>
                    <tr>
                        <td class="name bold">Term name</td>
                        <td class="def bold">Term description</td>
                        <td></td>
                    </tr>
                    <tr v-if="value&&editTermId!==0">
                        <td>
                            <b-button v-on:click="editTermId=0" variant="default" size="sm">New term</b-button>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr v-if="value&&editTermId===0">
                        <td colspan="3">
                            <editTermList :editTerm="newTerm" :termList="collection.terms" @addTerm="addTerm"></editTermList>
                        </td>
                    </tr>
                    <tr class="" v-for="term in filteredList" v-on:click="editTermId=value?term.id:0">
                        <td v-if="!value" v-bind:class="{compact:termMenu.viewType===globalData.VIEWTYPE.COMPACT, name:1}">
                            <router-link :to="{ name: 'termDetail', params: { id: term.id } }" v-html="$options.filters.highlight(term.term_name, termMenu.filter)"></router-link>
                        </td>
                        <td v-if="value && editTermId != term.id" v-bind:class="{compact:termMenu.viewType===globalData.VIEWTYPE.COMPACT, name:1}" v-html="$options.filters.highlight(term.term_name, termMenu.filter)">
                        </td>
                        <td v-if="editTermId != term.id" v-bind:class="{compact:termMenu.viewType===globalData.VIEWTYPE.COMPACT, def:1}" v-html="$options.filters.highlight(term.term_definition, termMenu.filter)">
                        </td>
                        <td colspan="2" v-if="editTermId == term.id && value">
                            <editTermList :editTerm="term" :termList="collection.terms" @changedTerm="changeTerm"></editTermList>
                        </td>
                        <td>
                            <a v-if=" value" href="#" class='iconbutton' v-on:click="removeTerm(term, $event)">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <tableindex v-if="termMenu.viewType===globalData.VIEWTYPE.INDEX && collection.terms.length" :displayName="'term_name'" :routerName="'termDetail'" :inputArray="collection.terms" />
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import globalData from '../global_data';
import { mapGetters, mapState, mapMutations } from 'vuex';
import tablemenu from './tablemenu.vue';
import tableindex from './tableindex.vue';

export default {
    name: "termList",
     components: { tablemenu, tableindex },

    data() {
        return {
             globalData: globalData,
                editTermId: 0,
                 newTerm: { id: 0, term_name: "", term_definition: "" },
             termMenu: { filter: "", viewType: globalData.VIEWTYPE.FULL, sortType: globalData.SORTTYPE.NAME },
        }
    },
    props: {
        value : {type: Boolean, required: true}
    },
    created: function() {
       
    },
    methods: {
        ...mapMutations(["addTerm", "changeTerm", "removeTerm"]),
        tinyMCE_Changed : function() {
        },
           
       
       
    },
       computed: {
          ...mapState(["collection"]),
          filteredList: function() {
            if (!this.collection.terms) return null;
            var self = this;
            var result = this.collection.terms.filter(
                function(term) {
                    return (term.term_name.toLowerCase().indexOf(self.termMenu.filter.toLowerCase()) >= 0) ||
                        (term.term_definition && term.term_definition.toLowerCase().indexOf(self.termMenu.filter.toLowerCase()) >= 0)
                });
          
            return result.sort((a, b) =>  (this.termMenu.sortType === globalData.SORTTYPE.CREATED) ? a.created_at.localeCompare(b.created_at) : (this.termMenu.sortType === globalData.SORTTYPE.UPDATED) ? a.updated_at.localeCompare(b.updated_at) : a.term_name.localeCompare(b.term_name));
        },
       }
}
</script>

<style scoped>
 .content {padding-top:0.5rem}

</style>