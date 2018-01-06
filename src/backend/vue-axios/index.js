import Vue from 'vue'
import VueAxios from 'vue-axios'
import store from '../../store'

import axios from './axios'

Vue.use(VueAxios, axios, store)
Vue.axios.interceptors.response.use((response) => { // intercept the global error
    return response
  }, function (error) {

    var displayerror=error.response.data;

    if (error.response.status === 401) {
      displayerror="Please log in again"
    
      localStorage.loggedin = false;  
      localStorage.id = -1;
      window.location.href = '/login'
     
      Vue.prototype.$notify({
        group: 'foo',
        position: 'top center',
        type: 'error',
        title: 'Error in API call--',
        text: displayerror
      }); 

    }

    console.log(error, error.response, error.message);
    Vue.prototype.$notify({
      group: 'foo',
      position: 'top center',
      type: 'error',
      title: 'Error in API call--',
      text: displayerror
    });

      console.log("-------expired--------------");
      /*
    let originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) { // if the error is 401 and hasent already been retried
      originalRequest._retry = true // now it can be retried 

      return Vue.axios.post('/users/token', null).then((data) => {
        store.dispatch('authfalse') 
        store.dispatch('authtruth', data.data)
        originalRequest.headers['Authorization'] = 'Bearer ' + store.state.token // new header new token
        return Vue.axios(originalRequest) // retry the request that errored out
      }).catch((error) => {
        for (let i = 0; i < error.response.data.errors.length; i++) {
          if (error.response.data.errors[i] === 'TOKEN-EXPIRED') {
            auth.logout()
            return
          }
        }
      })
      
    } 

    if (error.response.status === 404 && !originalRequest._retry) {
      originalRequest._retry = true
    //  window.location.href = '/'
      return
    }
    */
    // Do something with response error
    return Promise.reject(error)
  })