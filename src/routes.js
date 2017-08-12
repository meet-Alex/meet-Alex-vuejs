import Home from './components/Home.vue';
import Collections from './components/collection/Collections.vue';
import CollectionDetail from './components/collection/CollectionDetail.vue';
import TermDetail from './components/term/TermDetail.vue';

export const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/collections', component: Collections },
    { path: '/collections/:id', component: CollectionDetail, name: 'collectionDetail' },
    { path: '/terms/:id', component: TermDetail, name: 'termDetail' }
];