import Home from './components/Home.vue';
import Collections from './components/collection/Collections.vue';
import CollectionDetail from './components/collection/CollectionDetail.vue';
import TermDetail from './components/term/TermDetail.vue';
import NewTerm from './components/term/NewTerm.vue';
import Login from './components/Login.vue';
import TestPage from './components/Testpage.vue';

export const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/register', component: Login, name: 'Register' },
    { path: '/collections', component: Collections, name: 'collections' },
    { path: '/collections/:id', component: CollectionDetail, name: 'collectionDetail' },
    { path: '/new_term/:id', component: NewTerm, name: 'newTerm' },
    { path: '/terms/:id', component: TermDetail, name: 'termDetail' },
    { path: '/Testpage',  component: TestPage, name:'testpage'}
];