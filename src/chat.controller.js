class ChatController {
  constructor($rootScope, $scope, $timeout, ModalService, stropheService) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.ModalService = ModalService;

    this.activate = this.activate.bind(this, this.activate);
    this.stropheService = stropheService;

    this.recipient = '';
    this.message = '';
    this.totalUnreadCount = 0;

    this.contacts = [];

    this.activeContact = this.contacts[1];
    this.user = stropheService.user;
    console.log('user is', this.user)

    this.activate();
  }

  activate() {
    // Listen for the message receive event form the Strophe Angular service
    this.$rootScope.$on('messageRecv', this.messageRecvHandler.bind(this));
  }

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

    // If we tried to find a contact and couldn't find one, assume this is a new
    // contact and we'll need to create one
    if(!contact) {
      contact = this.createContact(fromJid);
      // Automatically assume they're online if they're sending you messages...
      contact.online = true;
    }

    // Also, if we are not currently viewing the user, increase the unread
    // message count
    if(!this.activeContact || fromJid !== this.activeContact.jid) {
      const from = this.getContactByContactJid(fromJid);
      from.unreadMessageCount += 1;
      this.totalUnreadCount += 1;
    }

    contact.messages.push({message, fromJid, toJid});
    // Update the view
    this.$scope.$apply();
  }

  createContact(jid, name) {
    const newContact = {
      name: name ? name : jid,
      jid: jid,
      unreadMessageCount: 0,
      online: false,
      messages: []
    };

    this.contacts.push(newContact);
    return newContact;
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
    this.ModalService.showModal({
      template: require('./new-message.html'),
      controller: 'newMessageController',
      controllerAs: 'vm',
      bodyClass: 'modal-open'
    }).then((modal) => {
      modal.close.then((result) => {
        if(result) {
          let index = this.getIndexByContactJid(result);
          // Look for the contact. If it exists, change to the view. If it
          // doesn't, make a contact object
          if(index < 0) {
            this.createContact(result);
            index = this.contacts.length - 1;
          }

          this.changeContactViewWithIndex(index);
        }
      });
    })
  }

  changeContactViewWithIndex(index) {
    // console.log('changing view to contact', this.contacts[index].name);
    this.activeContact = this.contacts[index];
    // Reset the unread message count as the act of changing the view is reading
    // the messages
    this.totalUnreadCount -= this.activeContact.unreadMessageCount;
    this.activeContact.unreadMessageCount = 0;

    // Load backlogged messages from this user from the server?

    // Focus on the input
    this.$timeout(() => {
      const input = document.getElementById('chat-message');
      if(input) {
        input.focus();
      }
    }, 100);
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

export default ChatController;
