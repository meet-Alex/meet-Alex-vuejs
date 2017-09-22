<style>

</style>

<template>
    <div>
        <table class="table borderless">
            <tbody>
                <tr v-bind:class="{greyRow:indexLine.letter!==''}" v-for="indexLine in termIndex">
                    <td class="letter">
                        {{ indexLine.letter }}
                    </td>
                    <td class="compact" v-for="term in indexLine.col">
                        <router-link :to="{ name: routerName, params: { id: term.id } }">{{ term.name }}</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
</template>

<script>
import Vue from 'vue';
import globalData from '../global_data';
export default {
    name: "tableindex",
    data() {
        return {
            termIndex: [],
        }
    },
    props: {
        displayName: { type: String, required: true },
        routerName: { type: String, default: true },
        inputArray: { type: Array, required: true }
    },
    created: function() {
        this.makeIndex(4);
    },
    methods: {
        makeIndex: function(nrOfColumns) {
            var thisTerm, prevTerm;
            thisTerm = this.inputArray[0];
            console.log(thisTerm);
            var indexLine = {
                letter: thisTerm[this.displayName][0],
                col: []
            };
            indexLine.col.push({
                name: thisTerm[this.displayName],
                id: thisTerm.id
            });
            for (var i = 1; i < this.inputArray.length; i++) {
                thisTerm = this.inputArray[i];
                prevTerm = this.inputArray[i - 1];
                if (thisTerm[this.displayName][0] != prevTerm[this.displayName][0] || indexLine.col.length >= nrOfColumns) {
                    this.termIndex.push(indexLine);
                    indexLine = {
                        letter: (thisTerm[this.displayName][0] != prevTerm[this.displayName][0]) ? thisTerm[this.displayName][0] : "",
                        col: []
                    }
                }
                indexLine.col.push({ name: thisTerm[this.displayName], id: thisTerm.id });
            }
            this.termIndex.push(indexLine);
        }
    }
}
</script>