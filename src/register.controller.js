class RegisterController {
  constructor($scope, $state, $q, stropheService) {
    this.stropheService = stropheService;
    this.$scope = $scope;
    this.$state = $state;
    this.$q = $q;

    this.hostname = 'http://localhost:5280/http-bind';
    this.username = 'daniel@localhost';
    this.password = 'daniel';
    this.error = '';

    this.activate();
  }

  activate() {

  }

  login() {
    this.error = '';
    this.status = '';

    const connect = this.stropheService.connect(this.username, this.password, this.hostname);
    connect.promise
      .then(
        (val) => {
          this.$state.go('chat');
        },
        (reason) => {
          this.error = reason;
        }
      );
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

RegisterController.$inject = ['$scope', '$state', '$q', 'stropheService'];

export default RegisterController;
