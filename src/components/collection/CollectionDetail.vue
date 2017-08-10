<template>
    <div class="container">
        <ul class="breadcrumb breadcrumb-section">
            <li><router-link :to="{ name: 'Home' }">Home</router-link></li>
            <router-link to="/collections" activeClass="active" tag="li"><a>Collections</a></router-link>
            <li class="active">{{ collection.collection_name }}</li>
        </ul>

        <h4>Collections detail</h4>
        <h5>{{ $route.params.id }}</h5>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                collection: []
            }
        },
        created: function () {
            this.fetchCollection();
        },
        methods: {
            fetchCollection: function() {
                this.$http.get('http://localhost/meet-alex/public/index.php/api/collections/' + this.$route.params.id)
                .then(response => {
                    return response.json();
                })
                .then (data => {
                    this.collection = data;
                });
            }
        }
    }
</script>
