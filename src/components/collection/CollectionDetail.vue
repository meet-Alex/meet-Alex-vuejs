<style>

</style>

<template>
    <div class="container flex">
        <div class="flex01">
            <b-breadcrumb :items="breadCrum" />
        </div>
        <!-- Collection title and action menu -->
        <div class="flex01">
            <table style="width: 100%;">
                <tr>
                    <td class="compact title-header">
                        Collection: {{collection.collection_name}}
                    </td>
                    <td align="right">
                        <b-form-checkbox id="checkbox1" v-model="editMode">
                            Edit
                        </b-form-checkbox>
                        <b-nav class="float-right">
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
        </div>
        <div class="flex01">
            <b-form-radio id="viewTab" class="mb-4" v-on:change="changeTab" buttons v-model="selectedTab" :options="showTab" />
        </div>

        <!-- Collection Tab =================== -->

        <div v-if="selectedTab==='collection'" class="flex">
            <div class='tableContent' ref='tabcontent'>

                <h3>Name</h3>
                <!--  :readonly="Boolean(true)" v-model.trim="collection.collection_name"></b-form-input> -->
                <b-form-input v-if="editMode" v-model="collection.collection_name" class="form-control filterInput" placeholder="Provide name"></b-form-input>
                <span v-if="!editMode">{{collection.collection_name}}</span>

                <h3>Description</h3>
                <!-- This contains a bug: https://github.com/bootstrap-vue/bootstrap-vue/issues/833
                                                                        <b-form-input textarea :readonly="Boolean(false)" v-model="collection.collection_description"></b-form-input> -->
                <!-- <input :disabled="!editMode" v-model="collection.collection_description" class="form-control filterInput" placeholder="Provide name"> -->
                <!--
                                        <b-form-input v-if="editMode" v-model="collection.collection_description" placeholder="Provide description"></b-form-input>
                                    -->
                <div v-if="editMode">
                    <tinymce id="nameEditor" v-model="collection.collection_description" :options="tinymceOptions" @change="changed" ></tinymce>
                </div>
                <div v-if="!editMode" v-html="collection.collection_description"></div>

                <h3>Settings</h3>

                <b-form-checkbox :disabled="!editMode" id="checkbox1" v-model="collection.receive_notifications" value="1" unchecked-value="0">
                    Notifications
                </b-form-checkbox> <br>
                <b-form-checkbox :disabled="!editMode" id="checkbox1" v-model="collection.public" value="1" unchecked-value="0">
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
            </div>
        </div>

        <!-- Terms Tab =================== -->
        <div v-if="selectedTab==='terms'" class="flex">
            <!-- Filter input and menu =================== -->
            <div class="flex01 ">
                <table style="width: 100%;">
                    <tr>
                        <td style="width: 20em">
                            <input :disabled="viewType === 2" v-model="filter" class="form-control filterInput" placeholder="Type to filter...">
                        </td>
                        <td align="right">
                            <b-nav class="float-right">
                                <b-nav-item-dropdown :disabled="viewType===2" text="Sort" right title='Sort the collections'>
                                    <b-dropdown-item v-on:click="sortType=1">Name</b-dropdown-item>
                                    <b-dropdown-item v-on:click="sortType=2">Created</b-dropdown-item>
                                    <b-dropdown-item v-on:click="sortType=3">Changed</b-dropdown-item>
                                </b-nav-item-dropdown>
                                <b-nav-item-dropdown text="Display" right title='Change the overview of the collections'>
                                    <b-dropdown-item v-on:click="viewType=0">Full</b-dropdown-item>
                                    <b-dropdown-item v-on:click="viewType=1">Compact</b-dropdown-item>
                                    <b-dropdown-item v-on:click="viewType=2">Index</b-dropdown-item>
                                </b-nav-item-dropdown>
                            </b-nav>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class='tableContent' ref='tabcontent'>
                <!--    <vue-scrollbar classes="my-scrollbar" v-bind:style="{ 'max-height': tabheight + 'px' }">
                                        <div class='scroll-me'>
                                -->
                <!-- add new term -->

                <!--   <editTermList v-if="editMode" :editTerm="newTerm"></editTermList> -->
                <!-- List of terms =================== -->
                <table v-if="viewType<2" class="table termtable">
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
                            <td v-if="!editMode" v-bind:class="{compact:viewType===1, name:1}">
                                <router-link :to="{ name: 'termDetail', params: { id: term.id } }" v-html="$options.filters.highlight(term.term_name, filter)"></router-link>
                            </td>
                            <td v-if="editMode && editTermId != term.id" v-bind:class="{compact:viewType===1, name:1}" v-html="$options.filters.highlight(term.term_name, filter)">
                            </td>
                            <td v-if="editTermId != term.id" v-bind:class="{compact:viewType===1, def:1}" v-html="$options.filters.highlight(term.term_definition, filter)">
                            </td>
                            <td colspan="2" v-if="editTermId == term.id && editMode">
                                <editTermList :editTerm="term" :termList="collection.terms"></editTermList>
                            </td>
                            <td>
                                 <a v-if="editTermId == term.id && editMode" href="#" class='iconbutton'  v-on:click="removeTerm(term.id, $event)" >
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- Index of terms =================== -->
                <table v-if="viewType===2" class="table borderless">
                    <tbody>
                        <tr v-bind:class="{greyRow:indexLine.letter!==''}" v-for="indexLine in termIndex">
                            <td class="letter">
                                {{ indexLine.letter }}
                            </td>
                            <td class="compact" v-for="term in indexLine.col">
                                <router-link :to="{ name: 'termDetail', params: { id: term.id } }">{{ term.name }}</router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--        
                                    </vue-scrollbar>
                                </div>
                                -->
            <!--tableContent-->
        </div>

        <!-- Relations Tab =================== -->
        <div v-if="selectedTab==='relations'" class="flex">
            <!-- Filter input and menu =================== -->
            <table style="width: 100%;">
                <tr>
                    <td style="width: 20em">
                        <input v-model="filterRelation" class="form-control filterInput" placeholder="Type to filter...">
                    </td>
                    <td>

                    </td>
                </tr>
            </table>
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
                                <router-link :to="{ name: 'termDetail', params: { id: relation.subject.id } }" v-html="$options.filters.highlight(relation.subject.term_name, filterRelation)"></router-link>
                            </td>
                            <td v-html="$options.filters.highlight(relation.name, filterRelation)">
                            </td>
                            <td>
                                <router-link :to="{ name: 'termDetail', params: { id: relation.object.id } }" v-html="$options.filters.highlight(relation.object.term_name, filterRelation)"></router-link>
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
                                <a v-if="relation.id===editRelationId" href="#" class='iconbutton'  v-on:click="removeRelation(relation.id, $event)">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <a href="#"></a>
            </div>
        </div>
    </div>
</template>

<script>

//import VueTinyMCE from 'vue-tinymce';



export default {

    data() {
        return {
            selection: '',
            suggestions: [
                { city: 'Bangalore', state: 'Karnataka' },
                { city: 'Chennai', state: 'Tamil Nadu' },
                { city: 'Delhi', state: 'Delhi' },
                { city: 'Kolkata', state: 'West Bengal' },
                { city: 'Mumbai', state: 'Maharashtra' }
            ],
            tabheight: 500,
            newRelation: { subject: { term_name: "" }, name: "", object: { term_name: "" }, id: 0 },
            newTerm: { id: 0, term_name: "", term_definition: "" },
            editTermId: 0,
            editRelationId: 0,
            collection: [],
            letters: [],
            viewType: 0,
            termIndex: [],
            editMode: false,
            relationList: [],
  
            sortType: 1,
            filter: "",
            content: '',
            filterRelation: "",
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
            viewOptions: [
                { text: 'Full', value: 0 },
                { text: 'Compact', value: 1 },
                { text: 'Index', value: 2 }
            ],
            selectedTab: 'collection',
            showTab: [
                { text: 'Collection', value: 'collection' },
                { text: 'Terms', value: 'terms' },
                { text: 'Relations', value: 'relations' },
                { text: 'Graph', value: 'graph', disabled: true }
            ],
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
                content_css: 'css/app_mce.css',
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
            console.log('addRelation', that.newRelation);

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
                this.selectedTab = 'terms';
            } else if (this.$route.params.tab && this.$route.params.tab === 'relations') {
                this.selectedTab = 'relations';
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
                    return (term.term_name.toLowerCase().indexOf(self.filter.toLowerCase()) >= 0) ||
                        (term.term_definition && term.term_definition.toLowerCase().indexOf(self.filter.toLowerCase()) >= 0)

                });
            return result.sort((a, b) => (this.sortType === 2) ? a.created_at.localeCompare(b.created_at) : (this.sortType === 3) ? a.updated_at.localeCompare(b.updated_at) : a.term_name.localeCompare(b.term_name));
        },
        filteredRelationList: function() {
            if (!this.relationList.length) return null;
            var self = this;
            var result = this.relationList.filter(
                function(relation) {
                    return (relation.subject.term_name.toLowerCase().indexOf(self.filterRelation.toLowerCase()) >= 0) ||
                        (relation.object.term_name.toLowerCase().indexOf(self.filterRelation.toLowerCase()) >= 0) ||
                        (relation.name.toLowerCase().indexOf(self.filterRelation.toLowerCase()) >= 0)

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
        removeTerm: function(id, event) {
            this.collection.terms = this.collection.terms.filter(function(term) {
                // console.log(term);
                return term.id != id;
                
            });
             if (event) event.stopPropagation();
        },
         removeRelation: function(id, event) {
            this.relationList = this.relationList.filter(function(relation) {
                // console.log(term);
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
        changed: function(editor, content) { },


        changeTab: function(value) {

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
                    this.makeIndex(4);
                    this.makeRelations();
                    this.collection.public = this.collection.public.toString();
                    this.collection.receive_notifications = this.collection.receive_notifications.toString();
                    
                }
                ,
                function(error) {
                    console.log(error);
                    var data = error.data;
                    this.collection = data;
                    //fill breadcrum
                    this.breadCrum[2].text = this.collection.collection_name;
                    this.makeIndex(4);
                    this.makeRelations();
                    this.collection.public = this.collection.public.toString();
                    this.collection.receive_notifications = this.collection.receive_notifications.toString();
                });



        },
        makeIndex: function(nrOfColumns) {
            var thisTerm, prevTerm;
            thisTerm = this.collection.terms[0];
            var indexLine = {
                letter: thisTerm.term_name[0],
                col: []
            };
            indexLine.col.push({
                name: thisTerm.term_name,
                id: thisTerm.id
            });
            for (var i = 1; i < this.collection.terms.length; i++) {
                thisTerm = this.collection.terms[i];
                prevTerm = this.collection.terms[i - 1];
                if (thisTerm.term_name[0] != prevTerm.term_name[0] || indexLine.col.length >= nrOfColumns) {
                    this.termIndex.push(indexLine);
                    indexLine = {
                        letter: (thisTerm.term_name[0] != prevTerm.term_name[0]) ? thisTerm.term_name[0] : "",
                        col: []
                    }
                }
                indexLine.col.push({ name: thisTerm.term_name, id: thisTerm.id });
            }
            this.termIndex.push(indexLine);
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
