class ChatController {
  constructor($rootScope, $scope, stropheService) {
    this.$rootScope = $rootScope;
    this.activate = this.activate.bind(this, this.activate);
    this.stropheService = stropheService;

    this.recipient = '';
    this.message = '';
    this.messages = [{
      message: 'Hey! This is a test.',
      author: 'notme'
    }];
    this.user = 'daniel@localhost';

    this.activate();
  }

  activate() {

    this.$rootScope.$on('messageRecv', this.recvMessage);

  }

  connect() {
    this.stropheService.connect(this.user, 'daniel', 'http://localhost:5280/http-bind');
  }

  sendMessage() {
    this.stropheService.sendMessage(this.message, this.recipient);
    this.recvMessage(this.message, this.user); // Show the message we just sent
    this.message = '';
  }

  recvMessage({message, author}) {
    debugger;
    this.messages.push({message, author});
  }
}

ChatController.$inject = ['$rootScope', '$scope', 'stropheService'];

export default ChatController;
