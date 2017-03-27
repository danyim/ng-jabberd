/* globals Strophe, $msg, $iq */
const COOKIE_JID_KEY = 'ngJabber_session_jid';
const COOKIE_RID_KEY = 'ngJabber_session_rid';
const COOKIE_SID_KEY = 'ngJabber_session_sid';
const COOKIE_HOST_KEY = 'ngJabber_session_host';

class StropheService {
  constructor($rootScope, $q, $cookies, strophe) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$cookies = $cookies;

    this._credentials = null;
    this._hostname = null;
    this._user = {
      jid: null
    };

    this._conn = null;
    this._connectPromise = null;
    this._Strophe = strophe;

    /* WIP: Partial implementation of session reattachment */
    // const previousSession = {
    //   jid: $cookies.get(COOKIE_JID_KEY),
    //   sid: $cookies.get(COOKIE_SID_KEY),
    //   rid: $cookies.get(COOKIE_RID_KEY),
    //   host: $cookies.get(COOKIE_HOST_KEY),
    // };

    // if(previousSession
    //   && previousSession.jid
    //   && previousSession.sid
    //   && previousSession.rid
    //   && previousSession.host) {
    //   this.reattach(
    //     previousSession.jid,
    //     previousSession.sid,
    //     previousSession.rid,
    //     previousSession.host
    //   );
    // }
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

  get user() {
    return this._user;
  }

  set user(user) {
    if(user) {
      this._user = user;
    }
  }

  get hostname() {
    return this._hostname;
  }

  set hostname(hostname) {
    if(hostname) {
      this._hostname = hostname;
    }
  }

  reattach(jid, sid, rid, hostname) {
    if (!this.hostname && !hostname) {
      console.log('No hostname defined');
      return;
    }

    this._conn = new this._Strophe.Connection(hostname);
    // Must add 1 to the RID to authenticate correctly
    this._conn.attach(jid, sid, parseInt(rid, 10) + 1, function(status) {
      // console.log('reattached?', a);
      for(let v in Strophe.Status) {
        if(Strophe.Status.hasOwnProperty(v) && Strophe.Status[v] === status) {
          console.log('Strophe', v);
          break;
        }
      }
    });
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
    const onOwnMessage = this.onOwnMessage.bind(this);
    const onNotificationReceived = this.onNotificationReceived.bind(this);
    const onPresenceChange = this.onPresenceChange.bind(this);
    const cookies = this.$cookies;
    const cachedHostname = this.hostname;
    let setUser = function(jid) {
      this.user = {
        jid
      };
    };
    setUser = setUser.bind(this);

    this._conn.connect(
      this.credentials.username,
      this.credentials.password,
      function(status) {
        // 'this' is Strophe.Connection
        if (status === Strophe.Status.CONNECTING) {
          console.log('Strophe is connecting...');
        } else if (status === Strophe.Status.CONNFAIL) {
          console.log('Strophe failed to connect!');
          connectPromise.reject('Failed to connect.');
        } else if (status === Strophe.Status.DISCONNECTING) {
          console.log('Strophe is disconnecting.');
        } else if (status === Strophe.Status.DISCONNECTED) {
          console.log('Strophe is disconnected.');
          connectPromise.reject('Disconnected.');
        } else if(status == Strophe.Status.AUTHFAIL) {
          connectPromise.reject('Invalid username or password.');
        } else if (status === Strophe.Status.CONNECTED) {
          console.log(`Success! Strophe is connected as ${this.jid}.`);

          /* WIP: Partial implementation of session reattachment */
          // // Once connected, store the JID and the hostname for reattaching the
          // // session later
          // cookies.put(COOKIE_JID_KEY, this.jid);
          // cookies.put(COOKIE_HOST_KEY, cachedHostname);
          // // Another way of getting RID/SID for attach
          // const rid = this._proto.rid;
          // const sid = this._proto.sid;
          setUser(this.jid);

          this.addHandler(onMessage, null, 'message');
          this.addHandler(onOwnMessage, null, 'iq', 'set', null,  null);
          this.addHandler(onNotificationReceived, null, 'message', 'chat', null,  null);
          this.send($pres().tree()); // Send presence stanza

          // Register a hook for presence change
          const inquiry = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
          this.sendIQ(inquiry, onPresenceChange);

          // Send a test message on connect
          // const msgQ = $msg({to: 'alice@localhost', type: 'chat'}).c('body').t(`Sheesh, I'm finally connected.`);
          // this.send(msgQ);
          connectPromise.resolve();
        }
      }
    );

    this._conn.xmlInput = this.xmlInput.bind(this);
    this._conn.xmlOutput = this.xmlOutput.bind(this);

    return connectPromise;
  }

  /**
   * This doesn't work...
   *
   * Unreasonable ejabberd server error when attempting to register:
   * <0.4469.0>@ejabberd_bosh:check_bosh_module:1019 You are trying to use BOSH
   * (HTTP Bind) in host <<"http:">>, but the module mod_bosh is not started in
   * that host. Configure your BOSH client to connect to the correct host, or
   * add your desired host to the configuration, or check your 'modules' section
   * in your ejabberd configuration file.
   */
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

    const connection = this._conn;
    const onMessage = StropheService.onMessage;

    this._conn.register.connect(
      this.hostname,
      function(status) {
        debugger;
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
          this.register.submit();
        } else if (status === Strophe.Status.REGISTERED) {
          console.log('registration complete!')
          this.authenticate();
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

    this._conn.xmlInput = this.xmlInput.bind(this);
    this._conn.xmlOutput = this.xmlOutput(this);

    return connectPromise;
  }

  xmlInput(e) {
    // console.log('in:', e);
  }

  xmlOutput(e) {
    // console.log('out:', e);

    /* WIP: Partial implementation of session reattachment */
    // const rid = e.getAttribute('sid');
    // const sid = e.getAttribute('sid');
    // console.log(`rid: ${rid}, sid: ${sid}`);
    // // This may not be the most efficient... but
    // // Capture the RID and SID tokens to reattach the session once we reload the
    // // page
    // this.$cookies.put(COOKIE_RID_KEY, rid);
    // this.$cookies.put(COOKIE_SID_KEY, sid);
  }

  sendMessage(message, fromJid, toJid) {
    if(!this._conn) {
      throw new Error('Not connected to a server');
    }
    const query = $msg({ to: toJid, type: 'chat' })
      .c('body')
      .t(message);
    this._conn.send(query);
  }

  onMessage(msg) {
    // Unpack the XML that gets returned
    const to = msg.getAttribute('to').split('/')[0];
    const from = msg.getAttribute('from').split('/')[0];
    const type = msg.getAttribute('type');
    const elems = msg.getElementsByTagName('body');

    if (type === 'chat' && elems.length > 0) {
      const body = elems[0];
      // console.log(`Inc message ${from}: ${Strophe.getText(body)}`);

      const envelope = {
        message: Strophe.getText(body),
        fromJid: from,
        toJid: to
      };
      this.$rootScope.$emit('messageRecv', envelope);
    }

    // Return true to keep the handler alive, otherwise it will remove the
    // handler after it finishes
    return true;
  }


  // Unused, never called even though the hook is there
  onOwnMessage(msg) {
    debugger;
    const elems = msg.getElementsByTagName('own-message');
    if (elems.length > 0) {
      const own = elems[0];
      const to = msg.getAttribute('to');
      const from = msg.getAttribute('from');
      const iq = $iq({
          to: from,
          type: 'error',
          id: msg.getAttribute('id')
      })
        .cnode(own)
        .up()
        .c('error', {type: 'cancel', code: '501'});

      // .c('feature-not-implemented', {xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas'});
      this._conn.sendIQ(iq);
    }
    return true;
  }

  onNotificationReceived(a) {
    // console.log('notification', a);
    // This method _should_ be the hook for chatstates (typing indicators), but
    // ejabberd isn't sending any stanzas when typing state changes...

    return true;
  }

  onPresenceChange(presence) {
    // This method should be the hook for the presence, but again, ejabbered
    // doesn't send the stanzas when a user comes online. Perhaps they need to
    // be added to the user's roster? That will involve adding the
    // Strophe.Roster plugin and having an explicit 'friend request' sent to all
    // contacts you'd like to be notified of if/when they come online.

    // console.log('presence change detected', presence);
    // const rosterList = presence.getElementsByTagName
    // your_roster_callback_function(iq){
    //   $(iq).find('item').each(function(){
    //     var jid = $(this).attr('jid'); // The jabber_id of your contact
    //     // You can probably put them in a unordered list and and use their jids as ids.
    //   });
    //   App.connection.addHandler(App.on_presence, null, "presence");
    //   App.connection.send($pres());
    // }

    // this.$rootScope.$emit('presenceChanged', presence);

    return true;
  }
}

export default StropheService;
