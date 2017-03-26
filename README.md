# ng-jabberd
Simple XMPP chat client built in Angular 1

### Installation
- [Follow this guide from ejabberd](https://docs.ejabberd.im/developer/install-osx/) to build the source with OSX and to get ejabberd up and running. I recommend installing Adium (`brew cask install adium`) to verify that your server works
- Verify that http_bind is enabled by navigating to [http://localhost:5280/http-bind](http://localhost:5280/http-bind).
    - If you don't see a landing page stating that XMPP over BOSH is enabled, [follow this guide to configure ejabberd and nginx](http://anders.conbere.org/2011/05/03/get_xmpp_-_bosh_working_with_ejabberd_firefox_and_strophe.html) for BOSH connections.
- Run `yarn` to install dependencies
- `yarn start` to start the dev server @ [http://localhost:8080/](http://localhost:8080/)

### Problems
- [StropheJS doesn't play well with Webpack and AMD](https://github.com/strophe/strophejs/issues/166) ([another source](https://github.com/strophe/strophejs/issues/220)), so we will have to define it manually in `index.html` and use [Webpack's `externals` option to expose it](https://webpack.js.org/configuration/externals/#components/sidebar/sidebar.jsx)

### License
MIT
