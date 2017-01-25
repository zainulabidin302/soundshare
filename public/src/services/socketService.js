'use strict';
app.service('socketService', function(baseURL) {
    var __socket = io.connect('http://'+ baseURL);
    console.log('socket created !', __socket)

    function getSocketConnection() {
      return __socket;
    }

    function send(url, data) {
      __socket.emit(url, data);
      return this;
    }

    function when(url, cb) {
      __socket.on(url, cb);
      return this;
    }

    return  {
      send: send,
      when: when,
      getSocketConnection: getSocketConnection
    }
});
