
<template>
    <div class='menu-div'>
        <b-navbar toggleable="md" type="dark" variant="info">

            <input :disabled="viewType === globalData.VIEWTYPE.INDEX" v-model="filter" class="form-control filter-input" @input="update()" placeholder="Type to filter...">

            <b-navbar-nav class="ml-auto">
                <b-nav v-if="showMenu">
                    <b-nav-item-dropdown :disabled="viewType===globalData.VIEWTYPE.INDEX" text="Sort" right title='Sort the table'>
                        <b-dropdown-item v-if="showSortAuth" v-on:click="setSortType(globalData.SORTTYPE.AUTH)">Authorisation</b-dropdown-item>
                        <b-dropdown-item v-on:click="setSortType(globalData.SORTTYPE.NAME)">Name</b-dropdown-item>
                        <b-dropdown-item v-on:click="setSortType(globalData.SORTTYPE.CREATED)">Created</b-dropdown-item>
                        <b-dropdown-item v-on:click="setSortType(globalData.SORTTYPE.CHANGED)">Changed</b-dropdown-item>
                    </b-nav-item-dropdown>

                    <b-nav-item-dropdown text="Display" right title='Change the overview'>
                        <b-dropdown-item v-on:click="setViewType(globalData.VIEWTYPE.FULL)">Full</b-dropdown-item>
                        <b-dropdown-item v-on:click="setViewType(globalData.VIEWTYPE.COMPACT)">Compact</b-dropdown-item>
                        <b-dropdown-item v-on:click="setViewType(globalData.VIEWTYPE.INDEX)">Index</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-nav>
            </b-navbar-nav>

        </b-navbar>
    </div>
</template>

<script>
import Vue from 'vue';
import globalData from '../global_data';
export default {
    name: "tablemenu",
    data() {
        return {
            globalData: globalData,
            viewType: globalData.VIEWTYPE.FULL,
            sortType: globalData.SORTTYPE.NAME,
            filter: ""
        }
    },
    props: {
        showSortAuth: { type: Boolean, default: true },
        showMenu: { type: Boolean, default: true },
        value: { type: Object, required: true }
    },
    created: function() {
        this.viewType = this.value.viewType;
        this.sortType = this.value.sortType;
    },
    methods: {
        setViewType: function(type) {
            this.viewType = type;
            this.update();
        },
        setSortType: function(type) {
            this.sortType = type;
            this.update();
        },
        update: function() {
            this.$emit('input', {
                viewType: this.viewType,
                sortType: this.sortType,
                filter: this.filter
            })
        }
    }
}
</script>

<style scoped>
    .filter-input {
        width: 15em;
    }
    .menu-div {
        border:1px solid grey;
    }
    .bg-info {
     /*   background-color: #18bc9c !important;*/
    }
</style>
