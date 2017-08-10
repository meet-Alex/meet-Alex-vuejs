<template>
    <div class="container">
        <ul class="breadcrumb breadcrumb-section">
            <li><router-link :to="{ name: 'Home' }">Home</router-link></li>
            <router-link to="/collections" activeClass="active" tag="li"><a>Collections</a></router-link>
            <li class="active">{{ collection.collection_name }}</li>
        </ul>

        <h4>Collections detail</h4>
        <h5>{{ $route.params.id }}</h5>

        <div class="text-center">
            <ul class="pagination">
                <li v-for="letter in letters">
                    <a>{{ letter }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                collection: [],
                letters: []
            }
        },
        created: function () {
            this.fetchCollection();
            this.fetchCollectionLetters();
        },
        methods: {
            fetchCollection: function() {
                this.$http.get('collections/' + this.$route.params.id)
                .then(response => {
                    return response.json();
                })
                .then (data => {
                    this.collection = data;
                });
            },
            fetchCollectionLetters: function() {
                this.$http.get('collections/' + this.$route.params.id + '/letters')
                .then(response => {
                    return response.json();
                })
                .then (data => {
                    this.letters = data;
                });
            }
        }
    }
</script>
