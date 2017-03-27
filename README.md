# ng-jabberd
Simple XMPP chat client built in Angular 1

<div style="text-align:center"><img src="https://raw.githubusercontent.com/danyim/ng-jabberd/master/src/public/demo.gif" align+'center" /></div>

## Installation
### Server
- [Follow this guide from ejabberd](https://docs.ejabberd.im/developer/install-osx/) to build the source with OSX and to get ejabberd up and running. I recommend installing Adium (`brew cask install adium`) to verify that your server works
- Verify that http_bind is enabled by navigating to [http://localhost:5280/http-bind](http://localhost:5280/http-bind).
    - If you don't see a landing page stating that XMPP over BOSH is enabled, [follow this guide to configure ejabberd and nginx](http://anders.conbere.org/2011/05/03/get_xmpp_-_bosh_working_with_ejabberd_firefox_and_strophe.html) for BOSH connections. (This step shouldn't be needed unless you're using an older version of ejabberd)
- Copy the included configuation file to the default installation directory `~/my-ejabberd`
    - `cp /config/ejabberd.yml ~/my-ejabberd/etc/` 
- Restart the server
    - `~/my-ejabberd/sbin/ejabberdctl restart`
- Verify that the server is running
    - `~/my-ejabberd/sbin/ejabberdctl status`

            $ ~/my-ejabberd/sbin/ejabberdctl status    
            The node ejabberd@localhost is started with status: started
            ejabberd 17.03.3 is running in that node

- Create a couple users
    - `~/my-ejabberd/sbin/ejabberdctl register bob localhost bob`
    - `~/my-ejabberd/sbin/ejabberdctl register alice localhost alice`  
- Open Adium (or another XMPP client) and log in as `alice@localhost : alice` on `localhost`
### Front-End
- Run `yarn` to install dependencies
- `yarn start` to start the dev server at [http://localhost:8080/](http://localhost:8080/)
- Login with the users created from above:
    - Hostname: `http://localhost:5280/http-bind`
    - Username: `bob@localhost`
    - Password: `bob`
- Click the + and add `alice@localhost` as a new recipient 
- Verify you can send and receive messages from `alice@localhost`

## Limitations
- (Major) Registration of new users will have to be done manually on the server due to the Strophe JS register plugin not sending the correct stanzas
    - Create a user on the server: `~/my-ejabberd/sbin/ejabberdctl register <user> localhost <password>`
    - Login as `<user>@localhost` for the username on the frontend
- (Minor) Unable to get a chatstatus or a presence stanza from the ejabberd server, therefore no typing notification or (true) online status. The online status shown in the app assumes they're online if the other party is sending a message.
- (Minor) Reattaching sessions after a browser refresh is still a work in progress. Partial implementation can be found in `/src/strophe.service.js` via the `reattach()` function
- (Minor) [StropheJS doesn't play well with Webpack and AMD](https://github.com/strophe/strophejs/issues/166) ([another source](https://github.com/strophe/strophejs/issues/220)), so this project defines them manually in `<script>` tags inside `/public/index.html` and uses [Webpack's `externals` option to expose the global](https://webpack.js.org/configuration/externals/#components/sidebar/sidebar.jsx)

## Resources
- [Angular 1.6 ES6 Style Guide](https://github.com/rwwagner90/angular-styleguide-es6)

## License
MIT
