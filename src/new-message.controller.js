class NewMessageController {
  constructor($scope, $timeout, close) {
    this.$scope = $scope;
    this.close = close;
    this.recipient = '';

    // Focus on the input
    $timeout(() => document.getElementById('recipient').focus());
  }

  close(recipient) {
    this.close(recipient);
  }
}

NewMessageController.$inject = ['$scope', '$timeout', 'close'];

export default NewMessageController;
