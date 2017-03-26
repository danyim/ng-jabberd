/* globals Strophe */
// import { Strophe } from 'strophe.js';
// import { StropheRegister } from 'strophejs-plugins/register/strophe.register';
// import './strophe-utils';

class StropheService {
  constructor($q, strophe) {
    this.$q = $q;

    this._credentials = null;
    this._hostname = null;
    this._conn = null;
    this._connectPromise = null;
    this._Strophe = strophe;

    // this.registerConnect = this.registerConnect.bind(this, this.registerConnect);
  }

  get credentials() {
    return this._credentials;
  }

  set credentials({username, password}) {
    this._credentials = {
      username,
      password
    };
  }

  get hostname() {
    return this._hostname;
  }

  set hostname(hostname) {
    if(hostname) {
      this._hostname = hostname;
    }
  }

  connect(username, password, hostname) {
    const connectPromise = this.$q.defer();

    if (!this.hostname && !hostname) {
      console.log('No hostname defined');
      return;
    }
    if (!username || !password) {
      console.log('Credentials not defined');
      return;
    }
    this.credentials = {username, password};
    this.hostname = hostname;

    debugger;

    this._conn = new Strophe.Connection(this.hostname);
    const connection = this._conn;
    const onMessage = StropheService.onMessage;
    this._conn.connect(
      this.credentials.username,
      this.credentials.password,
      function(status) {
        if (status === Strophe.Status.CONNECTING) {
          console.log('Strophe is connecting.');
        } else if (status === Strophe.Status.CONNFAIL) {
          console.log('Strophe failed to connect.');
          connectPromise.reject('Failed to connect.');
        } else if (status === Strophe.Status.DISCONNECTING) {
          console.log('Strophe is disconnecting.');
        } else if (status === Strophe.Status.DISCONNECTED) {
          console.log('Strophe is disconnected.');
          connectPromise.reject('Disconnected.');
        } else if(status == Strophe.Status.AUTHFAIL) {
          connectPromise.reject('Invalid username or password');
        } else if (status === Strophe.Status.CONNECTED) {
          // console.log('Strophe is connected.');
          console.log(`Connected as ${this.jid}`);
          debugger;
          // check if this._conn has a value here..
          this.addHandler(onMessage, null, 'message', null, null,  null);
          connectPromise.resolve();
        }
      }
    );

    this._conn.rawInput = this.rawInput;
    this._conn.rawOutput = this.rawOutput;

    // this._conn.addHandler(StropheService.onOwnMessage, null, 'iq', 'set', null,  null);

    return connectPromise;
  }

  registerConnect(username, password, hostname) {
    const connectPromise = this.$q.defer();

    if (!this.hostname && !hostname) {
      console.log('No hostname defined');
      return;
    }
    if (!username || !password) {
      console.log('Credentials not defined');
      return;
    }
    this.credentials = {username, password};
    this.hostname = hostname;

    this._conn = new Strophe.Connection(this.hostname);

    const connection = this._conn;
    const onMessage = StropheService.onMessage;

    this._conn.register.connect(
      this.credentials.username,
      this.credentials.password,
      function(status) {
        if (status === Strophe.Status.CONNECTING) {
          console.log('Strophe is connecting.');
        } else if (status === Strophe.Status.CONNFAIL) {
          console.log('Strophe failed to connect.');
          connectPromise.reject('Failed to connect.');
        } else if (status === Strophe.Status.DISCONNECTING) {
          console.log('Strophe is disconnecting.');
        } else if (status === Strophe.Status.DISCONNECTED) {
          console.log('Strophe is disconnected.');
          connectPromise.reject('Disconnected.');
        } else if (status === Strophe.Status.CONNECTED) {
          // console.log('Strophe is connected.');
          console.log(`Connected as ${this.jid}`);
          debugger;
          // check if this._conn has a value here..
          this.addHandler(onMessage, null, 'message', null, null,  null);
          connectPromise.resolve();
        }
      }
    );

    this._conn.rawInput = this.rawInput;
    this._conn.rawOutput = this.rawOutput;

    // this._conn.addHandler(StropheService.onOwnMessage, null, 'iq', 'set', null,  null);

    return connectPromise;
  }

  sendMessage(message, recipient) {
    console.log(`sending to ${recipient}:`, message);
    debugger;
  }

  getMessages(user) {
    console.log(`getting messages from ${user}`);
  }

  static onConnect(status) {
    if (status === Strophe.Status.CONNECTING) {
      console.log('Strophe is connecting.');
      this._connectPromise.notify('Strophe is connecting.');
    } else if (status === Strophe.Status.CONNFAIL) {
      console.log('Strophe failed to connect.');
      // $('#connect').get(0).value = 'connect';
      this._connectPromise.reject('Failed to connect.');
    } else if (status === Strophe.Status.DISCONNECTING) {
      console.log('Strophe is disconnecting.');
    } else if (status === Strophe.Status.DISCONNECTED) {
      console.log('Strophe is disconnected.');
      // $('#connect').get(0).value = 'connect';
    } else if (status === Strophe.Status.CONNECTED) {
      console.log('Strophe is connected.');
      //connection.disconnect();
      console.log(`Connected as ${this.jid}`);
      this._connectPromise.resolve(`Connected as ${this.jid}`);
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
    // console.log('out:', data);
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
}

StropheService.$inject = ['$q', 'strophe'];

export default StropheService;
