<style>
.name1 {
     width:250px;
    font-weight: 400;
    padding-right: 10px;
}
.subscript {
    font-size: 0.7em;
    color:grey;
}
</style>


<template>
    <div class="container">
        <b-breadcrumb :items="breadCrum"/>
        
            <div v-if="collections[0]">
                <table class="table">
                  <tbody>
                      <tr v-for="collection in collections">
                          <td class="name1">
                              <router-link :to="{ name: 'collectionDetail', params: { id: collection.id } }">{{ collection.collection_name }}</router-link>
                          </td>
                          <td>
                              {{ collection.collection_description }} <br>
                              <span class="subscript">
                                    {{collection.term_count}} terms |
                                  Owner:meet-Alex |
                                  Updated:{{collection.updated_at}}</span>
                          </td>
                      </tr>
                  </tbody>
                </table>
            </div>
            <div v-else>
                <p>No collections found.</p>
            </div>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                collections: [],
                breadCrum : [
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
        created: function () {
            this.fetchCollections();
        },
        methods: {
            fetchCollections: function() {
                this.$http.get('collections')
                .then(response => {
                    return response.json();
                })
                .then (data => {
                    this.collections = data;
                });
            }
        }
    }
</script>
