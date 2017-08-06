import Home from './components/Home.vue';
import Collections from './components/collection/Collections.vue';
import CollectionDetail from './components/collection/CollectionDetail.vue';

export const routes = [
    { path: '/', component: Home },
    { path: '/collections', component: Collections },
    { path: '/collections/:id', component: CollectionDetail }
];
