<template>
    <div class="container flex">
        <br>
        <b-breadcrumb :items="breadCrum" />
        <!-- Collection title and action menu -->

        <table style="width: 100%;">
            <tr>
                <td class="compact title-header">
                    Collection: {{collection.collection_name}}
                </td>
                <td align="right">

                    <b-nav class="float-right">

                        <b-form-checkbox v-model="editMode">
                            Edit
                        </b-form-checkbox>

                        <b-nav-item-dropdown :disabled="$route.params.id==='new'" text="Actions" right title='Actions for this collection'>
                            <b-dropdown-item title="***todo***">Bookmark</b-dropdown-item>
                            <b-dropdown-item title="***todo***">Contribute</b-dropdown-item>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item title="***todo***">Archive</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-nav>
                </td>
            </tr>
        </table>

        <b-card no-body>
            <b-tabs small card v-model="selectedTab">
                <!-- Collection Tab =================== -->
                <b-tab title="Collection">
                    <h3>Name</h3>
                    <!--  :readonly="Boolean(true)" v-model.trim="collection.collection_name"></b-form-input> -->
                    <b-form-input v-if="editMode" v-model="collection.collection_name" class="form-control filterInput" placeholder="Provide name"></b-form-input>
                    <span v-if="!editMode">{{collection.collection_name}}</span>

                    <h3>Description</h3>
                    <div v-if="editMode">
                        <tinymce id="nameEditor" v-model="collection.collection_description" :options="tinymceOptions" @change="tinyMCE_Changed"></tinymce>
                    </div>
                    <div v-if="!editMode" v-html="collection.collection_description"></div>

                    <h3>Settings</h3>

                    <b-form-checkbox :disabled="!editMode" v-model="collection.receive_notifications" value="1" unchecked-value="0">
                        Notifications
                    </b-form-checkbox> <br>
                    <b-form-checkbox :disabled="!editMode" v-model="collection.public" value="1" unchecked-value="0">
                        Public
                    </b-form-checkbox>
                    <br>

                    <b-button v-if="$route.params.id==='new'" variant="primary" size="sm" :disabled='!collection.collection_name.length'>Create</b-button>
                    <b-button v-if="editMode&&$route.params.id!=='new'" variant="primary" size="sm">Update</b-button>

                    <h3>Statistics</h3>
                    <table class="infotable">
                        <tr>
                            <td>Nr of terms</td>
                            <td>{{collection.terms?collection.terms.length:0}}</td>
                        </tr>
                        <tr>
                            <td>Nr of relations</td>
                            <td>{{collection.ontologies?collection.ontologies.length:0}}</td>
                        </tr>
                        <tr>
                            <td>Created by</td>
                            <td>{{collection.owner?collection.owner.name:""}}</td>
                        </tr>
                        <tr>
                            <td>Creation date</td>
                            <td>{{collection.created_at}}</td>
                        </tr>
                        <tr>
                            <td>Last update</td>
                            <td>{{collection.updated_at}}</td>
                        </tr>
                    </table>
                    <br>
                    <h3>Followers</h3>
                    ***todo***
                </b-tab>

                <!-- Terms Tab =================== -->

                <b-tab title="Terms" class='nopadding'>

                    <tablemenu v-model="termMenu" :showSortAuth='false' :showMenu="true" />
                    <div class='tableContent' ref='tabcontent'>
                        <!-- List of terms =================== -->
                        <table v-if="termMenu.viewType!==globalData.VIEWTYPE.INDEX" class="table termtable">
                            <tbody>
                                <tr>
                                    <td class="name bold">Term name</td>
                                    <td class="def bold">Term description</td>
                                    <td></td>
                                </tr>
                                <tr v-if="editMode&&editTermId!==0">
                                    <td>
                                        <b-button v-on:click="editTermId=0" variant="default" size="sm">New term</b-button>
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr v-if="editMode&&editTermId===0">
                                    <td colspan="3">
                                        <editTermList :editTerm="newTerm" :termList="collection.terms"></editTermList>
                                    </td>

                                </tr>
                                <tr class="" v-for="term in filteredList" v-on:click="editTermId=editMode?term.id:0">
                                    <td v-if="!editMode" v-bind:class="{compact:termMenu.viewType===globalData.VIEWTYPE.COMPACT, name:1}">
                                        <router-link :to="{ name: 'termDetail', params: { id: term.id } }" v-html="$options.filters.highlight(term.term_name, termMenu.filter)"></router-link>
                                    </td>
                                    <td v-if="editMode && editTermId != term.id" v-bind:class="{compact:termMenu.viewType===globalData.VIEWTYPE.COMPACT, name:1}" v-html="$options.filters.highlight(term.term_name, termMenu.filter)">
                                    </td>
                                    <td v-if="editTermId != term.id" v-bind:class="{compact:termMenu.viewType===globalData.VIEWTYPE.COMPACT, def:1}" v-html="$options.filters.highlight(term.term_definition, termMenu.filter)">
                                    </td>
                                    <td colspan="2" v-if="editTermId == term.id && editMode">
                                        <editTermList :editTerm="term" :termList="collection.terms"></editTermList>
                                    </td>
                                    <td>
                                        <a v-if="editTermId == term.id && editMode" href="#" class='iconbutton' v-on:click="removeTerm(term.id, $event)">
                                            <i class="fa fa-trash" aria-hidden="true"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- Index of terms =================== -->
                        <tableindex v-if="termMenu.viewType===globalData.VIEWTYPE.INDEX && collection.terms.length" :displayName="'term_name'" :routerName="'termDetail'" :inputArray="collection.terms" />
                    </div>
                </b-tab>

                <!-- Relations Tab =================== -->
                <b-tab title="Relations">
                    <!-- Filter input and menu =================== -->
                    <tablemenu v-model="relationMenu" :showSortAuth='false' :showMenu="false" />
                    <!-- List of relations =================== -->

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
                                <tr v-if="editMode&&editRelationId!==0">
                                    <td>
                                        <b-button v-on:click="editRelationId=0" variant="default" size="sm">New Relation</b-button>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr v-if="editMode&&editRelationId===0">
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
                                <tr v-if="!editMode" class="" v-for="relation in filteredRelationList">
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
                                <tr v-if="editMode" v-on:click="clickTest(relation.id)" v-for="(relation, index) in filteredRelationList">
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
                </b-tab>
                <!-- Graph Tab =================== -->
                <b-tab title="Graph" disabled>
                </b-tab>
            </b-tabs>
        </b-card>

    </div>
</template>

<script>

import globalData from '../../global_data';
import tablemenu from '../../plugins/tablemenu.vue';
import tableindex from '../../plugins/tableindex.vue';

export default {
    components: { tablemenu, tableindex, globalData },
    data() {
        return {
            termMenu: { filter: "", viewType: globalData.VIEWTYPE.FULL, sortType: globalData.SORTTYPE.NAME },
            relationMenu: { filter: "", viewType: globalData.VIEWTYPE.FULL, sortType: globalData.SORTTYPE.NAME },
            globalData: globalData,
            newRelation: { subject: { term_name: "" }, name: "", object: { term_name: "" }, id: 0 },
            newTerm: { id: 0, term_name: "", term_definition: "" },
            editTermId: 0,
            editRelationId: 0,
            collection: [],
            editMode: false,
            relationList: [],
            relationTableSort: { column: "Subject", o1: "subject", o2: "term_name", order: 1 },
            breadCrum: [
                {
                    text: 'Home',
                    href: '/',
                }, {
                    text: 'Collections',
                    href: '/collections',
                },
                {
                    text: '',
                    active: true
                }
            ],
            selectedTab: 0,
            tinymceOptions: {
                setup: function(ed) {
                },
                inline: false,
                plugins: 'advlist autolink link image lists charmap print preview paste',
                skin: 'lightgray',
                menubar: false,
                toolbar: 'undo redo | bold italic underline | bullist numlist',
                statusbar: true,
                branding: false,
                resize: true,
                theme: 'modern',
                content_css: '/app_mce.css',
                paste_as_text: true,
                mode: "textareas",
                force_br_newlines: false,
                force_p_newlines: false,
                forced_root_block: ''
            }
        }
    },
    mounted: function() {
    },
    created: function() {
        tinymce.baseURL = "../node_modules/tinymce";
        var that = this;
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

        if (this.$route.params.id !== 'new') {
            this.fetchCollection();
            if (this.$route.params.tab && this.$route.params.tab === 'terms') {
                this.selectedTab = 1;
            } else if (this.$route.params.tab && this.$route.params.tab === 'relations') {
                this.selectedTab = 2;
            }

        } else {
            this.editMode = true;

            //***todo*** this should come from the API
            this.collection = {
                "id": -1,
                "parent_id": null,
                "collection_name": "",
                "collection_description": "",
                "public": "1",
                "receive_notifications": "1",
                "created_by": -1,
                "created_at": "",
                "updated_at": "",
                "term_count": 0,
                "ontologies_count": 0,
                "owner_name": "",
                "bookmarked": true,
                "relations": [],
                "ontologies": [],
                "terms": [],
                "owner": {},
                "links": []
            }
        }
    },
    computed: {
        filteredList: function() {
            if (!this.collection.terms) return null;
            var self = this;
            var result = this.collection.terms.filter(
                function(term) {
                    return (term.term_name.toLowerCase().indexOf(self.termMenu.filter.toLowerCase()) >= 0) ||
                        (term.term_definition && term.term_definition.toLowerCase().indexOf(self.termMenu.filter.toLowerCase()) >= 0)
                });
            return result.sort((a, b) => (this.termMenu.sortType === globalData.SORTTYPE.CREATED) ? a.created_at.localeCompare(b.created_at) : (this.termMenu.sortType === globalData.SORTTYPE.UPDATED) ? a.updated_at.localeCompare(b.updated_at) : a.term_name.localeCompare(b.term_name));
        },
        filteredRelationList: function() {
            if (!this.relationList.length) return null;
            var self = this;
            var result = this.relationList.filter(
                function(relation) {
                    return (relation.subject.term_name.toLowerCase().indexOf(self.relationMenu.filter.toLowerCase()) >= 0) ||
                        (relation.object.term_name.toLowerCase().indexOf(self.relationMenu.filter.toLowerCase()) >= 0) ||
                        (relation.name.toLowerCase().indexOf(self.relationMenu.filter.toLowerCase()) >= 0)

                });
            console.log(result);
            if (this.relationTableSort.o1 !== 'relation') {
                return result.sort((a, b) => this.relationTableSort.order * a[this.relationTableSort.o1][this.relationTableSort.o2].localeCompare(b[this.relationTableSort.o1][this.relationTableSort.o2]));
            } else {
                return result.sort((a, b) => this.relationTableSort.order * a[this.relationTableSort.o2].localeCompare(b[this.relationTableSort.o2]));

            }
        }
    },
    methods: {
        tinyMCE_Changed : function() {

        },
        removeTerm: function(id, event) {
            this.collection.terms = this.collection.terms.filter(function(term) {
                return term.id != id;

            });
            if (event) event.stopPropagation();
        },
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
        addTerm: function() {
            console.log(this.newTerm);
        },
        fetchCollection: function() {
            this.$http.get('collections/' + this.$route.params.id)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    this.collection = data;
                    //fill breadcrum
                    this.breadCrum[2].text = this.collection.collection_name;

                    this.makeRelations();
                    this.collection.public = this.collection.public.toString();
                    this.collection.receive_notifications = this.collection.receive_notifications.toString();

                }
                ,
                function(error) {
                    console.log(error);
                });
        },
        makeRelations: function() {
            var ontology, term, orgRelation;
            var relation = {}, relationList = [];
            var i, a;
            for (i = 0; i < this.collection.ontologies.length; i++) {
                ontology = this.collection.ontologies[i];
                relation.id = ontology.id;
                // replace ids by the objects
                for (a = 0; a < this.collection.terms.length; a++) {
                    term = this.collection.terms[a];
                    if (ontology.subject_id === term.id) {
                        relation.subject = term;
                    }
                    if (ontology.object_id === term.id) {
                        relation.object = term;
                    }
                    if (ontology.subject && ontology.subject) {
                        break;
                    }
                }
                for (a = 0; a < this.collection.relations.length; a++) {
                    orgRelation = this.collection.relations[a];
                    if (ontology.relation_id === orgRelation.id) {
                        relation.name = orgRelation.relation_name;
                        break;
                    }
                }
                this.relationList.push({ id: relation.id, object: relation.object, name: relation.name, subject: relation.subject });
            }
            console.log(this.relationList);
        },
        sortBy: function(column) {
            this.relationTableSort.order = (this.relationTableSort.column === column) ? this.relationTableSort.order * -1 : 1;
            this.relationTableSort.column = column;
            this.relationTableSort.o1 = (column == "Object") ? "object" : (column == "Subject") ? "subject" : "relation";
            this.relationTableSort.o2 = (column == "Object") ? "term_name" : (column == "Subject") ? "term_name" : "name";
        }
    }
}
</script>
<style scoped>
.table {
    border: 1px solid grey;
}

.nav-link {
    padding: 0px !important;
}
</style>
