app.controller('indexController', ['$scope', 'indexFactory', 'configFactory', ($scope, indexFactory, configFactory) => {
  // const socket = io.connect('http://localhost:3000');

  $scope.messages = [];
  $scope.players = {};

  $scope.init = () => {
    const username = prompt('Please enter username');

    if (username) {
      initSocket(username);
    } else return false;
  };

  function scrollTop() {
    setTimeout(() => {
      const element = document.getElementById('char-area');
      element.scrollTop = element.scrollHeight;
    });
  }

  function showBubble(id, message) {
    $('#' + id).find('.message').show().html(message);
    setTimeout(() => {
      $('#' + id).find('.message').hide();
    }, 2000);
  }

  async function initSocket(username) {
    const connectionOptions = {
      reconnectionAttempts: 2,
      reconnectionDelay: 600
    };

    try {
      const socketUrl = await configFactory.getConfig();
      // console.log(socketUrl.data.socketUrl);
      const socket = await indexFactory.connectSocket(socketUrl.data.socketUrl, connectionOptions);
      // .then((socket) => {
      // console.log('Bağlantı gerçekleşti', socket);
      socket.emit('newUser', { username });

      socket.on('initPlayers', (players) => {
        $scope.players = players;
        $scope.$apply();
      });

      socket.on('newUser', (data) => {

        const messageData = {
          type: {
            code: 0, // server or user message
            message: 1 // login or disconnect message
          }, // sistem mesajlari
          username: data.username,
        };

        $scope.messages.push(messageData);
        $scope.players[data.id] = data;
        scrollTop();
        $scope.$apply();
      });

      socket.on('disUser', (data) => {
        const messageData = {
          type: {
            code: 0,
            message: 0
          }, // sistem mesajlari
          username: data.username,
        };

        $scope.messages.push(messageData);
        delete $scope.players[data.id];
        scrollTop();
        $scope.$apply();
        // console.log(data);
      });
      let animate = false;
      $scope.onClickPlayer = ($event) => {
        // console.log($event.offsetX, $event.offsetY);
        if (!animate) {

          let x = $event.offsetX;
          let y = $event.offsetY;

          socket.emit('animate', { x, y, socketId: socket.id });

          animate = true;
          $('#' + socket.id).animate({
            'left': x,
            'top': y
          }, () => {
            animate = false;
          });
        }

      };


      socket.on('animate', (data) => {
        $('#' + data.socketId).animate({
          'left': data.x,
          'top': data.y
        });
      });

      $scope.newMessage = () => {
        let message = $scope.message;
        const messageData = {
          socketId: socket.id,
          type: {
            code: 1 // server or user message
          }, // sistem mesajlari
          username: username,
          text: message
        };


        $scope.messages.push(messageData);

        socket.emit('newMessage', messageData);

        $scope.message = "";
        showBubble(socket.id, message);
        scrollTop();

      };

      socket.on('newMessage', (message) => {

        $scope.messages.push(message);
        $scope.$apply();
        showBubble(message.socketId, message.text);
        scrollTop();
      });


      // }).catch((err) => {
      //   console.log(err);
      // });
    } catch (err) {
      console.log(err);
    }
  }



}]);