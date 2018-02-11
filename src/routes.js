
import Collections      from 'components/collection/collections-list.vue';
import CollectionDetail from 'components/collection/collection-detail.vue';
import TermDetail       from 'components/term/term-detail.vue';
import NewTerm          from 'components/term/new-term.vue';
import Home             from 'components/home/home.vue';
import Login            from 'components/home/login.vue';
import TestPage         from 'components/home/testpage.vue';

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