/* globals Strophe */
// import './strophe-utils';

class StropheService {
  constructor($rootScope, $q, strophe) {
    this.$q = $q;
    this.$rootScope = $rootScope;

    this._credentials = null;
    this._hostname = null;
    this._conn = null;
    this._connectPromise = null;
    this._Strophe = strophe;
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

    this._conn = new this._Strophe.Connection(this.hostname);
    const onMessage = this.onMessage.bind(this);
    const onOwnMessage = this.onOwnMessage;

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
          connectPromise.reject('Invalid username or password.');
        } else if (status === Strophe.Status.CONNECTED) {
          // console.log('Strophe is connected.');
          console.log(`Connected as ${this.jid}`);
          // debugger;

          this.addHandler(onMessage, null, 'message');
          this.addHandler(onMessage, null, 'iq', 'set', null,  null);
          this.send($pres().tree()); // Send prescence
          var sendMessageQuery = $msg({to: 'alice@localhost', type: 'chat'}).c('body').t(`I'm finally connected`);
          this.send(sendMessageQuery);
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

    this._conn = new this._Strophe.Connection(this.hostname);

    const aConnection = this._conn;
    const onMessage = StropheService.onMessage;

    this._conn.register.connect(
      this.hostname,
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
        } else if (status === Strophe.Status.REGISTER) {
          console.log('registering');
          this.register.fields.username = this.credentials.username;
          this.register.fields.password = this.credentials.password;
        } else if (status === Strophe.Status.REGISTERED) {
          console.log('registration complete!')
        } else if (status === Strophe.Status.CONFLICT) {
          console.log('contact already exists');
          connectPromise.reject();
        } else if (status === Strophe.Status.NOTACCEPTABLE) {
          console.log("Registration form not properly filled out.");
          connectPromise.reject();
        } else if (status === Strophe.Status.REGIFAIL) {
          console.log("The Server does not support In-Band Registration");
          connectPromise.reject();
        } else if (status === Strophe.Status.CONNECTED) {
          // console.log('Strophe is connected.');
          console.log(`Connected! as ${this.jid}`);
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

    debugger;
    console.log(`sending to ${recipient}:`, message);
    const messageQuery = $msg({to: recipient, type: 'chat'}).c('body').t(message);
    this._conn.send(messageQuery);
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

  onMessage(msg) {
    const to = msg.getAttribute('to');
    const from = msg.getAttribute('from');
    const type = msg.getAttribute('type');
    const elems = msg.getElementsByTagName('body');

    if (type === 'chat' && elems.length > 0) {
      const body = elems[0];
      console.log(`Inc message ${from}: ${Strophe.getText(body)}`);
      // const text = Strophe.getText(body) + ' (this is echo)';
      const envelope = {
        message: Strophe.getText(body),
        author: from
      };
      this.$rootScope.$emit('messageRecv', envelope);
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

StropheService.$inject = ['$rootScope' ,'$q', 'strophe'];

export default StropheService;
