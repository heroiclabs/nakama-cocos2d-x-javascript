Nakama Cocos2d-x JavaScript client
========================

> JavaScript client for Nakama server and Cocos2d-x projects.

[Nakama](https://github.com/heroiclabs/nakama) is an open-source server designed to power modern games and apps. Features include user accounts, chat, social, matchmaker, realtime multiplayer, and much [more](https://heroiclabs.com).

This client implements the full API and socket options with the server.

Full documentation is online - https://heroiclabs.com/docs/javascript-client-guide

## Getting Started

You'll need to setup the server and database before you can connect with the client. The simplest way is to use Docker but have a look at the [server documentation](https://github.com/heroiclabs/nakama#getting-started) for other options.

1. Install and run the servers. Follow these [instructions](https://heroiclabs.com/docs/install-docker-quickstart).

2. Import the client into your project:

  - Download latest [release](https://github.com/heroiclabs/nakama-cocos2d-x-javascript/releases/latest)

  - Extract it to `src` folder of your project.

  - Import into your `project.json`:

```json
"jsList" : [
  ...
  "src/NakamaSDK/ThirdParty/polyfill.min.js",
  "src/NakamaSDK/nakama-js.umd.js"
]
```

## Usage

The client object has many methods to execute various features in the server or open realtime socket connections with the server.

### Authenticate

There's a variety of ways to [authenticate](https://heroiclabs.com/docs/authentication) with the server. Authentication can create a user if they don't already exist with those credentials. It's also easy to authenticate with a social profile from Google Play Games, Facebook, Game Center, etc.

```js
var email = "super@heroes.com";
var password = "batsignal";

client.authenticateEmail({
  email: email,
  password: password
}).then(function(session) {
        cc.log("Authenticated successfully. User id:", session.user_id);
    },
    function(error) {
        cc.error("authenticate failed:", JSON.stringify(error));
    });
```

### Sessions

When authenticated the server responds with an auth token (JWT) which contains useful properties and gets deserialized into a `Session` object.

```js
cc.log(session.token); // raw JWT token
cc.log(session.userId);
cc.log(session.username);
cc.log("Session has expired?", session.isexpired(Date.now() / 1000));
const expiresat = session.expires_at;
cc.warn("Session will expire at", new Date(expiresat * 1000).toISOString());
```

It is recommended to store the auth token from the session and check at startup if it has expired. If the token has expired you must reauthenticate. The expiry time of the token can be changed as a setting in the server.

```js
// Assume we've stored the auth token in Local Storage.
const authtoken = cc.sys.localStorage.getItem("nkauthtoken");
const session = nakamajs.Session.restore(authtoken);
if (session.isexpired(Date.now() / 1000)) {
    cc.warn("Session has expired. Must reauthenticate.");
}
```

### Requests

The client includes lots of builtin APIs for various features of the game server. These can be accessed with the methods which return Promise objects. It can also call custom logic as RPC functions on the server. These can also be executed with a socket object.

All requests are sent with a session object which authorizes the client.

```js
client.getAccount(session)
  .then(function(account) {
        cc.log(account.user.id);
        cc.log(account.user.username);
        cc.log(account.wallet);
    },
    function(error) {
        cc.error("getAccount failed:", JSON.stringify(error));
    });
```

### Socket

The client can create one or more sockets with the server. Each socket can have it's own event listeners registered for responses received from the server.

```js
const secure = false; // enable if server is run with an SSL certificate
const trace = false;
const createStatus = false;    // set `true` to send presence events to subscribed users.
const socket = client.createSocket(secure, trace);
socket.ondisconnect = (evt) => {
    cc.log("Disconnected from the server. Event:", JSON.stringify(event));
};

socket.connect(session, createStatus)
  .then(
        function() {
            cc.log("connected");
        },
        function(error) {
            cc.error("connect failed:", JSON.stringify(error));
        }
    );
```

There's many messages for chat, realtime, status events, notifications, etc. which can be sent or received from the socket.

```js
socket.onchannelmessage = (message) => {
    cc.log("Message received from channel", message.channel_id);
    cc.log("Received message", message);
};

const roomname = "mychannel";
socket.send({ channel_join: {
    type: 1, // 1 = room, 2 = Direct Message, 3 = Group
    target: roomname,
    persistence: false,
    hidden: false
} }).then(
      function(response) {
          cc.log("Successfully joined channel:", response.channel.id);
      },
      function(error) {
          cc.error("join channel failed:", JSON.stringify(error));
      }
  );

const message = { "hello": "world" };
socket.send({ channel_message_send: {
    channel_id: channel.channel.id,
    content: message
} });
```

## Contribute

The development roadmap is managed as GitHub issues and pull requests are welcome. If you're interested to enhance the code please open an issue to discuss the changes or drop in and discuss it in the [community forum](https://forum.heroiclabs.com).

### Example

Examples for cocos-2d-js an Cocos Creator are located in the [examples](https://github.com/heroiclabs/nakama-cocos2d-x-javascript/tree/master/examples) folder.

### License

This project is licensed under the [Apache-2 License](https://github.com/heroiclabs/nakama-dotnet/blob/master/LICENSE).
