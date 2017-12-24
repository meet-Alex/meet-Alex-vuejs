/* global localStorage */

import axios from 'axios'

const API_URL = 'http://localhost/meet-Alex/public/index.php/api/';

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
   // 'Authorization': 'Bearer ' + localStorage.token
 // 'Authorization': 'Bearer '

  }
})