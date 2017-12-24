/* global localStorage */

import axios from 'axios'
import globalData from '../../global_data';

const API_URL = globalData.apiURL + '/';

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
   // 'Authorization': 'Bearer ' + localStorage.token
 // 'Authorization': 'Bearer '

  }
})