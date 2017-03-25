import { Strophe } from 'strophe.js';

class StropheService {
  constructor() {
    this.credentials = null;
    this.hostname = null;
    this._conn = null;

    console.log('StropheService injected');
  }

  setCredentials(username, password) {
    this.username = username;
    this.credentials = {
      username,
      password
    };
  }

  setHostName(hostname) {
    this.hostname = hostname
  }

  connect(username, password, hostname) {
    if (!this.hostname && !hostname) {
      console.log('No hostname defined');
      return;
    }
    if (!this.credentials || !username || !password) {
      console.log('Credentials not defined');
      return;
    }
    this.setCredentials(username, password);
    this.setHostName(hostname);

    this._conn = new Strophe.Connection(this.hostname);
    this._conn.connect(
      this.credentials.username,
      this.credentials.password,
      this.onConnect
    );

    // this._conn.rawInput = this.rawInput;
    // this._conn.rawOutput = this.rawOutput;
    this._conn.addHandler(StropheService.onMessage, null, 'message', null, null,  null);
    this._conn.addHandler(StropheService.onOwnMessage, null, 'iq', 'set', null,  null);
  }

  sendMessage(message, recipient) {
    console.log(`sending to ${recipient}: `, this.message);
  }

  getMessages(user) {
    console.log(`getting messages from ${user}`);
  }

  static onConnect(status) {
    if (status === Strophe.Status.CONNECTING) {
      console.log('Strophe is connecting.');
    } else if (status === Strophe.Status.CONNFAIL) {
      console.log('Strophe failed to connect.');
      // $('#connect').get(0).value = 'connect';
    } else if (status === Strophe.Status.DISCONNECTING) {
      console.log('Strophe is disconnecting.');
    } else if (status === Strophe.Status.DISCONNECTED) {
      console.log('Strophe is disconnected.');
      // $('#connect').get(0).value = 'connect';
    } else if (status === Strophe.Status.CONNECTED) {
      console.log('Strophe is connected.');
      //connection.disconnect();
      console.log(`Connected as ${this.jid}`);

      // debugger;
      // if(_strophe !== null) {
      //   this.send(_strophe.$pres().tree());
      // }
    }
  }

  rawInput(data) {
    console.log('in:', data);
  }

  rawOutput(data) {
    console.log('out:', data);
  }

  static onMessage(msg) {
    debugger;
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    if (type === 'chat' && elems.length > 0) {
      var body = elems[0];
      console.log(`Inc message ${from}: ${Strophe.getText(body)}`);
      var text = Strophe.getText(body) + ' (this is echo)';

      //var reply = $msg({to: from, from: to, type: 'chat', id: 'purple4dac25e4'}).c('active', {xmlns: "http://jabber.org/protocol/chatstates"}).up().cnode(body);
                //.cnode(Strophe.copyElement(body));
      //connection.send(reply.tree());
      // console.log('ECHOBOT: I sent ' + from + ': ' + Strophe.getText(body));
    }

    // we must return true to keep the handler alive.
    // returning false would remove it after it finishes.
    return true;
  }

  onOwnMessage(msg) {
    debugger;
    console.log(msg);
    var elems = msg.getElementsByTagName('own-message');
    if (elems.length > 0) {
      var own = elems[0];
      var to = msg.getAttribute('to');
      var from = msg.getAttribute('from');
      var iq = $iq({
        to: from,
        type: 'error',
        id: msg.getAttribute('id')
      }).cnode(own).up().c('error', {type: 'cancel', code: '501'})
      .c('feature-not-implemented', {xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas'});
      connection.sendIQ(iq);
    }
    return true;
  }

  static stropheServiceFactory() {
    return new StropheService();
  }
}

StropheService.$inject = [''];

export default StropheService;
