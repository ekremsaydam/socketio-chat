app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {
  // const socket = io.connect('http://localhost:3000');

  $scope.init = () => {
    const username = prompt('Please enter username');

    if (username) {
      initSocket(username);
    } else return false;
  };

  function initSocket(username) {
    const connectionOptions = {
      reconnectionAttempts: 2,
      reconnectionDelay: 600
    };

    indexFactory.connectSocket('http://localhost:3000', connectionOptions)
      .then((socket) => {
        // console.log('Bağlantı gerçekleşti', socket);
        socket.emit('newUser', { username });
      }).catch((err) => {
        console.log(err);
      });
  }



}]);