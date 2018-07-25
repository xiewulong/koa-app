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
axios.defaults.headers['csrf-token'] = document.querySelector('meta[name="csrf"]').getAttribute('content');
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [data => qs.stringify(data)];

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
      alert(e);
    })

    return false;
  };
}
