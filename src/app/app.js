import angular from 'angular';
import { Strophe } from 'strophe.js';

import '../style/app.css';

const MainDirective = () => {
  return {
    template: require('./app.html'),
    controller: 'mainCtrl',
    controllerAs: 'app'
  }
};

export default class MainCtrl {
  constructor($scope) {
    this.controllerName = 'MainCtrl';
    this.activate = this.activate.bind(this, this.activate);

    // Can't do this because Strophe binds the onConnect to Strophe.Connection
    // this.onConnect = this.onConnect.bind(this, this.onConnect);

    this.conn = null;


    // this.onConnect = this.onConnect.bind(this, this.onConnect);
    // debugger;
    this.activate();
  }

  activate() {
    this.connect('daniel@localhost', 'daniel');
  }

  connect(username = 'default', password = 'default') {
    this.conn = new Strophe.Connection('http://localhost:5280/http-bind');
    this.conn.connect(`${username}`, password, this.onConnect);
    this.conn.rawInput = this.rawInput;
    this.conn.rawOutput = this.rawOutput;
    this.conn.addHandler(this.onMessage, null, 'message', null, null,  null);
    this.conn.addHandler(this.onOwnMessage, null, 'iq', 'set', null,  null);
  }

  onConnect(status) {
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

      debugger;
      this.send(_strophe.$pres().tree());
    }
  }

  rawInput(data) {
    console.log('in:', data);
  }

  rawOuput(data) {
    console.log('out:', data);
  }

  onMessage(msg) {
    debugger;
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    if (type === "chat" && elems.length > 0) {
      var body = elems[0];
      console.log(`Inc message ${from}: ${Strophe.getText(body)}`);
      var text = Strophe.getText(body) + " (this is echo)";

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

angular.module('ngJabberd', [])
  .directive('mainDirective', MainDirective)
  .controller('mainCtrl', MainCtrl);

export default 'app';
