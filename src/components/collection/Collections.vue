<template>
    <div class="container">
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
                              <router-link :to="'/collections/' + collection.id">{{ collection.collection_name }}</router-link>
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
                this.$http.get('http://localhost/meet-alex/public/index.php/api/collections')
                    .then(response => {
                        return response.json();
                    })
                    .then (data => {
                        console.log(data);
                        const restultArray = [];
                        for (let key in data) {
                            restultArray.push(data[key]);
                        }
                        this.collections = data;
                        console.log(restultArray);
                    });
            }
        }
    }
</script>
