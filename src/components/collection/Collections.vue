<template>
    <div class="container">
        <ul class="breadcrumb breadcrumb-section">
            <li><router-link :to="{ name: 'Home' }">Home</router-link></li>
            <li class="active">Collections</li>
        </ul>

        <ul class="list-group">
            <h4>Collections overview</h4>
            <div v-if="collections[0]">
                <table class="table table-striped table-bordered">
                  <thead>
                    <tr class="success">
                      <th>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="collection in collections">
                          <td>
                              <router-link :to="{ name: 'collectionDetail', params: { id: collection.id } }">{{ collection.collection_name }}</router-link>
                          </td>
                          <td>
                              {{ collection.collection_description }}
                          </td>
                      </tr>
                  </tbody>
                </table>
            </div>
            <div v-else>
                <p>No collections found.</p>
            </div>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                collections: []
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
