import Home from './components/Home.vue';
import Collections from './components/collection/Collections.vue';
import CollectionDetail from './components/collection/CollectionDetail.vue';
import TermDetail from './components/term/TermDetail.vue';
import NewTerm from './components/term/newTerm.vue';

import Login from './components/Login.vue';

export const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/register', component: Login, name: 'Register' },
    { path: '/collections', component: Collections, name: 'collections' },
    { path: '/ontologies',  name:'ontologies'},
    { path: '/ontologies/:id',  name:'ontologiesdetail'},
    { path: '/collections/:id', component: CollectionDetail, name: 'collectionDetail' },
    { path: '/new_term/:id', component: NewTerm, name: 'newTerm' },
    { path: '/terms/:id', component: TermDetail, name: 'termDetail' }
];