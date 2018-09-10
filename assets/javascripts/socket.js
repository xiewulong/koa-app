/*!
 * Socket
 * create: 2018/09/07
 * since: 0.0.1
 */
'use strict';

// import './common';
import '../stylesheets/socket.scss';
import chat_channel from './channels/chat';

const ul = document.querySelector('ul');
const form = document.querySelector('form[name="chat"]');

chat_channel.on('chat', message => {
  let item = document.createElement('li');
  item.innerHTML = message;
  ul.appendChild(item);
  ul.parentNode.scrollTop = ul.offsetHeight;
});

form.onsubmit = function(e) {
  e.preventDefault();

  let error;
  if(this.message.value == '') {
    error = 'Please enter message';
  }

  if(error) {
    return;
    // return alert(error);
  }

  chat_channel.emit('chat', this.message.value);
  this.message.value = '';
  this.message.focus();
};
