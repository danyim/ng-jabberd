class RegisterController {
  constructor($scope, stropheService) {
    this.stropheService = stropheService;

    this.hostname = 'http://localhost:5280/http-bind';
    this.username = 'daniel@localhost';
    this.password = 'daniel';

    this.activate();
  }

  activate() {

  }

  login() {
    this.stropheService.connect(this.username, this.password, this.hostname);
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
