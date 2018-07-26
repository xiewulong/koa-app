/*!
 * Common
 * create: 2018/07/25
 * since: 0.0.1
 */
'use strict';

import '../../stylesheets/common.scss';
import axios from 'axios';
import qs from 'qs';

// Axios
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [data => qs.stringify(data)];
axios.defaults.xsrfCookieName = 'csrf-token';
axios.defaults.xsrfHeaderName = 'x-csrf-token';
axios.interceptors.response.use(config => config, e => {
  if(e.response) {
    let data = [];
    for(let key, keys = Object.keys(e.response.data), i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      data.push(`${key}: ${e.response.data[key].join(', ')}`);
    }
    e.response.data = data.join('; ');
  }

  return Promise.reject(e);
});

// Logout
let logout_button = document.querySelector('[data-user="logout"]');
if(logout_button) {
  document.querySelector('[data-user="logout"]').onclick = function() {
    axios({
      url: '/user/logout',
      method: 'post',
    }).then(d => {
      window.location.href = d.data.redirect_to;
    }).catch(e => {
      alert(e.response && e.response.data || e.message);
    })

    return false;
  };
}
