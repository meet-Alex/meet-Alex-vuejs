import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue';
import { routes } from './routes';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';

Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(VueResource);

/*Vue.http.options.root = 'http://localhost/meet-alex/public/index.php/api/';*/




Vue.http.options.root = 'https://www.meet-alex.org/index.php/api/';

const router = new VueRouter({
    mode: 'history',
    routes
});

Vue.filter('highlight', function(words, query) {
    if (query.length <= 2) return words;
    var iQuery = new RegExp(query, "ig");
    return words.toString().replace(iQuery, function(matchedTxt, a, b) {
        return ('<span class=\'highlight\'>' + matchedTxt + '</span>');
    });
});

new Vue({
    el: '#app',
    router,
    render: h => h(App)

});