<template>
  <div id="app">
    <v-app id="inspire">
      <v-card>
        <v-card-title>
          Articles
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="articles"
          :loading="loading"
          :search="search"
        >
         <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
          <td class="text-sm">{{ props.item.date }}</td>
          <td class="text-sm">{{ props.item.author }}</td>
          <td class="text-sm">{{ props.item.title }}</td>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </v-data-table>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource';
import { setTimeout } from 'timers';
Vue.use(VueResource);

export default{  
  data () {
    return {
      loading: true,
      search: '',
      headers: [
        { text: 'Date', value: 'date'},
        { text: 'Author', value: 'author' },
        { text: 'Title', value: 'title' },
      ],
      articles: []
    } 
  },
  mounted() {
    this.updateDataWhenReady();
  },
  methods: {
    updateDataWhenReady: function () {
        Vue.http.get('/isServerLoadingData').then((data) => {
        var is_server_loading_data = data.body;
        if (is_server_loading_data) {
          setTimeout(this.updateDataWhenReady, 1000); // check later
        }
        else {
          Vue.http.get('/api').then((data) => {
            this.articles = data.body;
            this.loading = false;
          });
        }
      });
    }
  }
}

</script>

