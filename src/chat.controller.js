class ChatController {
  constructor($rootScope, $scope, stropheService) {
    this.$rootScope = $rootScope;
    this.activate = this.activate.bind(this, this.activate);
    this.stropheService = stropheService;

    this.recipient = '';
    this.message = '';
    this.messages = [{
      message: 'Hey! This is a test.',
      author: 'info'
    }];

    this.contacts = [
      {
        name: 'Bobby Tables',
        jid: 'bobby@localhost',
        unreadMessageCount: 0,
        online: true,
        messages: [
          {
            message: 'Sup, mang?',
            author: 'info'
          }
        ]
      },{
        name: 'The Dude',
        jid: 'dude@localhost',
        unreadMessageCount: 5,
        online: false,
      },{
        name: 'Alice',
        jid: 'alice@localhost',
        unreadMessageCount: 0,
        online: false,
      }
    ];

    this.activeContact = this.contacts[0];
    this.user = 'daniel@localhost';

    this.activate();
  }

  activate() {

    this.$rootScope.$on('messageRecv', this.messageRecvHandler.bind(this));

  }

  connect() {
    this.stropheService.connect(this.user, 'daniel', 'http://localhost:5280/http-bind');
  }

  messageRecvHandler(event, { message, author }) {
    this.recvMessage(message, author);
  }

  sendMessage() {
    this.stropheService.sendMessage(this.message, 'alice@localhost');
    this.recvMessage(this.message, this.user); // Show the message we just sent
    this.message = '';
  }

  recvMessage(message, contactJid) {
    this.messages.push({message, contactJid});
  }

  newMessage() {
    alert('ok new message');
  }

  changeContactViewWithIndex(index) {
    console.log('changing view to contact', this.contacts[index].name);
    this.activeContact = this.contacts[index];
  }
}

ChatController.$inject = ['$rootScope', '$scope', 'stropheService'];

export default ChatController;
