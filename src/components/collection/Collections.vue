<template>
    <div class="container">

        <b-breadcrumb :items="breadCrum" />

        <span class='title-header'>Overview collections</span>
        <a class="float-right" href="\collections\new" title='Create a new collection'>Create collection</a>

        <tablemenu v-model="tableMenu" :showSortAuth='true' :showMenu="true" />
        <div class='tableContent' ref='tabcontent'>
            <div v-if="collections[0]">
                <table v-if="tableMenu.viewType!=globalData.VIEWTYPE.INDEX" class="table">
                    <tbody>
                        <tr v-for="collection in filteredList">

                            <td v-bind:class="{compact:tableMenu.viewType===globalData.VIEWTYPE.COMPACT, name1:1}">
                                <router-link :to="{ name: 'collectionDetail', params: { id: collection.id } }" v-html="$options.filters.highlight(collection.collection_name, tableMenu.filter)"> </router-link><br>
                                <span class='info-badge' v-if="collection.authorisation===globalData.AUTHTYPE.BOOKMARKED" variant="info" title="You have bookmarked this collection. You cannot edit it">Bookmarked</span>
                                <span class='info-badge' v-if="collection.authorisation===globalData.AUTHTYPE.CONTRIBUTOR" variant="info" title="You can edit this collection">Contributor</span>
                                <span class='info-badge' v-if="collection.authorisation===globalData.AUTHTYPE.OWNER" variant="info" title="You are the owner of this collection">Owner</span>
                            </td>
                            <td v-bind:class="{compact:tableMenu.viewType===1, def:1}">
                                <div v-html="$options.filters.highlight(collection.collection_description, tableMenu.filter)"> </div>
                                <div>
                                    <span class='subscript'>
                                        <router-link :to="{ name: 'collectionDetail', params: { id: collection.id, tab:'terms' } }"> {{collection.term_count }} terms </router-link>
                                        |
                                        <router-link :to="{ name: 'collectionDetail', params: { id: collection.id, tab:'relations' } }"> {{collection.ontologies_count}} relations </router-link>
                                        |
                                        <i class='fa fa-user-circle' title='Collection owner'> {{collection.owner_name}} </i> |
                                        <i class='fa fa-calendar-o' title='Last update'> {{collection.updated_at}} </i>
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <tableindex v-if="tableMenu.viewType===globalData.VIEWTYPE.INDEX && collections.length" :displayName="'collection_name'" :routerName="'collectionDetail'" :inputArray="collections" />

            </div>
            <div v-else>
                <p>No collections found.</p>
            </div>
        </div>
    </div>
    
</template>

<script>
import globalData from '../../global_data';
import tablemenu from '../../plugins/tablemenu.vue';
import tableindex from '../../plugins/tableindex.vue';
export default {
    components: { tablemenu, tableindex },
    data() {
        return {
            tableMenu: { filter: "", viewType: globalData.VIEWTYPE.FULL, sortType: globalData.SORTTYPE.AUTH },
            globalData: globalData,
            collections: [],
            termIndex: [],
            breadCrum: [
                {
                    text: 'Home',
                    href: '/',
                }, {
                    text: 'Collections',
                    active: true
                }
            ]
        }
    },
    created: function() {
        this.fetchCollections();
    },
    computed: {
        filteredList: function() {
            var self = this;
            var list = this.collections.filter(
                function(collection) {
                    return (collection.collection_name.toLowerCase().indexOf(self.tableMenu.filter.toLowerCase()) >= 0) ||
                        (collection.collection_description.toLowerCase().indexOf(self.tableMenu.filter.toLowerCase()) >= 0)
                });
            list.sort(function(a, b) {
                var result;
                if (self.tableMenu.sortType === globalData.SORTTYPE.AUTH) {
                    result = (a.authorisation === b.authorisation) ? a.collection_name.localeCompare(b.collection_name) : b.authorisation - a.authorisation;
                } else if (self.tableMenu.sortType === globalData.SORTTYPE.NAME) {
                    result = a.collection_name.localeCompare(b.collection_name);
                } else if (self.tableMenu.sortType === globalData.SORTTYPE.CREATED) {
                    result = b.created_at.localeCompare(a.created_at);
                } else if (self.tableMenu.sortType === globalData.SORTTYPE.UPDATED) {
                    result = b.updated_at.localeCompare(a.updated_at);
                }
                return result;
            });
            return list;
        }
    },
    methods: {
        fetchCollections: function() {
            var self = this;
            this.$http.get('collections', { body: { _token: globalData.userInfo.token } })
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    //data is an object, change it to array
                    self.collections = Object.keys(data).map(key => data[key]);

                    //@TODO: now faked owner/collaborate/bookmared for DEMO
                    self.collections.forEach(function(collection) {
                        collection.authorisation = globalData.AUTHTYPE.NONE;
                    });
                    self.collections[3].authorisation = globalData.AUTHTYPE.OWNER;
                    self.collections[1].authorisation = globalData.AUTHTYPE.OWNER;
                    self.collections[6].authorisation = globalData.AUTHTYPE.CONTRIBUTOR;
                    self.collections[8].authorisation = globalData.AUTHTYPE.BOOKMARKED;
                    self.collections[9].authorisation = globalData.AUTHTYPE.BOOKMARKED;
                },
                function(error) {
                    console.log(error);
                });
        }
    }
}
</script>
