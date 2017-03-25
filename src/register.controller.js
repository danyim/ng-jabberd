class RegisterController {
  constructor($scope, stropheService) {
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

  }

  connect() {
    this.stropheService.connect(this.user, 'daniel', 'http://localhost:5280/http-bind');
  }

  sendMessage() {
    this.stropheService.sendMessage(this.message, this.recipient);
    this.recvMessage(this.message, this.user); // Show the message we just sent
    this.message = '';
  }

  recvMessage(message, author) {
    this.messages.push({message, author});
  }
}

RegisterController.$inject = ['$scope', 'stropheService'];

export default RegisterController;
