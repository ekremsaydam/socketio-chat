app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {
  // const socket = io.connect('http://localhost:3000');
  const connectionOptions = {
    reconnectionAttempts: 2,
    reconnectionDelay: 600
  };

  indexFactory.connectSocket('http://localhost:3001', connectionOptions)
    .then((socket) => {
      console.log('Bağlantı gerçekleşti', socket);
    }).catch((err) => {
      console.log(err);
    });
}]);