import Vue from 'vue';
import VueRouter from 'vue-router';
//import VueResource from 'vue-resource';
import App from './App.vue';
import { routes } from './routes';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';

import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';


import VueTinymce from 'components/generic/vue-tinymce';
import store from 'store';
import axios from 'myaxios';
import Notifications from 'vue-notification';

Vue.use(VueTinymce);

Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(Notifications);

const router = new VueRouter({
    mode: 'history',
    routes
});

Vue.filter('highlight', function(words, query) {
    if (!words || query.length <= 2) return words;
    var iQuery = new RegExp(query, "ig");
    return words.toString().replace(iQuery, function(matchedTxt, a, b) {
        return ('<span class=\'highlight\'>' + matchedTxt + '</span>');
    });
});

var vm=new Vue({
    el: '#app',
    data:{login:{email:"", token:""}
    },
    store,
    router,
    axios,
    render: h => h(App)
});