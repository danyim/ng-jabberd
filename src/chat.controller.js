class ChatController {
  constructor($rootScope, $scope, stropheService) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;

    this.activate = this.activate.bind(this, this.activate);
    this.stropheService = stropheService;

    this.recipient = '';
    this.message = '';
    // this.messages = [{
    //   message: 'Hey! This is a test.',
    //   author: 'info'
    // }];

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
        messages: []
      },
      // {
      //   name: 'Alice',
      //   jid: 'alice@localhost',
      //   unreadMessageCount: 0,
      //   online: false,
      //   messages: []
      // }
    ];

    this.activeContact = this.contacts[1];
    this.user = {
      jid: 'daniel@localhost'
    };

    this.activate();
  }

  activate() {
    // Listen for the message receive event form the Strophe Angular service
    this.$rootScope.$on('messageRecv', this.messageRecvHandler.bind(this));
  }

  // connect() {
  //   this.stropheService.connect(this.user, 'daniel', 'http://localhost:5280/http-bind');
  // }

  messageRecvHandler(event, { message, fromJid, toJid }) {
    this.recvMessage(message, fromJid, toJid);
  }

  recvMessage(message, fromJid, toJid) {
    let contact;
    // Check if the message received is our own
    if(fromJid !== this.user.jid) {
      contact = this.getContactByContactJid(fromJid);
    }
    else {
      contact = this.getContactByContactJid(this.user.jid);
    }

    // Also, if we are not currently viewing the user, increase the unread
    // message count
    if(fromJid !== this.activeContact.jid) {
      const from = this.getContactByContactJid(fromJid);
      from.unreadMessageCount += 1;
    }

    contact.messages.push({message, fromJid, toJid});
    // Update the view
    this.$scope.$apply();
  }

  sendMessage() {
    this.stropheService.sendMessage(this.message, this.user.jid, this.activeContact.jid);

    const message = this.message;
    const fromJid = this.user.jid;
    const toJid = this.activeContact.jid;

    const contact = this.getContactByContactJid(toJid);
    contact.messages.push({message, fromJid, toJid});
    this.message = '';
  }

  newMessage() {
    alert('ok new message');
  }

  changeContactViewWithIndex(index) {
    console.log('changing view to contact', this.contacts[index].name);
    this.activeContact = this.contacts[index];
    // Reset the unread message count as the act of changing the view is reading
    // the messages
    this.activeContact.unreadMessageCount = 0;
    // load messages from this user
  }

  getAllMessagesFromContact(contactJid) {
    return this.getContactByContactJid(contactJid).messages;
  }

  getIndexByContactJid(jid) {
    return this.contacts.findIndex(x => x.jid === jid);
  }

  getContactByContactJid(jid) {
    const filtered = this.contacts.filter(x => x.jid === jid);
    return filtered.shift();
  }
}

ChatController.$inject = ['$rootScope', '$scope', 'stropheService'];

export default ChatController;
